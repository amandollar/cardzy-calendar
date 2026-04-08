'use client';

import {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

import { GALLERY_YEAR, MONTH_IMAGES, STORAGE_KEY } from './calendar.constants';
import type {
  CopyState,
  DateRange,
  MobileDetailView,
  MonthlyTask,
  PlannerState,
  PresetId,
  SavedRangeNote,
  SelectionMode,
  ViewMode,
} from './calendar.types';
import {
  DEFAULT_HERO_IMAGE,
  applyPreset,
  buildCalendarDays,
  copyTextFallback,
  dateKey,
  deriveRangeNoteTitle,
  formatLongDate,
  formatRangeLabel,
  getDefaultSnapshot,
  getEffectiveRange,
  getRangeLength,
  getSelectedDates,
  loadStoredSnapshot,
  monthKey,
  normalizeRangeNoteEntry,
  parseRangeStorageKey,
  writeStorageItem,
  rangeStorageKey,
  startOfDay,
} from './calendar.utils';
import { MonthGallery } from './MonthGallery';
import { PlannerSidebar } from './PlannerSidebar';
import { PlannerMain } from './PlannerMain';
import { RangeNoteDialog } from './RangeNoteDialog';
import { MonthWorkspaceDialog } from './MonthWorkspaceDialog';

export default function Calendar() {
  const today = startOfDay(new Date());
  const initialSnapshot = getDefaultSnapshot();
  const hasSavedRef = useRef(false);

  const [displayMonth, setDisplayMonth] = useState(initialSnapshot.displayMonth);
  const [selection, setSelection] = useState<DateRange>(initialSnapshot.selection);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [planner, setPlanner] = useState<PlannerState>(initialSnapshot.planner);
  const [taskDraft, setTaskDraft] = useState('');
  const [rangeNoteTitleDraft, setRangeNoteTitleDraft] = useState('');
  const [rangeNoteDraft, setRangeNoteDraft] = useState('');
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [isRangeDialogOpen, setIsRangeDialogOpen] = useState(false);
  const [isMonthDialogOpen, setIsMonthDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [mobileDetailView, setMobileDetailView] = useState<MobileDetailView>('calendar');

  const scrollToTop = () => {
    if (typeof window === 'undefined') {
      return;
    }

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  useEffect(() => {
    const storedSnapshot = loadStoredSnapshot();

    startTransition(() => {
      setDisplayMonth(storedSnapshot.displayMonth);
      setSelection(storedSnapshot.selection);
      setPlanner(storedSnapshot.planner);
    });
  }, []);

  useEffect(() => {
    if (!hasSavedRef.current) {
      hasSavedRef.current = true;
      return;
    }

    const snapshot = {
      displayMonth: dateKey(displayMonth),
      monthNotes: planner.monthNotes,
      rangeNotes: planner.rangeNotes,
      tasksByMonth: planner.tasksByMonth,
      selection: {
        start: selection.start ? dateKey(selection.start) : null,
        end: selection.end ? dateKey(selection.end) : null,
      },
    };

    writeStorageItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [displayMonth, planner, selection]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(max-width: 560px)');

    const syncMobileDetailView = (event?: MediaQueryListEvent) => {
      const matchesMobile = event ? event.matches : mediaQuery.matches;
      if (!matchesMobile) {
        setMobileDetailView('calendar');
      }
    };

    syncMobileDetailView();
    mediaQuery.addEventListener('change', syncMobileDetailView);

    return () => mediaQuery.removeEventListener('change', syncMobileDetailView);
  }, []);

  const activeRange = getEffectiveRange(selection, hoveredDate);
  const selectionDays = getRangeLength(activeRange.start, activeRange.end);
  const activeMonthKey = monthKey(displayMonth);
  const activeRangeKey = rangeStorageKey(selection);
  const calendarDays = buildCalendarDays(displayMonth);
  const monthMemo = planner.monthNotes[activeMonthKey] ?? '';
  const activeTasks = planner.tasksByMonth[activeMonthKey] ?? [];
  const completedTasks = activeTasks.filter((task) => task.done).length;
  const completionRatio = activeTasks.length ? (completedTasks / activeTasks.length) * 100 : 0;
  const currentYear = today.getFullYear();
  const years = useMemo(
    () => Array.from({ length: 9 }, (_, index) => currentYear - 3 + index),
    [currentYear],
  );
  const rangeNoteCharacterCount = rangeNoteDraft.trim().length;

  const savedRangeNotes = useMemo<SavedRangeNote[]>(() => {
    const monthStart = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1);
    const nextMonthStart = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1);

    return Object.entries(planner.rangeNotes)
      .map(([key, noteEntry]) => {
        const parsed = parseRangeStorageKey(key);
        const normalized = normalizeRangeNoteEntry(noteEntry);

        if (!parsed || !normalized.body.trim()) {
          return null;
        }

        const matchesMonth =
          monthKey(parsed.start) === activeMonthKey ||
          monthKey(parsed.end) === activeMonthKey ||
          (parsed.start < nextMonthStart && parsed.end >= monthStart);

        if (!matchesMonth) {
          return null;
        }

        return {
          key,
          start: parsed.start,
          end: parsed.end,
          title: normalized.title || deriveRangeNoteTitle(normalized.body),
          body: normalized.body,
        };
      })
      .filter((entry): entry is SavedRangeNote => entry !== null)
      .sort((left, right) => left.start.getTime() - right.start.getTime());
  }, [activeMonthKey, displayMonth, planner.rangeNotes]);

  const monthlyPlanCount = savedRangeNotes.length;
  const nextUpcomingPlan =
    savedRangeNotes.find((entry) => entry.end >= today) ?? savedRangeNotes[0] ?? null;
  const heroImage = MONTH_IMAGES[displayMonth.getMonth()] ?? DEFAULT_HERO_IMAGE;

  const planDayCounts = useMemo(() => {
    const counts = new Map<string, number>();

    savedRangeNotes.forEach((entry) => {
      getSelectedDates(entry.start, entry.end).forEach((date) => {
        const key = dateKey(date);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      });
    });

    return counts;
  }, [savedRangeNotes]);

  const hasSelection = Boolean(selection.start);
  const selectionMode: SelectionMode = !selection.start
    ? 'idle'
    : selection.end
      ? 'complete'
      : 'picking-end';

  const rangePurposeText =
    selectionMode === 'idle'
      ? 'Pick a range to plan a trip, event, sprint, or focused work window.'
      : selectionMode === 'picking-end'
        ? 'Now choose the last day. The highlighted preview shows exactly what will be included.'
        : 'Your selected days are ready for notes, summaries, and planning.';

  useEffect(() => {
    if (!activeRangeKey) {
      setRangeNoteTitleDraft('');
      setRangeNoteDraft('');
      return;
    }

    const nextEntry = planner.rangeNotes[activeRangeKey];
    setRangeNoteTitleDraft(nextEntry?.title ?? '');
    setRangeNoteDraft(nextEntry?.body ?? '');
  }, [activeRangeKey, planner.rangeNotes]);

  const handleDayClick = (date: Date) => {
    const normalized = startOfDay(date);

    if (!selection.start || selection.end) {
      setSelection({ start: normalized, end: null });
      setHoveredDate(normalized);
      return;
    }

    if (normalized < selection.start) {
      setSelection({ start: normalized, end: selection.start });
      return;
    }

    setSelection({ start: selection.start, end: normalized });
    setHoveredDate(null);
  };

  const handlePresetClick = (presetId: PresetId) => {
    const preset = applyPreset(presetId, displayMonth);
    setDisplayMonth(new Date(preset.month.getFullYear(), preset.month.getMonth(), 1));
    setSelection(preset.selection);
    setHoveredDate(null);
  };

  const updateMonthMemo = (value: string) => {
    setPlanner((current) => ({
      ...current,
      monthNotes: {
        ...current.monthNotes,
        [activeMonthKey]: value,
      },
    }));
  };

  const addTask = () => {
    const value = taskDraft.trim();
    if (!value) return;

    const newTask: MonthlyTask = {
      id: `${Date.now()}`,
      text: value,
      done: false,
    };

    setPlanner((current) => ({
      ...current,
      tasksByMonth: {
        ...current.tasksByMonth,
        [activeMonthKey]: [...(current.tasksByMonth[activeMonthKey] ?? []), newTask],
      },
    }));
    setTaskDraft('');
  };

  const toggleTask = (taskId: string) => {
    setPlanner((current) => ({
      ...current,
      tasksByMonth: {
        ...current.tasksByMonth,
        [activeMonthKey]: (current.tasksByMonth[activeMonthKey] ?? []).map((task) =>
          task.id === taskId ? { ...task, done: !task.done } : task,
        ),
      },
    }));
  };

  const deleteTask = (taskId: string) => {
    setPlanner((current) => ({
      ...current,
      tasksByMonth: {
        ...current.tasksByMonth,
        [activeMonthKey]: (current.tasksByMonth[activeMonthKey] ?? []).filter(
          (task) => task.id !== taskId,
        ),
      },
    }));
  };

  const handleTaskKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTask();
    }
  };

  const copyPlanSummary = async () => {
    const activeRangeEntry = activeRangeKey ? planner.rangeNotes[activeRangeKey] : undefined;
    const currentRangeNote = activeRangeEntry?.body ?? '';
    const taskSummary = activeTasks
      .map((task) => `${task.done ? '[x]' : '[ ]'} ${task.text}`)
      .join('\n');

    const summary = [
      `${displayMonth.toLocaleString('en-US', { month: 'long' })} ${displayMonth.getFullYear()} Planner`,
      `Range: ${formatRangeLabel(activeRange.start, activeRange.end)}`,
      `From: ${formatLongDate(activeRange.start)}`,
      `To: ${formatLongDate(activeRange.end)}`,
      `Days: ${selectionDays}`,
      `Month memo: ${monthMemo || 'None'}`,
      `Range note: ${currentRangeNote || 'None'}`,
      taskSummary ? `Tasks:\n${taskSummary}` : 'Tasks: None',
    ].join('\n');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
      } else if (!copyTextFallback(summary)) {
        throw new Error('Clipboard copy failed');
      }

      setCopyState('copied');
    } catch {
      setCopyState('error');
    }

    window.setTimeout(() => setCopyState('idle'), 1800);
  };

  const saveRangeNote = () => {
    if (!activeRangeKey || !selection.start || !rangeNoteDraft.trim()) {
      return;
    }

    const trimmedNote = rangeNoteDraft.trim();
    const fallbackTitle = `Plan for ${formatRangeLabel(selection.start, selection.end ?? selection.start)}`;

    setPlanner((current) => ({
      ...current,
      rangeNotes: {
        ...current.rangeNotes,
        [activeRangeKey]: {
          title: rangeNoteTitleDraft.trim() || fallbackTitle,
          body: trimmedNote,
        },
      },
    }));

    setSelection({ start: null, end: null });
    setHoveredDate(null);
    setRangeNoteTitleDraft('');
    setRangeNoteDraft('');
    setIsRangeDialogOpen(false);
  };

  const openSavedRangeNote = (entry: SavedRangeNote) => {
    setSelection({ start: entry.start, end: entry.end });
    setHoveredDate(null);
    setRangeNoteTitleDraft(entry.title);
    setRangeNoteDraft(entry.body);
    setMobileDetailView('calendar');
    setIsRangeDialogOpen(true);
  };

  const openMonthDetail = (monthIndex: number) => {
    setDisplayMonth(new Date(GALLERY_YEAR, monthIndex, 1));
    setMobileDetailView('calendar');
    setViewMode('detail');
    scrollToTop();
  };

  if (viewMode === 'gallery') {
    return (
      <section className="animate-fade-in-up w-full">
        <MonthGallery onOpenMonth={openMonthDetail} />
      </section>
    );
  }

  return (
    <section className="animate-fade-in-up w-full">
      <div className="rounded-[1.6rem] border border-white/5 bg-[linear-gradient(180deg,rgba(18,18,22,0.98)_0%,rgba(10,10,12,0.96)_100%)] p-[0.7rem] shadow-[0_1rem_2rem_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)] xl:grid xl:grid-cols-[minmax(22rem,24rem)_minmax(0,1fr)] xl:gap-[0.85rem]">
        <PlannerSidebar
          displayMonth={displayMonth}
          heroImage={heroImage}
          nextUpcomingPlan={nextUpcomingPlan}
          monthlyPlanCount={monthlyPlanCount}
          selectionDays={selectionDays}
          activeTasks={activeTasks}
          completedTasks={completedTasks}
          savedRangeNotes={savedRangeNotes}
          activeRangeKey={activeRangeKey}
          onOpenSavedRangeNote={openSavedRangeNote}
          mobileHidden={mobileDetailView === 'calendar'}
        />

        <div className={mobileDetailView === 'plans' ? 'hidden max-[560px]:hidden xl:block' : 'block'}>
          <PlannerMain
            displayMonth={displayMonth}
            heroImage={heroImage}
            monthlyPlanCount={monthlyPlanCount}
            mobileDetailView={mobileDetailView}
            years={years}
            copyState={copyState}
            hasSelection={hasSelection}
            selectionMode={selectionMode}
            rangePurposeText={rangePurposeText}
            activeRangeLabel={formatRangeLabel(activeRange.start, activeRange.end)}
            today={today}
            calendarDays={calendarDays}
            activeRange={activeRange}
            planDayCounts={planDayCounts}
            onSetMobileDetailView={setMobileDetailView}
            onGoBackToGallery={() => {
              setViewMode('gallery');
              scrollToTop();
            }}
            onPresetClick={handlePresetClick}
            onMonthChange={(monthIndex) => setDisplayMonth(new Date(displayMonth.getFullYear(), monthIndex, 1))}
            onYearChange={(year) => setDisplayMonth(new Date(year, displayMonth.getMonth(), 1))}
            onGoToTodayMonth={() => setDisplayMonth(new Date(today.getFullYear(), today.getMonth(), 1))}
            onOpenMonthDialog={() => setIsMonthDialogOpen(true)}
            onPreviousMonth={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1))}
            onNextMonth={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1))}
            onOpenRangeDialog={() => setIsRangeDialogOpen(true)}
            onCopyPlanSummary={copyPlanSummary}
            onClearSelection={() => {
              setSelection({ start: null, end: null });
              setHoveredDate(null);
            }}
            onDayClick={handleDayClick}
            onDayHoverChange={(date) => setHoveredDate(date ? startOfDay(date) : null)}
          />
        </div>
      </div>

      <RangeNoteDialog
        isOpen={isRangeDialogOpen}
        selection={selection}
        rangeNoteCharacterCount={rangeNoteCharacterCount}
        rangeNoteTitleDraft={rangeNoteTitleDraft}
        rangeNoteDraft={rangeNoteDraft}
        onClose={() => setIsRangeDialogOpen(false)}
        onTitleChange={setRangeNoteTitleDraft}
        onNoteChange={setRangeNoteDraft}
        onSave={saveRangeNote}
      />

      <MonthWorkspaceDialog
        isOpen={isMonthDialogOpen}
        displayMonth={displayMonth}
        completionRatio={completionRatio}
        monthMemo={monthMemo}
        taskDraft={taskDraft}
        activeTasks={activeTasks}
        onClose={() => setIsMonthDialogOpen(false)}
        onMonthMemoChange={updateMonthMemo}
        onTaskDraftChange={setTaskDraft}
        onTaskKeyDown={handleTaskKeyDown}
        onAddTask={addTask}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
      />
    </section>
  );
}

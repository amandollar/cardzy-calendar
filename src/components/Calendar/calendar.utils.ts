import { DEFAULT_HERO_IMAGE, STORAGE_KEY } from './calendar.constants';
import type {
  CalendarDay,
  DateRange,
  PlannerSnapshot,
  PlannerState,
  PresetId,
  RangeNoteEntry,
  StoredSnapshot,
} from './calendar.types';

export function startOfDay(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function monthKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${year}-${month}`;
}

export function parseStoredDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return startOfDay(parsed);
}

export function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) {
    return false;
  }

  return dateKey(a) === dateKey(b);
}

export function getEffectiveRange(selection: DateRange, hoveredDate: Date | null) {
  if (!selection.start) {
    return { start: null, end: null };
  }

  if (selection.end) {
    return { start: selection.start, end: selection.end };
  }

  if (!hoveredDate) {
    return { start: selection.start, end: selection.start };
  }

  return hoveredDate < selection.start
    ? { start: hoveredDate, end: selection.start }
    : { start: selection.start, end: hoveredDate };
}

export function getRangeLength(start: Date | null, end: Date | null) {
  if (!start || !end) {
    return 0;
  }

  return Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1;
}

export function formatRangeLabel(start: Date | null, end: Date | null) {
  if (!start || !end) {
    return 'No dates selected';
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  });

  if (dateKey(start) === dateKey(end)) {
    return formatter.format(start);
  }

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

export function formatLongDate(date: Date | null) {
  if (!date) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function rangeStorageKey(selection: DateRange) {
  if (!selection.start) {
    return '';
  }

  const start = dateKey(selection.start);
  const end = dateKey(selection.end ?? selection.start);
  return `${start}:${end}`;
}

export function buildCalendarDays(displayMonth: Date): CalendarDay[] {
  const firstOfMonth = new Date(
    displayMonth.getFullYear(),
    displayMonth.getMonth(),
    1,
  );
  const start = new Date(firstOfMonth);
  const leadingDays = (firstOfMonth.getDay() + 6) % 7;
  start.setDate(start.getDate() - leadingDays);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return {
      date,
      inMonth: date.getMonth() === displayMonth.getMonth(),
    };
  });
}

export function getWeekendRange(baseDate: Date) {
  const normalized = startOfDay(baseDate);
  const saturday = new Date(normalized);
  const daysUntilSaturday = (6 - normalized.getDay() + 7) % 7;
  saturday.setDate(normalized.getDate() + daysUntilSaturday);

  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);

  return { start: saturday, end: sunday };
}

export function applyPreset(id: PresetId, referenceMonth: Date) {
  const today = startOfDay(new Date());

  switch (id) {
    case 'today':
      return {
        month: new Date(today.getFullYear(), today.getMonth(), 1),
        selection: { start: today, end: today },
      };
    case 'weekend': {
      const selection = getWeekendRange(today);
      return {
        month: new Date(
          selection.start.getFullYear(),
          selection.start.getMonth(),
          1,
        ),
        selection,
      };
    }
    case 'next7': {
      const end = new Date(today);
      end.setDate(today.getDate() + 6);
      return {
        month: new Date(today.getFullYear(), today.getMonth(), 1),
        selection: { start: today, end },
      };
    }
    case 'thisMonth': {
      const start = new Date(
        referenceMonth.getFullYear(),
        referenceMonth.getMonth(),
        1,
      );
      const end = new Date(
        referenceMonth.getFullYear(),
        referenceMonth.getMonth() + 1,
        0,
      );
      return { month: start, selection: { start, end } };
    }
    case 'clear':
      return { month: referenceMonth, selection: { start: null, end: null } };
  }
}

export function getRangeBreakdown(start: Date | null, end: Date | null) {
  if (!start || !end) {
    return { weekdays: 0, weekends: 0 };
  }

  let weekdays = 0;
  let weekends = 0;
  const cursor = new Date(start);

  while (cursor <= end) {
    const day = cursor.getDay();
    if (day === 0 || day === 6) {
      weekends += 1;
    } else {
      weekdays += 1;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return { weekdays, weekends };
}

export function getSelectedDates(start: Date | null, end: Date | null) {
  if (!start || !end) {
    return [];
  }

  const dates: Date[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function copyTextFallback(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);
  return copied;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function getFocusableElements(container: HTMLElement | null) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true',
  );
}

export function readStorageItem(key: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorageItem(key: string, value: string) {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(key: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage cleanup failures in restricted browser contexts.
  }
}

export function parseRangeStorageKey(key: string) {
  const [startRaw, endRaw] = key.split(':');
  const start = parseStoredDate(startRaw);
  const end = parseStoredDate(endRaw);

  if (!start || !end) {
    return null;
  }

  return { start, end };
}

export function deriveRangeNoteTitle(note: string) {
  const compact = note.replace(/\s+/g, ' ').trim();

  if (!compact) {
    return 'Untitled plan';
  }

  if (compact.length <= 42) {
    return compact;
  }

  return `${compact.slice(0, 39).trim()}...`;
}

export function normalizeRangeNoteEntry(value: RangeNoteEntry | string | undefined) {
  if (!value) {
    return { title: '', body: '' };
  }

  if (typeof value === 'string') {
    const body = value.trim();
    return {
      title: deriveRangeNoteTitle(body),
      body,
    };
  }

  return {
    title: value.title?.trim() ?? '',
    body: value.body?.trim() ?? '',
  };
}

export function getNotePreview(body: string) {
  const compact = body.replace(/\s+/g, ' ').trim();

  if (!compact) {
    return 'Open this plan to add details and reminders.';
  }

  if (compact.length <= 88) {
    return compact;
  }

  return `${compact.slice(0, 85).trim()}...`;
}

export function emptyPlannerState(): PlannerState {
  return {
    monthNotes: {},
    rangeNotes: {},
    tasksByMonth: {},
  };
}

export function getDefaultSnapshot(): PlannerSnapshot {
  const today = startOfDay(new Date());
  const fallbackMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    displayMonth: fallbackMonth,
    selection: { start: null, end: null },
    planner: emptyPlannerState(),
  };
}

export function loadStoredSnapshot(): PlannerSnapshot {
  const fallback = getDefaultSnapshot();
  const saved = readStorageItem(STORAGE_KEY);

  if (!saved) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(saved) as StoredSnapshot;
    const savedDisplayMonth = parseStoredDate(parsed.displayMonth);

    return {
      displayMonth: savedDisplayMonth
        ? new Date(
            savedDisplayMonth.getFullYear(),
            savedDisplayMonth.getMonth(),
            1,
          )
        : fallback.displayMonth,
      selection: {
        start: parseStoredDate(parsed.selection?.start),
        end: parseStoredDate(parsed.selection?.end),
      },
      planner: {
        monthNotes: parsed.monthNotes ?? {},
        rangeNotes: Object.fromEntries(
          Object.entries(parsed.rangeNotes ?? {}).map(([key, value]) => [
            key,
            normalizeRangeNoteEntry(value),
          ]),
        ),
        tasksByMonth: parsed.tasksByMonth ?? {},
      },
    };
  } catch {
    removeStorageItem(STORAGE_KEY);
    return fallback;
  }
}

export { DEFAULT_HERO_IMAGE };

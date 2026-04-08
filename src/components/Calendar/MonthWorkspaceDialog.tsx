'use client';

import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from 'react';

import { getFocusableElements } from './calendar.utils';
import type { MonthlyTask } from './calendar.types';

type MonthWorkspaceDialogProps = {
  isOpen: boolean;
  displayMonth: Date;
  completionRatio: number;
  monthMemo: string;
  monthMemoInputRef: RefObject<HTMLTextAreaElement | null>;
  taskDraft: string;
  activeTasks: MonthlyTask[];
  onClose: () => void;
  onMonthMemoChange: (value: string) => void;
  onTaskDraftChange: (value: string) => void;
  onTaskKeyDown: (event: ReactKeyboardEvent<HTMLInputElement>) => void;
  onAddTask: () => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
};

export function MonthWorkspaceDialog({
  isOpen,
  displayMonth,
  completionRatio,
  monthMemo,
  monthMemoInputRef,
  taskDraft,
  activeTasks,
  onClose,
  onMonthMemoChange,
  onTaskDraftChange,
  onTaskKeyDown,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: MonthWorkspaceDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    window.setTimeout(() => {
      const focusable = getFocusableElements(dialogRef.current);
      focusable[0]?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = getFocusableElements(dialogRef.current);
      if (!focusable.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-[rgba(4,4,7,0.72)] p-4 backdrop-blur-[8px]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        ref={dialogRef}
        className="animate-dialog-pop max-h-[min(88vh,52rem)] w-full max-w-[40rem] overflow-auto rounded-[1rem] border border-white/8 bg-[rgba(15,15,18,0.98)] p-[0.95rem] shadow-[0_1.1rem_2.4rem_rgba(0,0,0,0.34)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 max-[820px]:flex-col">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">Month workspace</p>
            <h3 id={titleId} className="mt-[0.2rem] font-[var(--font-sans)] text-[0.94rem] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--ink-strong)]">
              {displayMonth.toLocaleString('en-US', { month: 'long' })} memo and checklist
            </h3>
            <p id={descriptionId} className="mt-[0.2rem] max-w-[17rem] text-[0.76rem] leading-[1.3] text-[var(--ink-soft)]">
              Keep one memo for the month and maintain a short action list.
            </p>
          </div>
          <button type="button" className="min-h-[1.85rem] rounded-full border border-white/8 bg-[rgba(24,24,28,0.92)] px-[0.58rem] py-[0.3rem] text-[0.72rem] font-semibold text-[var(--ink-soft)]" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mt-[0.7rem] h-[0.7rem] w-full overflow-hidden rounded-full bg-white/6">
          <span className="block h-full rounded-full bg-[linear-gradient(90deg,#ff8b1f_0%,#ff6a00_100%)] transition-[width] duration-220" style={{ width: `${completionRatio}%` }} />
        </div>

        <textarea
          ref={monthMemoInputRef}
          className="mt-[0.6rem] min-h-[8.5rem] w-full resize-y rounded-[1rem] border border-white/8 bg-[linear-gradient(180deg,rgba(20,20,24,0.98)_0%,rgba(14,14,18,0.96)_100%)] px-[0.86rem] pb-[0.88rem] pt-[0.82rem] leading-[1.65] text-[var(--ink-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition duration-150 placeholder:text-[rgba(107,84,65,0.52)] focus:border-[rgba(255,139,31,0.34)] focus:shadow-[0_0_0_3px_rgba(255,139,31,0.12)]"
          value={monthMemo}
          onChange={(event) => onMonthMemoChange(event.target.value)}
          placeholder="Use this space for monthly goals, appointments, and reminders."
        />

        <div className="mt-[0.7rem] grid grid-cols-[minmax(0,1fr)_auto] gap-[0.55rem] max-[560px]:grid-cols-1">
          <input
            className="min-h-[2.2rem] rounded-[0.9rem] border border-white/6 bg-[#17171b] px-[0.72rem] py-[0.58rem] text-[var(--ink-strong)] transition duration-150 placeholder:text-[rgba(107,84,65,0.52)] focus:border-[rgba(255,139,31,0.34)] focus:shadow-[0_0_0_3px_rgba(255,139,31,0.12)]"
            value={taskDraft}
            onChange={(event) => onTaskDraftChange(event.target.value)}
            onKeyDown={onTaskKeyDown}
            placeholder="Add a task for this month"
          />
          <button type="button" className="min-h-[1.82rem] rounded-[0.9rem] bg-[linear-gradient(135deg,#ff8b1f_0%,#ff6a00_100%)] px-[0.54rem] py-[0.3rem] font-semibold text-[#151518] shadow-[0_0.45rem_1rem_rgba(255,106,0,0.18)]" onClick={onAddTask}>
            Add task
          </button>
        </div>

        <div className="mt-[0.7rem] grid gap-[0.55rem]">
          {activeTasks.length ? (
            activeTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between gap-3 rounded-[0.8rem] border border-white/6 bg-[rgba(22,22,27,0.92)] px-[0.72rem] py-[0.62rem]">
                <label className="flex min-w-0 items-center gap-[0.7rem] text-[var(--ink-strong)]">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => onToggleTask(task.id)}
                    className="shrink-0"
                  />
                  <span className={task.done ? 'break-words text-[var(--ink-muted)] line-through' : 'break-words'}>
                    {task.text}
                  </span>
                </label>
                <button type="button" className="text-[0.88rem] font-semibold text-[var(--accent-strong)]" onClick={() => onDeleteTask(task.id)}>
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-[0.92rem] leading-[1.55] text-[var(--ink-muted)]">
              No tasks yet. Add a few to make the month actionable.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useId, useRef, type RefObject } from 'react';

import { formatRangeLabel, getFocusableElements } from './calendar.utils';

type RangeNoteDialogProps = {
  isOpen: boolean;
  selection: { start: Date | null; end: Date | null };
  rangeNoteCharacterCount: number;
  rangeNoteTitleDraft: string;
  rangeNoteDraft: string;
  rangeNoteInputRef: RefObject<HTMLTextAreaElement | null>;
  onClose: () => void;
  onTitleChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSave: () => void;
};

const shellClass =
  'w-full rounded-[1rem] border border-white/8 bg-[rgba(15,15,18,0.98)] p-[0.95rem] shadow-[0_1.1rem_2.4rem_rgba(0,0,0,0.34)]';
const inputClass =
  'w-full rounded-[1rem] border border-white/8 bg-[rgba(22,22,27,0.96)] px-[0.78rem] py-[0.62rem] text-[var(--ink-strong)] transition duration-150 placeholder:text-[rgba(107,84,65,0.52)] focus:border-[rgba(255,139,31,0.34)] focus:shadow-[0_0_0_3px_rgba(255,139,31,0.12)]';

export function RangeNoteDialog({
  isOpen,
  selection,
  rangeNoteCharacterCount,
  rangeNoteTitleDraft,
  rangeNoteDraft,
  rangeNoteInputRef,
  onClose,
  onTitleChange,
  onNoteChange,
  onSave,
}: RangeNoteDialogProps) {
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
        className={`${shellClass} animate-dialog-pop`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 max-[820px]:flex-col">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">Range note</p>
            <h3 id={titleId} className="mt-[0.2rem] font-[var(--font-sans)] text-[0.94rem] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--ink-strong)]">
              {selection.start ? formatRangeLabel(selection.start, selection.end ?? selection.start) : 'Select dates first'}
            </h3>
            <p id={descriptionId} className="mt-[0.2rem] max-w-[17rem] text-[0.76rem] leading-[1.3] text-[var(--ink-soft)]">
              {selection.start
                ? 'Capture reminders, trip details, or context for this selected time window.'
                : 'Choose a start date and end date first to attach a note.'}
            </p>
          </div>
          <button type="button" className="min-h-[1.85rem] rounded-full border border-white/8 bg-[rgba(24,24,28,0.92)] px-[0.58rem] py-[0.3rem] text-[0.72rem] font-semibold text-[var(--ink-soft)]" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mt-[0.75rem] rounded-[0.9rem] border border-white/6 bg-[rgba(16,16,20,0.72)] p-[0.78rem]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex min-h-[1.6rem] items-center rounded-full border border-[rgba(255,139,31,0.18)] bg-[rgba(255,139,31,0.12)] px-[0.55rem] py-[0.16rem] text-[0.68rem] font-semibold text-[#ff9c43]">
              {selection.start ? 'Linked to selected range' : 'Waiting for range'}
            </span>
            <span className="inline-flex min-h-[1.6rem] items-center rounded-full bg-white/6 px-[0.55rem] py-[0.16rem] text-[0.68rem] text-[var(--ink-soft)]">
              {rangeNoteCharacterCount ? `${rangeNoteCharacterCount} chars` : 'Empty note'}
            </span>
          </div>

          <input
            type="text"
            className={`mt-[0.6rem] min-h-[2.4rem] ${inputClass}`}
            value={rangeNoteTitleDraft}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Give this plan a short title"
            disabled={!selection.start}
          />

          <textarea
            ref={rangeNoteInputRef}
            className="mt-[0.6rem] min-h-[8.5rem] w-full resize-y rounded-[1rem] border border-white/8 bg-[linear-gradient(180deg,rgba(20,20,24,0.98)_0%,rgba(14,14,18,0.96)_100%)] px-[0.86rem] pb-[0.88rem] pt-[0.82rem] leading-[1.65] text-[var(--ink-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition duration-150 placeholder:text-[rgba(107,84,65,0.52)] focus:border-[rgba(255,139,31,0.34)] focus:shadow-[0_0_0_3px_rgba(255,139,31,0.12)] disabled:cursor-not-allowed disabled:text-[rgba(255,255,255,0.36)]"
            value={rangeNoteDraft}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder="Add trip details, reminders, or context for the selected dates."
            disabled={!selection.start}
          />
        </div>

        <div className="mt-[0.8rem] flex items-end justify-between gap-[0.8rem] max-[820px]:flex-col max-[820px]:items-start">
          <div className="max-w-[20rem] text-[0.76rem] leading-[1.35] text-[var(--ink-soft)]">
            {selection.start
              ? 'Save this plan to pin its title and note to the selected date range.'
              : 'Select a range first, then this note becomes active.'}
          </div>

          <div className="flex items-center justify-end gap-[0.65rem] max-[820px]:w-full max-[820px]:justify-start">
            <button
              type="button"
              className="min-h-[1.82rem] rounded-[0.9rem] bg-[linear-gradient(135deg,#ff8b1f_0%,#ff6a00_100%)] px-[0.54rem] py-[0.3rem] font-semibold text-[#151518] shadow-[0_0.45rem_1rem_rgba(255,106,0,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onSave}
              disabled={!selection.start || !rangeNoteDraft.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

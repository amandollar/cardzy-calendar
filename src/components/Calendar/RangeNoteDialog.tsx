'use client';

import { useId, type KeyboardEvent } from 'react';

import { formatRangeLabel } from './calendar.utils';

type RangeNoteDialogProps = {
  isOpen: boolean;
  selection: { start: Date | null; end: Date | null };
  rangeNoteCharacterCount: number;
  rangeNoteTitleDraft: string;
  rangeNoteDraft: string;
  onClose: () => void;
  onTitleChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSave: () => void;
};

const inputClass =
  'mt-[0.32rem] w-full rounded-[0.9rem] border border-white/8 bg-[rgba(22,22,27,0.96)] px-[0.78rem] py-[0.62rem] text-[var(--ink-strong)] transition duration-150 placeholder:text-[rgba(107,84,65,0.52)] focus:border-[rgba(255,139,31,0.34)] focus:shadow-[0_0_0_3px_rgba(255,139,31,0.12)]';

export function RangeNoteDialog({
  isOpen,
  selection,
  rangeNoteCharacterCount,
  rangeNoteTitleDraft,
  rangeNoteDraft,
  onClose,
  onTitleChange,
  onNoteChange,
  onSave,
}: RangeNoteDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const titleFieldId = useId();
  const noteFieldId = useId();

  if (!isOpen) {
    return null;
  }

  const hasSelection = Boolean(selection.start);

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-30 grid place-items-center bg-[rgba(4,4,7,0.72)] p-4 backdrop-blur-[8px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="animate-dialog-pop w-full max-w-[34rem] rounded-[1rem] border border-white/8 bg-[rgba(15,15,18,0.98)] p-[1rem] shadow-[0_1.1rem_2.4rem_rgba(0,0,0,0.34)]"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">Range note</p>
            <h3
              id={titleId}
              className="mt-[0.2rem] font-[var(--font-sans)] text-[0.94rem] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--ink-strong)]"
            >
              {hasSelection
                ? formatRangeLabel(selection.start, selection.end ?? selection.start)
                : 'Select dates first'}
            </h3>
            <p id={descriptionId} className="mt-[0.2rem] text-[0.76rem] leading-[1.3] text-[var(--ink-soft)]">
              {hasSelection
                ? 'Add a title and note for the selected date range.'
                : 'Choose a start date and end date first to attach a note.'}
            </p>
          </div>
          <button
            type="button"
            className="rounded-[0.8rem] border border-white/8 bg-[rgba(24,24,28,0.92)] px-[0.7rem] py-[0.42rem] text-[0.76rem] font-semibold text-[var(--ink-soft)]"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-[0.75rem] grid gap-[0.75rem]">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[0.9rem] border border-white/6 bg-[rgba(16,16,20,0.72)] px-[0.78rem] py-[0.62rem]">
            <span className="text-[0.72rem] font-semibold text-[#ff9c43]">
              {hasSelection ? 'Linked to selected range' : 'Waiting for range'}
            </span>
            <span className="text-[0.72rem] text-[var(--ink-soft)]">
              {rangeNoteCharacterCount ? `${rangeNoteCharacterCount} chars` : 'Empty note'}
            </span>
          </div>

          <label htmlFor={titleFieldId} className="block text-[0.78rem] font-semibold text-[var(--ink-strong)]">
            Title
            <input
              id={titleFieldId}
              type="text"
              className={inputClass}
              value={rangeNoteTitleDraft}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Give this plan a short title"
              disabled={!hasSelection}
            />
          </label>

          <label htmlFor={noteFieldId} className="block text-[0.78rem] font-semibold text-[var(--ink-strong)]">
            Note
            <textarea
              id={noteFieldId}
              className={`${inputClass} min-h-[10rem] resize-y leading-[1.55] disabled:cursor-not-allowed disabled:text-[rgba(255,255,255,0.36)]`}
              value={rangeNoteDraft}
              onChange={(event) => onNoteChange(event.target.value)}
              placeholder="Add trip details, reminders, or context for the selected dates."
              disabled={!hasSelection}
            />
          </label>
        </div>

        <div className="mt-[0.9rem] flex items-center justify-between gap-3 max-[560px]:flex-col max-[560px]:items-stretch">
          <p className="text-[0.76rem] leading-[1.35] text-[var(--ink-soft)]">
            {hasSelection
              ? 'Save this note to keep it attached to the selected range.'
              : 'Select a range first, then this note becomes active.'}
          </p>
          <button
            type="button"
            className="rounded-[0.9rem] bg-[linear-gradient(135deg,#ff8b1f_0%,#ff6a00_100%)] px-[0.9rem] py-[0.55rem] font-semibold text-[#151518] shadow-[0_0.45rem_1rem_rgba(255,106,0,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onSave}
            disabled={!hasSelection || !rangeNoteDraft.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

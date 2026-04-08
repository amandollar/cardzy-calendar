'use client';

import Image, { type StaticImageData } from 'next/image';

import { cn, formatRangeLabel, getNotePreview, getRangeBreakdown, getRangeLength } from './calendar.utils';
import type { MonthlyTask, SavedRangeNote } from './calendar.types';

type PlannerSidebarProps = {
  displayMonth: Date;
  heroImage: StaticImageData;
  nextUpcomingPlan: SavedRangeNote | null;
  monthlyPlanCount: number;
  selectionDays: number;
  activeTasks: MonthlyTask[];
  completedTasks: number;
  savedRangeNotes: SavedRangeNote[];
  activeRangeKey: string;
  onOpenSavedRangeNote: (entry: SavedRangeNote) => void;
  mobileHidden?: boolean;
};

const panelClass =
  'rounded-[1.15rem] border border-white/5 bg-[rgba(18,18,22,0.94)] shadow-[0_0.35rem_0.8rem_rgba(0,0,0,0.14)]';

export function PlannerSidebar({
  displayMonth,
  heroImage,
  nextUpcomingPlan,
  monthlyPlanCount,
  selectionDays,
  activeTasks,
  completedTasks,
  savedRangeNotes,
  activeRangeKey,
  onOpenSavedRangeNote,
  mobileHidden = false,
}: PlannerSidebarProps) {
  return (
    <aside className={cn(
      'min-w-0 items-stretch flex-col gap-[0.85rem] lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-stretch xl:flex xl:flex-col',
      mobileHidden ? 'hidden sm:grid xl:flex' : 'flex',
    )}>
      <div className={cn(panelClass, 'w-full overflow-hidden')}>
        <div className="relative min-h-[21rem]">
          <Image
            src={heroImage}
            alt="Wall calendar artwork"
            fill
            priority
            sizes="(max-width: 960px) 100vw, 24vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,10,0.12)_0%,rgba(5,7,10,0.24)_38%,rgba(5,7,10,0.82)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-[1.1rem] text-[#fffaf4]">
            <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">Wall calendar</p>
            <h2 className="mt-[0.36rem] font-[var(--font-sans)] text-[clamp(2.1rem,2.8vw,2.65rem)] font-bold leading-[0.95] tracking-[-0.03em]">
              {displayMonth.toLocaleString('en-US', { month: 'long' })}
              <span className="mt-[0.35rem] block text-[0.72rem] font-bold tracking-[0.18em]">
                {displayMonth.getFullYear()}
              </span>
            </h2>
            <p className="mt-[0.65rem] max-w-[17rem] text-[0.78rem] leading-[1.36] text-[rgba(255,245,232,0.82)]">
              {nextUpcomingPlan
                ? `Next up: ${nextUpcomingPlan.title}`
                : 'Select a range, save a note, and build the month around it.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[0.45rem] bg-[rgba(13,13,16,0.82)] p-[0.7rem]">
          {[
            ['Saved', String(monthlyPlanCount)],
            ['Range', selectionDays ? `${selectionDays}d` : '--'],
            ['Tasks', activeTasks.length ? `${completedTasks}/${activeTasks.length}` : '0/0'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[0.78rem] border border-white/4 bg-[rgba(23,23,28,0.72)] px-[0.65rem] py-[0.52rem]"
            >
              <span className="block text-[0.6rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                {label}
              </span>
              <strong className="mt-[0.12rem] block text-[0.74rem] text-[var(--ink-strong)]">
                {value}
              </strong>
            </div>
          ))}
        </div>
      </div>

      <div className={cn(panelClass, 'w-full p-[0.62rem]')}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">Saved plans</p>
            <h3 className="mt-[0.2rem] font-[var(--font-sans)] text-[0.94rem] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--ink-strong)]">
              {displayMonth.toLocaleString('en-US', { month: 'long' })} notes
            </h3>
            <p className="mt-[0.2rem] max-w-[17rem] text-[0.76rem] leading-[1.3] text-[var(--ink-soft)]">
              Open a saved range to review or edit it.
            </p>
          </div>
        </div>

        <div className="mt-[0.6rem] grid gap-[0.45rem]">
          {savedRangeNotes.length ? (
            savedRangeNotes.map((entry) => {
              const breakdown = getRangeBreakdown(entry.start, entry.end);

              return (
                <button
                  key={entry.key}
                  type="button"
                  className={cn(
                    'rounded-[0.82rem] border bg-[rgba(17,17,21,0.78)] px-[0.62rem] py-[0.58rem] text-left transition duration-150 hover:-translate-y-px hover:border-[rgba(255,139,31,0.12)] hover:shadow-[0_0.3rem_0.85rem_rgba(0,0,0,0.16)]',
                    activeRangeKey === entry.key
                      ? 'border-[rgba(255,139,31,0.16)] shadow-[0_0_0_2px_rgba(255,139,31,0.05),0_0.3rem_0.85rem_rgba(0,0,0,0.16)]'
                      : 'border-white/5',
                  )}
                  onClick={() => onOpenSavedRangeNote(entry)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[0.76rem] font-bold uppercase tracking-[0.08em] text-[#ff8b1f]">
                      {formatRangeLabel(entry.start, entry.end)}
                    </span>
                    <span className="text-[0.76rem] uppercase tracking-[0.08em] text-[var(--ink-muted)]">Open</span>
                  </div>
                  <strong className="mt-[0.2rem] block text-[0.8rem] text-[var(--ink-strong)]">{entry.title}</strong>
                  <p className="mt-[0.16rem] text-[0.68rem] leading-[1.22] text-[var(--ink-soft)]">
                    {getNotePreview(entry.body)}
                  </p>
                  <div className="mt-[0.6rem] flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[0.76rem] uppercase tracking-[0.08em] text-[var(--ink-muted)]">
                      {getRangeLength(entry.start, entry.end)} days
                    </span>
                    <span className="text-[0.76rem] uppercase tracking-[0.08em] text-[var(--ink-muted)]">
                      {breakdown.weekdays} weekday / {breakdown.weekends} weekend
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="text-[0.92rem] leading-[1.55] text-[var(--ink-muted)]">
              Saved plans for this month will appear here after you save a titled note to a selected range.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

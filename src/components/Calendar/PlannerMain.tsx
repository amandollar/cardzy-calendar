'use client';

import Image, { type StaticImageData } from 'next/image';

import { MONTH_OPTIONS, WEEKDAYS } from './calendar.constants';
import { cn, dateKey, formatLongDate, isSameDay } from './calendar.utils';
import type {
  CalendarDay,
  CopyState,
  MobileDetailView,
  PresetId,
  SelectionMode,
} from './calendar.types';

type PlannerMainProps = {
  displayMonth: Date;
  heroImage: StaticImageData;
  monthlyPlanCount: number;
  mobileDetailView: MobileDetailView;
  years: number[];
  copyState: CopyState;
  hasSelection: boolean;
  selectionMode: SelectionMode;
  rangePurposeText: string;
  activeRangeLabel: string;
  today: Date;
  calendarDays: CalendarDay[];
  activeRange: { start: Date | null; end: Date | null };
  planDayCounts: Map<string, number>;
  onSetMobileDetailView: (view: MobileDetailView) => void;
  onGoBackToGallery: () => void;
  onPresetClick: (presetId: PresetId) => void;
  onMonthChange: (monthIndex: number) => void;
  onYearChange: (year: number) => void;
  onGoToTodayMonth: () => void;
  onOpenMonthDialog: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onOpenRangeDialog: () => void;
  onCopyPlanSummary: () => void;
  onClearSelection: () => void;
  onDayClick: (date: Date) => void;
  onDayHoverChange: (date: Date | null) => void;
};

const panelClass =
  'rounded-[1.15rem] border border-white/5 bg-[rgba(18,18,22,0.94)] p-[0.62rem] shadow-[0_0.35rem_0.8rem_rgba(0,0,0,0.14)]';
const controlClass =
  'min-h-[1.82rem] rounded-[0.9rem] border border-white/6 bg-[#17171b] px-[0.54rem] py-[0.3rem] text-[var(--ink-strong)] transition duration-150 hover:-translate-y-px hover:shadow-[0_0.45rem_1rem_rgba(0,0,0,0.22)] focus:border-[rgba(255,139,31,0.34)] focus:shadow-[0_0_0_3px_rgba(255,139,31,0.12)]';
const chipClass =
  'min-h-[1.56rem] rounded-full border border-white/5 bg-[rgba(22,22,27,0.74)] px-[0.48rem] py-[0.18rem] text-[0.64rem] font-semibold text-[var(--ink-soft)] transition duration-150 hover:-translate-y-px hover:border-[rgba(255,139,31,0.22)] hover:shadow-[0_0.8rem_1.2rem_rgba(0,0,0,0.22)]';

export function PlannerMain({
  displayMonth,
  heroImage,
  monthlyPlanCount,
  mobileDetailView,
  years,
  copyState,
  hasSelection,
  selectionMode,
  rangePurposeText,
  activeRangeLabel,
  today,
  calendarDays,
  activeRange,
  planDayCounts,
  onSetMobileDetailView,
  onGoBackToGallery,
  onPresetClick,
  onMonthChange,
  onYearChange,
  onGoToTodayMonth,
  onOpenMonthDialog,
  onPreviousMonth,
  onNextMonth,
  onOpenRangeDialog,
  onCopyPlanSummary,
  onClearSelection,
  onDayClick,
  onDayHoverChange,
}: PlannerMainProps) {
  const isSelectionComplete = selectionMode === 'complete';

  return (
    <div className="flex min-w-0 flex-col gap-[0.7rem] max-[560px]:pb-20">
      <div className="hidden gap-[0.4rem] rounded-[1rem] border border-white/5 bg-[rgba(16,16,20,0.96)] p-[0.12rem] max-[560px]:flex">
        <button
          type="button"
          className={cn(
            'flex-1 rounded-[0.88rem] border px-[0.65rem] py-[0.3rem] text-[0.74rem] font-semibold transition duration-150',
            mobileDetailView === 'calendar'
              ? 'border-[rgba(255,139,31,0.18)] bg-[rgba(255,139,31,0.12)] text-[var(--ink-strong)]'
              : 'border-transparent bg-transparent text-[var(--ink-soft)]',
          )}
          onClick={() => onSetMobileDetailView('calendar')}
        >
          Calendar
        </button>
        <button
          type="button"
          className={cn(
            'flex-1 rounded-[0.88rem] border px-[0.65rem] py-[0.3rem] text-[0.74rem] font-semibold transition duration-150',
            mobileDetailView === 'plans'
              ? 'border-[rgba(255,139,31,0.18)] bg-[rgba(255,139,31,0.12)] text-[var(--ink-strong)]'
              : 'border-transparent bg-transparent text-[var(--ink-soft)]',
          )}
          onClick={() => onSetMobileDetailView('plans')}
        >
          Plans
          {monthlyPlanCount ? <span className="ml-[0.35rem] text-[0.68rem] text-[#ff9c43]">{monthlyPlanCount}</span> : null}
        </button>
      </div>

      <div className="hidden items-center gap-[0.7rem] rounded-[1rem] border border-white/5 bg-[rgba(18,18,22,0.9)] px-[0.62rem] py-[0.56rem] max-[560px]:flex">
        <div className="relative h-[4.65rem] w-16 shrink-0 overflow-hidden rounded-[0.95rem]">
          <Image src={heroImage} alt="" fill loading="eager" sizes="4rem" className="object-cover" />
        </div>
        <div className="min-w-0">
          <span className="block text-[0.64rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            {displayMonth.getFullYear()}
          </span>
          <strong className="mt-[0.16rem] block text-[1.05rem] leading-[1.05] text-[var(--ink-strong)]">
            {displayMonth.toLocaleString('en-US', { month: 'long' })}
          </strong>
          <p className="mt-[0.18rem] text-[0.72rem] leading-[1.28] text-[var(--ink-soft)]">
            {monthlyPlanCount ? `${monthlyPlanCount} saved plan${monthlyPlanCount > 1 ? 's' : ''}` : 'No saved plans yet'}
          </p>
        </div>
      </div>

      <header className={cn(panelClass, 'animate-fade-in-up grid grid-cols-[minmax(0,1fr)_auto] gap-[0.55rem] items-start max-[820px]:grid-cols-1')}>
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">Monthly planner</p>
          <button type="button" className="mt-[0.1rem] inline-flex items-center text-[0.72rem] font-semibold text-[var(--accent-strong)]" onClick={onGoBackToGallery}>
            Back to months
          </button>
          <h1 className="mb-[0.32rem] mt-[0.2rem] font-[var(--font-sans)] text-[clamp(1.4rem,2.1vw,1.85rem)] font-bold leading-[0.96] tracking-[-0.03em] text-[var(--ink-strong)]">
            {displayMonth.toLocaleString('en-US', { month: 'long' })} {displayMonth.getFullYear()}
          </h1>
          <p className="max-w-[22rem] text-[0.72rem] leading-[1.32] text-[var(--ink-soft)]">
            Pick a start day, then an end day to turn that span into a saved plan.
          </p>
          <div className="mt-[0.45rem] flex flex-wrap gap-[0.35rem]">
            <button type="button" className={chipClass} onClick={() => onPresetClick('today')}>Today</button>
            <button type="button" className={chipClass} onClick={() => onPresetClick('weekend')}>Weekend</button>
            <button type="button" className={chipClass} onClick={() => onPresetClick('next7')}>Next 7 days</button>
            <button type="button" className={chipClass} onClick={() => onPresetClick('thisMonth')}>This month</button>
          </div>
        </div>

        <div className="flex max-w-none flex-wrap items-center justify-end gap-[0.3rem] max-[560px]:w-full max-[560px]:justify-stretch">
          <select
            aria-label="Select month"
            className={cn(controlClass, 'min-w-[5.45rem] max-[560px]:min-w-0 max-[560px]:flex-1')}
            value={displayMonth.getMonth()}
            onChange={(event) => onMonthChange(Number(event.target.value))}
          >
            {MONTH_OPTIONS.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>

          <select
            aria-label="Select year"
            className={cn(controlClass, 'min-w-[5.45rem] max-[560px]:min-w-0 max-[560px]:flex-1')}
            value={displayMonth.getFullYear()}
            onChange={(event) => onYearChange(Number(event.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <button type="button" className={cn(controlClass, 'bg-[linear-gradient(135deg,#ff8b1f_0%,#ff6a00_100%)] font-semibold text-[#151518] shadow-[0_0.45rem_1rem_rgba(255,106,0,0.18)] max-[560px]:flex-1')} onClick={onGoToTodayMonth}>
            Today
          </button>
          <button type="button" className={cn(controlClass, 'font-semibold max-[560px]:flex-1')} onClick={onOpenMonthDialog}>
            Month notes
          </button>
        </div>
      </header>

      <div className={cn(panelClass, 'animate-fade-in-up flex flex-col gap-[0.42rem] bg-[linear-gradient(180deg,rgba(12,12,15,0.98)_0%,rgba(8,8,10,0.96)_100%)]')}>
        <div className="flex items-center justify-between gap-[0.45rem] border-b border-white/4 pb-[0.32rem] max-[820px]:flex-col max-[820px]:items-start">
          <div className="flex flex-wrap items-center gap-[0.55rem] max-[560px]:w-full max-[560px]:flex-nowrap max-[560px]:overflow-x-auto max-[560px]:pb-[0.1rem]">
            {[
              ['Today', 'bg-[#ff8b1f]'],
              ['Selected days', 'bg-[#ffb066]'],
              ['Weekend', 'border border-white/8 bg-[#44444c]'],
              ['Saved plan', 'bg-[#ff6a00]'],
            ].map(([label, dotClass]) => (
              <span key={label} className="inline-flex items-center gap-[0.3rem] text-[0.68rem] text-[var(--ink-soft)]">
                <i className={cn('h-[0.65rem] w-[0.65rem] rounded-full', dotClass)} aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-[0.55rem] max-[560px]:w-full max-[560px]:justify-between">
            <button type="button" className={cn(controlClass, 'font-semibold')} onClick={onPreviousMonth}>
              {'<'} Prev
            </button>
            <button type="button" className={cn(controlClass, 'font-semibold')} onClick={onNextMonth}>
              Next {'>'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-[0.6rem] px-[0.1rem] pb-[0.12rem] pt-[0.32rem] max-[820px]:flex-col max-[820px]:items-start">
          <div>
            <strong className="block text-[0.74rem] text-[var(--ink-strong)]">
              {selectionMode === 'idle'
                ? '1. Click a start date'
                : selectionMode === 'picking-end'
                  ? '2. Click an end date'
                  : 'Range locked in'}
            </strong>
            <p className="mt-[0.05rem] text-[0.68rem] leading-[1.2] text-[var(--ink-soft)]">
              {selectionMode === 'complete' ? 'Add a note or start over.' : rangePurposeText}
            </p>
            {selectionMode !== 'idle' ? (
              <span className="mt-[0.38rem] inline-flex min-h-[1.56rem] items-center rounded-full border border-[rgba(255,139,31,0.14)] bg-[rgba(255,139,31,0.08)] px-[0.55rem] py-[0.16rem] text-[0.66rem] font-semibold text-[#ffb066]">
                {activeRangeLabel}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-[0.6rem] max-[820px]:w-full">
            {isSelectionComplete ? (
              <button
                type="button"
                className={cn(controlClass, 'bg-[linear-gradient(135deg,#ff8b1f_0%,#ff6a00_100%)] font-semibold text-[#151518] shadow-[0_0.45rem_1rem_rgba(255,106,0,0.18)]')}
                onClick={onOpenRangeDialog}
              >
                Add note
              </button>
            ) : null}
            <button
              type="button"
              className={cn(controlClass, 'bg-[rgba(20,20,24,0.72)]')}
              onClick={onCopyPlanSummary}
              disabled={!hasSelection}
            >
              {copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy'}
            </button>
            {selectionMode !== 'idle' ? (
              <button type="button" className={cn(controlClass, 'bg-[rgba(20,20,24,0.72)]')} onClick={onClearSelection}>
                Start over
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-[0.24rem] max-[560px]:gap-[0.35rem]">
          {WEEKDAYS.map((weekday) => (
            <span key={weekday} className="text-center text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ink-muted)] max-[560px]:text-[0.64rem] max-[560px]:tracking-[0.08em]">
              {weekday}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-[0.24rem] max-[560px]:gap-[0.35rem]">
          {calendarDays.map(({ date, inMonth }) => {
            const isToday = isSameDay(date, today);
            const isStart = isSameDay(date, activeRange.start);
            const isEnd = isSameDay(date, activeRange.end);
            const isSingleDay = isStart && isEnd;
            const isWeekend = inMonth && (date.getDay() === 0 || date.getDay() === 6);
            const savedPlanCount = inMonth ? planDayCounts.get(dateKey(date)) ?? 0 : 0;
            const hasSavedPlan = savedPlanCount > 0;
            const isInRange =
              !!activeRange.start &&
              !!activeRange.end &&
              date > activeRange.start &&
              date < activeRange.end;
            const isPreviewRange =
              selectionMode === 'picking-end' &&
              !!activeRange.start &&
              !!activeRange.end &&
              date >= activeRange.start &&
              date <= activeRange.end;

            return (
              <button
                key={dateKey(date)}
                type="button"
                className={cn(
                  'relative min-h-[3rem] overflow-hidden rounded-[0.82rem] border bg-[#111114] p-[0.28rem] text-left transition duration-180 max-[820px]:min-h-[4.9rem] max-[560px]:min-h-[4rem] max-[560px]:p-[0.45rem]',
                  !inMonth ? 'border-white/4 bg-[rgba(20,20,24,0.65)]' : 'border-white/4',
                  isWeekend ? 'bg-[linear-gradient(180deg,rgba(21,21,26,0.98)_0%,rgba(16,16,20,0.96)_100%)]' : '',
                  hasSavedPlan ? 'border-white/5' : '',
                  isToday ? 'shadow-[inset_0_0_0_1px_rgba(255,139,31,0.42),0_0.22rem_0.55rem_rgba(0,0,0,0.12)]' : '',
                  isInRange ? 'border-[rgba(255,139,31,0.08)] bg-[linear-gradient(180deg,rgba(255,139,31,0.12)_0%,rgba(255,106,0,0.08)_100%)]' : '',
                  isPreviewRange ? 'border-[rgba(255,139,31,0.12)] bg-[linear-gradient(180deg,rgba(255,139,31,0.16)_0%,rgba(255,106,0,0.11)_100%)]' : '',
                  isStart || isEnd || isSingleDay ? 'border-transparent bg-[linear-gradient(135deg,#ff8b1f_0%,#ff6a00_100%)] shadow-[0_0.45rem_1rem_rgba(255,106,0,0.16)]' : '',
                )}
                onClick={() => onDayClick(date)}
                onMouseEnter={() => selectionMode === 'picking-end' && onDayHoverChange(date)}
                onMouseLeave={() => selectionMode === 'picking-end' && onDayHoverChange(null)}
                onFocus={() => selectionMode === 'picking-end' && onDayHoverChange(date)}
                onBlur={() => selectionMode === 'picking-end' && onDayHoverChange(null)}
                aria-pressed={Boolean(isStart || isEnd || isInRange)}
                aria-label={formatLongDate(date)}
              >
                {isToday ? (
                  <span className="absolute right-[0.22rem] top-[0.22rem] inline-flex items-center justify-center rounded-full bg-[rgba(255,139,31,0.16)] px-[0.24rem] py-[0.12rem] text-[0.66rem] font-bold uppercase tracking-[0.08em] text-[#ff8b1f]">
                    Today
                  </span>
                ) : null}
                <span className={cn(
                  'block font-[var(--font-display)] text-[0.88rem] leading-none text-[var(--ink-strong)] max-[560px]:text-[1.2rem]',
                  !inMonth ? 'text-[rgba(255,255,255,0.22)]' : '',
                  isStart || isEnd || isSingleDay ? 'text-[#111114]' : '',
                )}>
                  {date.getDate()}
                </span>
                <span className={cn(
                  'mt-[0.12rem] block text-[0.72rem] uppercase tracking-[0.14em] text-[var(--ink-muted)] max-[560px]:text-[0.64rem] max-[560px]:tracking-[0.08em]',
                  !inMonth ? 'text-[rgba(255,255,255,0.22)]' : '',
                  isStart || isEnd || isSingleDay ? 'text-[#111114]' : '',
                )}>
                  {date.toLocaleString('en-US', { month: 'short' })}
                </span>
                {hasSavedPlan ? (
                  <span className={cn(
                    'absolute bottom-[0.28rem] right-[0.28rem] inline-flex h-[0.78rem] min-w-[0.78rem] items-center justify-center rounded-full border border-[rgba(255,139,31,0.16)] bg-[rgba(255,139,31,0.12)] px-[0.16rem] text-[0.52rem] font-bold text-[#ffb066]',
                    isStart || isEnd || isSingleDay ? 'border-[rgba(255,250,244,0.22)] bg-[rgba(255,250,244,0.16)] text-[#fffaf4]' : '',
                  )}>
                    {savedPlanCount}
                  </span>
                ) : null}
                {isStart && !isSingleDay ? (
                  <span className="mt-[0.16rem] inline-flex items-center justify-center rounded-full border border-[rgba(255,250,244,0.24)] bg-[rgba(255,250,244,0.18)] px-[0.26rem] py-[0.12rem] text-[0.66rem] font-bold uppercase tracking-[0.08em] text-inherit">
                    Start
                  </span>
                ) : null}
                {isEnd && !isSingleDay ? (
                  <span className="mt-[0.16rem] inline-flex items-center justify-center rounded-full border border-[rgba(255,250,244,0.24)] bg-[rgba(255,250,244,0.18)] px-[0.26rem] py-[0.12rem] text-[0.66rem] font-bold uppercase tracking-[0.08em] text-inherit">
                    End
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {selectionMode !== 'idle' ? (
        <div className="animate-fade-in-up sticky bottom-3 z-10 hidden rounded-[1rem] border border-[rgba(255,139,31,0.12)] bg-[rgba(16,16,20,0.94)] p-[0.5rem] shadow-[0_1rem_2rem_rgba(0,0,0,0.28)] backdrop-blur-[10px] max-[560px]:flex max-[560px]:items-center max-[560px]:justify-between max-[560px]:gap-[0.55rem]">
          <div className="min-w-0">
            <strong className="block truncate text-[0.76rem] text-[var(--ink-strong)]">
              {isSelectionComplete ? 'Plan ready to save' : 'Choose the final day'}
            </strong>
            <span className="block truncate text-[0.68rem] text-[var(--ink-soft)]">{activeRangeLabel}</span>
          </div>
          <div className="flex shrink-0 items-center gap-[0.4rem]">
            {isSelectionComplete ? (
              <button
                type="button"
                className="min-h-[1.92rem] rounded-[0.9rem] bg-[linear-gradient(135deg,#ff8b1f_0%,#ff6a00_100%)] px-[0.7rem] py-[0.34rem] text-[0.76rem] font-semibold text-[#151518] shadow-[0_0.45rem_1rem_rgba(255,106,0,0.18)]"
                onClick={onOpenRangeDialog}
              >
                Add note
              </button>
            ) : null}
            <button
              type="button"
              className="min-h-[1.92rem] rounded-[0.9rem] border border-white/6 bg-[#17171b] px-[0.7rem] py-[0.34rem] text-[0.76rem] font-semibold text-[var(--ink-strong)]"
              onClick={onClearSelection}
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

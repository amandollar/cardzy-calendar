import {
  applyPreset,
  buildCalendarDays,
  getEffectiveRange,
  getRangeBreakdown,
  getSelectedDates,
  loadStoredSnapshot,
  normalizeRangeNoteEntry,
  rangeStorageKey,
  startOfDay,
} from '../calendar.utils';
import { STORAGE_KEY } from '../calendar.constants';

describe('calendar utils', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('builds a six-week calendar grid starting on Monday', () => {
    const days = buildCalendarDays(new Date(2026, 1, 1));

    expect(days).toHaveLength(42);
    expect(days[0].date.getDay()).toBe(1);
    expect(days[0].date.getDate()).toBe(26);
    expect(days[0].date.getMonth()).toBe(0);
    expect(days[41].date.getDate()).toBe(8);
    expect(days[41].date.getMonth()).toBe(2);
  });

  it('previews ranges in both directions while picking an end date', () => {
    const start = startOfDay(new Date(2026, 5, 10));
    const earlierHover = startOfDay(new Date(2026, 5, 7));
    const laterHover = startOfDay(new Date(2026, 5, 14));

    expect(getEffectiveRange({ start, end: null }, earlierHover)).toEqual({
      start: earlierHover,
      end: start,
    });
    expect(getEffectiveRange({ start, end: null }, laterHover)).toEqual({
      start,
      end: laterHover,
    });
  });

  it('creates the full current-month selection for the month preset', () => {
    const month = new Date(2026, 8, 1);
    const preset = applyPreset('thisMonth', month);

    expect(preset.month).toEqual(new Date(2026, 8, 1));
    expect(preset.selection.start).toEqual(new Date(2026, 8, 1));
    expect(preset.selection.end).toEqual(new Date(2026, 8, 30));
  });

  it('normalizes legacy string notes and restores valid saved snapshots', () => {
    const start = startOfDay(new Date(2026, 1, 4));
    const end = startOfDay(new Date(2026, 1, 20));

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        displayMonth: '2026-02-01',
        selection: { start: '2026-02-04', end: '2026-02-20' },
        monthNotes: { '2026-02': 'Keep February focused.' },
        rangeNotes: {
          [rangeStorageKey({ start, end })]: 'Trip planning details',
        },
        tasksByMonth: {
          '2026-02': [{ id: '1', text: 'Book tickets', done: false }],
        },
      }),
    );

    const snapshot = loadStoredSnapshot();
    const restoredNote = snapshot.planner.rangeNotes[rangeStorageKey({ start, end })];

    expect(snapshot.displayMonth).toEqual(new Date(2026, 1, 1));
    expect(snapshot.selection.start).toEqual(start);
    expect(snapshot.selection.end).toEqual(end);
    expect(restoredNote).toEqual({
      title: 'Trip planning details',
      body: 'Trip planning details',
    });
  });

  it('returns sane defaults and clears invalid stored snapshots', () => {
    window.localStorage.setItem(STORAGE_KEY, '{broken json');

    const snapshot = loadStoredSnapshot();

    expect(snapshot.selection).toEqual({ start: null, end: null });
    expect(snapshot.planner.monthNotes).toEqual({});
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('derives selected dates and weekday/weekend breakdowns correctly', () => {
    const start = startOfDay(new Date(2026, 5, 5));
    const end = startOfDay(new Date(2026, 5, 8));

    const selected = getSelectedDates(start, end);
    const breakdown = getRangeBreakdown(start, end);

    expect(selected).toHaveLength(4);
    expect(selected[0]).toEqual(start);
    expect(selected[3]).toEqual(end);
    expect(breakdown).toEqual({ weekdays: 2, weekends: 2 });
  });

  it('keeps object notes trimmed and intact during normalization', () => {
    expect(
      normalizeRangeNoteEntry({
        title: '  Sprint review  ',
        body: '  Wrap up notes and next steps.  ',
      }),
    ).toEqual({
      title: 'Sprint review',
      body: 'Wrap up notes and next steps.',
    });
  });
});

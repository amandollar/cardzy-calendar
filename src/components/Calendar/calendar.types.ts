export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type MonthlyTask = {
  id: string;
  text: string;
  done: boolean;
};

export type RangeNoteEntry = {
  title: string;
  body: string;
};

export type PlannerState = {
  monthNotes: Record<string, string>;
  rangeNotes: Record<string, RangeNoteEntry>;
  tasksByMonth: Record<string, MonthlyTask[]>;
};

export type StoredSnapshot = {
  displayMonth?: string;
  monthNotes?: Record<string, string>;
  rangeNotes?: Record<string, RangeNoteEntry | string>;
  tasksByMonth?: Record<string, MonthlyTask[]>;
  selection?: {
    start: string | null;
    end: string | null;
  };
};

export type PresetId = 'today' | 'weekend' | 'next7' | 'thisMonth' | 'clear';
export type CopyState = 'idle' | 'copied' | 'error';
export type SelectionMode = 'idle' | 'picking-end' | 'complete';
export type ViewMode = 'gallery' | 'detail';
export type MobileDetailView = 'calendar' | 'plans';

export type SavedRangeNote = {
  key: string;
  start: Date;
  end: Date;
  title: string;
  body: string;
};

export type PlannerSnapshot = {
  displayMonth: Date;
  selection: DateRange;
  planner: PlannerState;
};

export type CalendarDay = {
  date: Date;
  inMonth: boolean;
};

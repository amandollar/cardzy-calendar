# State and Data

## State Model

The planner uses local React state inside `src/components/Calendar/Calendar.tsx`.

Primary state buckets:

- `displayMonth`
- `selection`
- `hoveredDate`
- `planner`
- `taskDraft`
- `rangeNoteTitleDraft`
- `rangeNoteDraft`
- `copyState`
- dialog open flags
- view mode flags

## Planner State Shape

The planner domain state is stored in this shape:

```ts
type PlannerState = {
  monthNotes: Record<string, string>;
  rangeNotes: Record<string, { title: string; body: string }>;
  tasksByMonth: Record<string, { id: string; text: string; done: boolean }[]>;
};
```

Keys are intentionally string-based:

- month keys use `YYYY-MM`
- range-note keys use `YYYY-MM-DD:YYYY-MM-DD`

This keeps serialization simple and avoids storing raw `Date` instances in `localStorage`.

## Derived Data

Several values are not stored directly and are instead computed from state:

- effective selected range
- selected day count
- saved notes visible for the current month
- upcoming saved plan
- day-level plan counts for the calendar grid
- task completion ratio

Keeping these values derived prevents duplicated state and reduces synchronization bugs.

## Persistence Model

The project stores planner state in browser `localStorage` under the storage key defined in `calendar.constants.ts`.

Persisted fields:

- display month
- selected range
- month notes
- saved range notes
- monthly task lists

Hydration happens on mount. Writes happen after state changes through a `useEffect`.

## Persistence Constraints

Because persistence is local and schema-free, the storage layer should be treated as untrusted input. Any future changes to the shape of saved data should include:

- backward-compatible normalization
- safe defaults
- defensive parsing

This is especially important because local browser storage can outlive multiple versions of the app.

## Date Handling

Dates are normalized to start-of-day values before they are compared or stored in memory. This keeps range calculations and calendar rendering stable.

Important helper responsibilities:

- `startOfDay()` normalizes runtime `Date` values
- `dateKey()` converts dates to storage-safe string keys
- `monthKey()` derives month-level storage keys
- `rangeStorageKey()` builds saved-note identifiers

## Mutation Patterns

State updates follow a few consistent patterns:

- local form fields update immediately
- planner collections are updated immutably
- derived values are recalculated from source state
- parent component handlers are passed into presentational children

This keeps writes predictable and prevents subcomponents from directly mutating shared state.

## Future Improvements

If the project expands, likely next steps are:

- move planner state transitions into a reducer
- introduce explicit validation for hydrated storage data
- extract persistence logic into a dedicated hook
- add migration logic if stored schema versions change

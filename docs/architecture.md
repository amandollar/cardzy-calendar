# Architecture

## Overview

Cardzy is a single-route Next.js application organized around one feature module: the wall calendar planner. The app currently renders through `src/app/page.tsx`, with the planner experience implemented inside `src/components/Calendar`.

The design favors:

- one top-level coordinator component for state and derived values
- smaller presentational components for focused UI sections
- utility-driven date and persistence logic
- frontend-only persistence through browser storage

## Runtime Flow

At a high level, the application behaves like this:

1. `src/app/page.tsx` renders the calendar feature.
2. `src/components/Calendar/Calendar.tsx` initializes default state.
3. On mount, `Calendar.tsx` attempts to restore saved planner state from `localStorage`.
4. The active view is either the month gallery or the detailed planner.
5. User actions update local React state first.
6. State changes are serialized back into `localStorage`.

## Component Boundaries

### `Calendar.tsx`

This is the state owner for the feature. It is responsible for:

- display month
- date selection state
- hover-preview state for range picking
- saved notes and month notes
- monthly task lists
- mobile subview state
- dialog open and close state
- storage hydration and persistence

It also computes derived values such as:

- active range
- number of selected days
- saved notes for the visible month
- plan counts per day
- completion ratio for the month task list

### `MonthGallery.tsx`

This component is intentionally simple and stateless. It renders the 12 month cards and emits the selected month index through `onOpenMonth`.

### `PlannerMain.tsx`

This is the primary interaction surface. It contains:

- month and year controls
- calendar grid
- quick presets
- current range guidance
- copy flow
- mobile calendar and plans toggle

It should stay focused on rendering and interaction, while data shaping continues to live in `Calendar.tsx` and `calendar.utils.ts`.

### `PlannerSidebar.tsx`

This component renders:

- month hero artwork
- summary stats
- next upcoming plan copy
- saved notes for the active month

It does not own persistence or planner mutations directly.

### Dialog Components

`RangeNoteDialog.tsx` and `MonthWorkspaceDialog.tsx` isolate edit flows from the main board. This keeps the planner surface cleaner and avoids pushing too much form state into the grid layout.

## Shared Modules

### `calendar.constants.ts`

Contains static product configuration:

- gallery year
- month names
- month imagery
- supporting text
- storage key

### `calendar.types.ts`

Contains shared domain types for:

- date ranges
- planner state
- saved notes
- tasks
- snapshots

### `calendar.utils.ts`

Contains shared logic that should stay framework-light where practical:

- date normalization
- date formatting
- calendar grid generation
- preset handling
- range helpers
- storage access
- snapshot loading and normalization
- accessibility helpers used by dialogs

## Design Tradeoffs

### Single coordinator component

`Calendar.tsx` currently owns most feature state. This keeps the app easy to reason about at the current project size, but if the feature grows further it would be reasonable to extract reducer-based state management or split storage concerns into hooks.

### Frontend-only persistence

The project intentionally uses `localStorage` instead of a server or mock API. This keeps the implementation aligned with a frontend-focused assignment and removes backend setup overhead.

### Utility-first styling

Tailwind utility classes are used heavily in component files. This keeps styling near the markup and makes one-off visual tuning fast, but it also means larger JSX blocks should be kept organized with clear component boundaries.

## Extension Guidance

If this project grows, these are the safest expansion paths:

- extract storage hydration and persistence into a dedicated hook
- normalize persisted data more defensively before render
- add keyboard navigation for the calendar grid
- add integration tests for the full planner flow
- split the planner feature into smaller domain hooks if state logic becomes denser

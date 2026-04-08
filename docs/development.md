# Development Guide

## Prerequisites

- Node.js
- npm

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

The local app runs on `http://localhost:3000`.

## Common Commands

```bash
npm run lint
npm run test:run
npm run build
```

Use these before submitting or opening a pull request.

## Working in the Codebase

## Where to make changes

- visual layout and interactions:
  `src/components/Calendar/*.tsx`
- date logic and storage helpers:
  `src/components/Calendar/calendar.utils.ts`
- static month content:
  `src/components/Calendar/calendar.constants.ts`
- shared types:
  `src/components/Calendar/calendar.types.ts`
- app shell and metadata:
  `src/app/*`

## Styling conventions

The project uses Tailwind CSS utilities directly in components.

Guidelines:

- keep repeated visual patterns grouped in shared local constants when it improves readability
- prefer extracting a component over letting a JSX block become too large
- preserve the established visual language unless the feature intentionally changes the design

## State conventions

- keep source-of-truth state in `Calendar.tsx`
- keep presentational components prop-driven
- prefer derived values over duplicated state
- normalize date values before comparing or persisting them

## When adding features

Try to follow this sequence:

1. update or add shared types if the domain model changes
2. add utility helpers if the feature introduces reusable date or storage logic
3. update `Calendar.tsx` for state ownership and derived data
4. update the relevant UI component
5. add or update tests
6. verify lint, tests, and build

## Assets

Month artwork is stored in `public/` and imported through Next.js static image handling. If new month assets are added, update `calendar.constants.ts` so image ordering stays aligned with month ordering.

## Suggested Cleanup Opportunities

These are reasonable future refactors, but not required for current functionality:

- move persistence effects into a custom hook
- add stronger validation for hydrated storage payloads
- reduce JSX density in the largest planner components
- add more test coverage around persistence and calendar interactions

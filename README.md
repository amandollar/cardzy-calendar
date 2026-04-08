# Cardzy Wall Calendar

Cardzy is a responsive wall-calendar planner built with Next.js, React, TypeScript, and Tailwind CSS. It includes a month gallery, a detailed planner view, range-based note saving, and month-level memo and task management with local persistence.

## Features

- 12-month gallery for 2026 with artwork-based month selection
- detailed planner view with month navigation
- date-range selection directly on the calendar grid
- saved plans with titles and notes linked to selected ranges
- month workspace for memo writing and task tracking
- responsive layout for desktop, tablet, and mobile
- localStorage persistence for planner state

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Vitest
- Testing Library
- ESLint

## Project Structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    Calendar/
      Calendar.tsx
      MonthGallery.tsx
      PlannerMain.tsx
      PlannerSidebar.tsx
      RangeNoteDialog.tsx
      MonthWorkspaceDialog.tsx
      calendar.constants.ts
      calendar.types.ts
      calendar.utils.ts
      __tests__/
public/
  *.png
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` starts the local development server
- `npm run lint` runs ESLint
- `npm run test` runs Vitest in watch mode
- `npm run test:run` runs the test suite once
- `npm run build` creates a production build
- `npm run start` starts the production server

## Testing

The project includes automated tests with Vitest and Testing Library.

Current coverage includes:

- calendar utility logic
- month gallery rendering and interaction
- range note dialog keyboard behavior

Run tests with:

```bash
npm run test:run
```

## Build

Create a production build with:

```bash
npm run build
```

Run the production server locally with:

```bash
npm run start
```

## Notes

- Planner data is stored locally in the browser using `localStorage`.
- The project is frontend-only and does not use a backend or database.

## Additional Documentation

Detailed technical documentation is available in the `docs/` folder:

- [`docs/architecture.md`](./docs/architecture.md)
- [`docs/state-and-data.md`](./docs/state-and-data.md)
- [`docs/development.md`](./docs/development.md)
- [`docs/testing.md`](./docs/testing.md)

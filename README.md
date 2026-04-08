# Cardzy Wall Calendar

A polished interactive wall-calendar planner built for a frontend engineering assignment using Next.js 16, React 19, TypeScript, and Tailwind CSS.

This project starts from a simple prompt, "build an interactive wall calendar," and turns it into a small product:
- a visual month gallery for 2026
- a detailed planner view for each month
- date-range planning with clear selection states
- notes tied to saved ranges
- a lightweight month workspace for memo + tasks
- responsive behavior across desktop, tablet, and mobile

## Overview

The experience is designed around two layers:

1. **Month Gallery**
   A visual landing surface for all 12 months of 2026. Each month has its own artwork and can be opened directly into the detailed planner.

2. **Detailed Planner**
   A wall-calendar style planning board with:
   - start/end date range selection
   - quick presets
   - saved range notes
   - month notes and checklist dialog
   - persistent local state

The goal was to make the component feel useful, not just decorative.

## Core Features

- **Wall calendar aesthetic**
  The planner is anchored by a month artwork card and a persistent calendar grid rather than a popover date picker.

- **Date range selection**
  Users can select a start date and end date directly on the calendar. The UI distinguishes:
  - start day
  - end day
  - in-between selected days
  - saved plan markers

- **Integrated notes**
  Notes can be attached to a selected range and saved as reusable plans. A separate month workspace supports monthly memo writing and task tracking.

- **Responsive layouts**
  - **Desktop:** split board layout with hero rail + main planner
  - **Tablet:** compressed but still structured layout
  - **Mobile:** intentional two-view flow (`Calendar` / `Plans`) instead of one long stacked scroll

- **Persistent frontend-only state**
  All planner state is stored in `localStorage`, which keeps the assignment fully frontend-focused.

## Product Decisions

### 1. Gallery first, planner second
Instead of dropping users directly into one month, the app opens with a 12-month gallery for 2026. This makes the product feel more intentional and gives each month its own visual identity.

### 2. Range notes as saved plans
Selecting dates without a next action feels incomplete, so a saved plan flow was introduced:
- select a range
- add a title + note
- save it
- reopen it later from the sidebar

### 3. Month workspace in a dialog
Month memo + tasks are useful, but keeping them permanently visible made the board feel too heavy. Moving them into a dialog keeps the planner sharp while preserving utility.

### 4. Frontend-only persistence
The assignment explicitly focuses on frontend execution, so `localStorage` was chosen over a backend or mocked API. This keeps the solution aligned with scope while still feeling stateful and realistic.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Vitest + Testing Library**
- **ESLint**

## Project Structure

```text
src/
  app/
    globals.css
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
```

### Notable files

- [src/app/page.tsx](./src/app/page.tsx)
  App entry point.

- [src/components/Calendar/Calendar.tsx](./src/components/Calendar/Calendar.tsx)
  Top-level coordinator for planner state, persistence, gallery/detail switching, and dialogs.

- [src/components/Calendar/MonthGallery.tsx](./src/components/Calendar/MonthGallery.tsx)
  Landing gallery for the 12-month collection.

- [src/components/Calendar/PlannerMain.tsx](./src/components/Calendar/PlannerMain.tsx)
  Main planner board, header controls, grid, and selection interactions.

- [src/components/Calendar/PlannerSidebar.tsx](./src/components/Calendar/PlannerSidebar.tsx)
  Month artwork, quick month context, and saved plans rail.

- [src/components/Calendar/calendar.utils.ts](./src/components/Calendar/calendar.utils.ts)
  Date helpers, storage helpers, range formatting, and derived planner utilities.

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev`
  Start the local development server.

- `npm run lint`
  Run ESLint.

- `npm run test`
  Run Vitest in watch mode.

- `npm run test:run`
  Run the test suite once.

- `npm run build`
  Create the production build.

- `npm run start`
  Start the production server after build.

## Verification

The project was checked with:

```bash
npm run lint
npm run test:run
npm run build
```

All three commands pass successfully.

## Tests

The project includes a lightweight unit and interaction test layer using Vitest and Testing Library.

Current coverage focuses on high-value frontend behavior:
- calendar date utility logic
- preset and range calculations
- stored snapshot restoration
- month gallery rendering and selection
- range-note dialog accessibility behavior

Test files currently live in:

```text
src/components/Calendar/__tests__/
```

## Accessibility and UX Notes

- dialog views support `Escape` to close
- dialog content uses `role="dialog"` and `aria-modal`
- mobile avoids a long-scroll dashboard pattern
- selected ranges, today state, weekends, and saved plans each have distinct visual treatment
- persistence logic is protected against restricted `localStorage` environments

## Walkthrough Guide

For the required demo video, this is the cleanest flow:

1. Open the site on the **month gallery**.
   Explain that each month of 2026 has its own artwork and opens into a detailed planner.

2. Click a month card.
   Show that the planner opens directly in that month.

3. Demonstrate **range selection**.
   Click a start date, then an end date, and show the visible selected block.

4. Click **Add note**.
   Add a titled note for the selected range and save it.

5. Reopen the saved plan from the sidebar.
   Show that saved notes are attached to their date ranges and can be revisited.

6. Open **Month notes**.
   Add a memo and a few tasks, then mark one complete.

7. Use the quick presets.
   Show `Today`, `Weekend`, `Next 7 days`, and `This month`.

8. Resize to tablet and phone.
   Show that tablet compresses the layout and phone switches into `Calendar` / `Plans` views instead of becoming one long page.

## Tradeoffs

- No backend or user accounts were added because the brief is strictly frontend-focused.
- `localStorage` is enough for this assignment, though a real multi-user product would likely move planner data to an API.
- The UI favors a custom wall-calendar presentation over using a generic third-party calendar package.

## If I Extended This Further

If this were taken beyond the assignment, the next additions would be:

- per-day notes
- recurring reminders
- keyboard-first grid navigation
- better drag-selection on touch devices
- export/share for saved plans

## Submission Notes

This repository is ready to submit as:
- source code
- recorded walkthrough
- optional deployed demo

The app builds successfully and stays within the assignment scope by focusing entirely on frontend engineering quality.

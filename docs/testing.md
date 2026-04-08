# Testing

## Current Test Stack

The project uses:

- Vitest
- Testing Library
- jsdom

Configuration lives in:

- `vitest.config.mts`
- `vitest.setup.ts`

## Current Coverage

The existing suite focuses on high-value behavior:

- calendar grid generation
- range preview logic
- preset behavior
- persistence restoration
- month gallery rendering and click interaction
- range note dialog keyboard behavior

Current test files:

```text
src/components/Calendar/__tests__/
```

## Running Tests

Run the full suite once:

```bash
npm run test:run
```

Run in watch mode:

```bash
npm run test
```

## Testing Philosophy

The current approach favors:

- direct tests of date and storage utilities
- targeted component behavior tests
- small, maintainable coverage over broad snapshot-heavy tests

This is a good fit for the current size of the project because most of the complexity is in date logic and planner state behavior.

## Gaps Worth Covering Next

The most valuable next additions would be:

- persistence round-trip behavior across date parsing paths
- calendar grid interaction flows in `PlannerMain.tsx`
- month workspace dialog behavior
- copy-summary behavior
- accessibility checks for form labelling and dialog controls

## Mocking Notes

`vitest.setup.ts` currently mocks `next/image` so component tests can run in jsdom without pulling in Next.js image internals.

If tests are added for additional Next.js runtime features, keep the mocks lightweight and focused on what the component actually needs.

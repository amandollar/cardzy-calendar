# Documentation

This folder contains project-level technical documentation for Cardzy.

## Contents

- [`architecture.md`](./architecture.md) explains component boundaries, runtime flow, and design tradeoffs
- [`state-and-data.md`](./state-and-data.md) documents state ownership, persistence, and derived data
- [`development.md`](./development.md) covers local setup, working conventions, and safe extension points
- [`testing.md`](./testing.md) summarizes the current test setup, coverage, and recommended next additions

## When to Use These Docs

- start with `architecture.md` if you are new to the codebase
- use `state-and-data.md` before changing planner state or persistence logic
- use `development.md` before adding a new feature or refactoring existing UI
- use `testing.md` when adding coverage or updating test tooling

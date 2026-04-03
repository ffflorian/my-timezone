# AGENTS Guide

This file explains how coding agents should work in this repository.

## General

### Approach

- Think before acting. Read existing files before writing code.
- Be concise in output but thorough in reasoning.
- Prefer editing over rewriting whole files.
- Do not re-read files you have already read.
- Test your code before declaring done.
- No sycophantic openers or closing fluff.
- Keep solutions simple and direct.
- User instructions always override this file.

### Output

- Return code first. Explanation after, only if non-obvious.
- No inline prose. Use comments sparingly - only where logic is unclear.
- No boilerplate unless explicitly requested.

### Code Rules

- Simplest working solution. No over-engineering.
- No abstractions for single-use operations.
- No speculative features or "you might also want..."
- Read the file before modifying it. Never edit blind.
- No docstrings or type annotations on code not being changed.
- No error handling for scenarios that cannot happen.
- Three similar lines is better than a premature abstraction.

### Review Rules

- State the bug. Show the fix. Stop.
- No suggestions beyond the scope of the review.
- No compliments on the code before or after the review.

### Debugging Rules

- Never speculate about a bug without reading the relevant code first.
- State what you found, where, and the fix. One pass.
- If cause is unclear: say so. Do not guess.

### Simple Formatting

- No em dashes, smart quotes, or decorative Unicode symbols.
- Plain hyphens and straight quotes only.
- Natural language characters (accented letters, CJK, etc.) are fine when the content requires them.
- Code output must be copy-paste safe.

## Tech Stack

- **React 19** with **TypeScript 6** (strict mode)
- **Vite 8** as build tool and dev server
- **my-timezone** for true solar time calculation
- **Leaflet** + **react-leaflet** for the interactive map
- **ESLint** + **oxlint** for linting, **Prettier** for formatting
- **lefthook** for pre-commit hooks
- **Vitest** + **Testing Library** for tests
- **Semantic Release** for automated versioning and changelogs

## Commands

```bash
yarn install        # install dependencies
yarn dev            # start dev server (http://localhost:5173)
yarn build          # type-check + Vite build
yarn dist           # clear dist/ then build
yarn lint           # run all linters (Prettier, oxlint, ESLint)
yarn fix            # auto-fix all linting issues
yarn test           # run tests
```

Always use `yarn`, not `npm`, for all package management and script execution.

After making any code changes, always run `yarn fix` to catch and auto-fix linting or formatting errors before committing.

## Project Structure

```
src/
  main.tsx           # entry point (React StrictMode)
  App.tsx            # root component
  components/        # UI components (Map, Clock, LocationInfo, etc.)
  hooks/             # custom hooks (useGeolocation, useSolarTime, etc.)
  index.css          # global styles with CSS custom properties for theming
public/
  img/               # favicons and logo assets
index.html           # HTML entry point
```

## Key Architecture Decisions

- **Location**: browser Geolocation API provides latitude/longitude; no backend required.
- **Solar time**: `my-timezone` npm package calculates local mean time from longitude.
- **Map**: Leaflet with OpenStreetMap tiles, centered on the user's coordinates.
- **Reverse geocoding**: Nominatim (OpenStreetMap) API for human-readable place name.
- **Theme**: CSS custom properties on `:root[data-theme]`. System preference detected via `prefers-color-scheme`; user override persisted to `localStorage`.
- **State management**: React hooks and Context only; no external state library.

## Conventions

- **Branches**: use the format `<fix/feat/chore>/<branch-name>` (e.g. `feat/map-component`, `fix/clock-offset`). Do not prefix branch names with `claude/`.
- **Commits**: follow Conventional Commits (Angular preset) - `feat:`, `fix:`, `chore:`, etc. Breaking changes use `BREAKING CHANGE:` in the footer. Do not add Claude session URLs to commit messages or PR texts.
- **Versioning**: automated via Semantic Release on push to `main`.
- **Code style**: 2-space indent, LF line endings, UTF-8 (enforced by `.editorconfig` and Prettier).
- **TypeScript**: strict mode enabled; no `any` without justification.

## CI/CD

- **build_test_publish.yml**: runs lint -> test -> build on every push/PR to `main`; deploys to GitHub Pages on `main` merges.
- **codeql.yml**: CodeQL security analysis on push/PR to `main` and weekly.
- **dependabot.yml**: automated dependency version updates.

## Pre-commit Hooks (lefthook)

Runs sequentially on staged files:

1. Prettier - formats `.js/.ts/.jsx/.tsx/.css/.json/.md/.yml`
2. oxlint - fast lint + autofix for TypeScript/JavaScript
3. ESLint - full lint + autofix for TypeScript/JavaScript

Always run `yarn fix` before committing if hooks fail.

# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js/React TypeScript game app managed with `pnpm`. Route files live in `app/`, including localized routes under `app/[locale]/` and prototypes under `app/prototype/`. Reusable UI is in `components/`, with feature folders such as `components/fibonacci/`, `components/garden/`, and `components/grassland/`. Shared game logic, stores, validation, analytics, and utilities live in `lib/`. Database code is split between `db/` for Drizzle schema/migrations and `prisma/` for Prisma configuration. Locale messages are in `messages/`, global CSS is in `styles/`, static assets are in `public/`, and Jest tests are in `__tests__/`.

## Build, Test, and Development Commands

Use `pnpm install` to install dependencies. Run `pnpm dev` for the local Next.js dev server, `pnpm build` for production, and `pnpm start` to serve a built app. Use `pnpm lint` or `pnpm lint:fix` for Next.js ESLint checks, and `pnpm type-check` for `tsc --noEmit`. Run `pnpm test` for Jest, `pnpm test:watch` during active development, and `pnpm test:coverage` to collect coverage for `components/` and `lib/`. Database workflows use `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:push`, and `pnpm db:studio`.

## Coding Style & Naming Conventions

Prefer strict TypeScript and React function components. Components use PascalCase filenames, for example `GameKeyboard.tsx`; hooks use `useName` naming; utility modules usually use kebab-case or descriptive lower-case names, such as `keyboard-handler.ts`. The codebase uses two-space indentation, single quotes, and no semicolons in TypeScript/TSX. Use the `@/*` alias when it improves clarity. Keep Tailwind classes readable and colocated with JSX.

## Testing Guidelines

Jest runs in `jsdom` via `next/jest`, with React Testing Library and `@testing-library/jest-dom` configured in `jest.setup.js`. Name tests `*.test.ts` or `*.test.tsx` and mirror source areas under `__tests__/components/` or `__tests__/lib/`. Mock Zustand stores and browser APIs explicitly when testing UI behavior. Add or update tests for game logic, keyboard interactions, state changes, and shared utility regressions.

## Commit & Pull Request Guidelines

Recent history mostly follows Conventional Commits, such as `feat(logo): ...`, `fix(brand): ...`, and `chore(nav): ...`; keep using that style with a concise scope. Pull requests should describe the user-visible change, list test commands run, link issues, and include screenshots or recordings for visual UI changes. Call out migrations, environment variable changes, or localization updates clearly.

## Security & Configuration Tips

Do not commit secrets from `.env`; use `.env.example` for documented variables. Validate Supabase, database, and Cloudinary-related changes locally before opening a PR, and keep generated artifacts like `.next/`, coverage output, and build caches out of commits.

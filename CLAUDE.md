# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Gamelet** is a multi-game platform featuring:
- **Nerdle**: Daily math equation puzzle (classic Wordle-style for math)
- **Garden**: Creative canvas drawing with plant growth mechanics (Global Trellis brand)
- **Grassland**: Prairie scene with particle effects and plant cultivation
- **2584**: Fibonacci sequence puzzle game
- **Fibonacci Game**: Additional Fibonacci-based gameplay

## Development Commands

```bash
# Core development
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Build production version
pnpm start        # Start production server
pnpm preview      # Build and preview production version

# Code quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Auto-fix ESLint issues
pnpm type-check   # Run TypeScript type validation

# Testing
pnpm test         # Run Jest tests
pnpm test:watch  # Run tests in watch mode
pnpm test:coverage # Run tests with coverage

# Database
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Prisma Studio
```

## Tech Stack

- **Framework**: Next.js 16.x with App Router
- **Frontend**: React 19.x, TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-based, no config file)
- **State Management**: Zustand with persistence
- **Animations**: Framer Motion
- **i18n**: next-intl (App Router with `[locale]` segments)
- **Database**: PostgreSQL with Drizzle ORM + Prisma (dual ORM)
- **Canvas**: Fabric.js for Garden drawing
- **Deployment**: Vercel
- **OG Images**: @vercel/og for dynamic social cards

## Architecture

### App Router Structure
```
app/
├── [locale]/              # i18n routing (en, fr, de, ru, etc.)
│   ├── nerd/              # Nerdle game (game/, game/GamePageClient.tsx)
│   ├── garden/            # Garden drawing (create/, flowers/)
│   ├── grassland/         # Grassland scene (my-plants/, [plantId]/)
│   ├── 2584/              # 2584 Fibonacci puzzle
│   ├── about/             # About page
│   └── layout.tsx         # Locale layout with providers
├── api/                   # API routes
│   ├── garden/            # Garden backend (feed, plants CRUD, like)
│   ├── grassland/         # Grassland backend (plants, water, upload)
│   └── share-image/       # OG image generation
├── prototype/             # Experimental/prototype pages
├── messages/              # i18n JSON messages by locale
├── robots.txt/route.ts    # Dynamic robots.txt
├── sitemap.ts              # Dynamic sitemap
└── layout.tsx              # Root layout
```

### Brand System Architecture
The project uses a multi-brand architecture defined in `lib/brand.ts`:
- **primary**: Gamelet platform brand
- **game**: Nerdle game brand
- **creative**: Global Trellis garden brand
- **platform**: Gamelet unified platform

Each brand supports full i18n translations (en, es, fr, de, it, ja, ru, zh) via `INTERNATIONALIZED_BRANDS`. Use `getBrandConfig(type, language)` or `generateSEOContent(type, language, context)` for brand-aware content.

### State Management
- `lib/store.ts` - Nerdle game state (Zustand + localStorage persistence)
- `lib/fabric-store.ts` - Garden canvas state
- `lib/garden-store.ts` - Garden feed state
- `lib/fibonacci-game-store.ts` - Fibonacci game state

### Key Libraries
- Game logic: `lib/game-engine.ts`, `lib/fibonacci-game-engine.ts`
- SEO: `lib/seo.ts`, `lib/seo-utils.ts` - Template-based SEO with next-intl integration
- Brand: `lib/brand.ts`, `lib/brand-constants.ts` - Multi-brand system (primary/game/creative/platform) with i18n support
- Canvas tools: `lib/fabric-tools/`
- Database: `lib/db/plants.ts`, `lib/db/prisma.ts` - Drizzle ORM + Prisma schema

### Internationalization
- Locales configured in `i18n/config.ts` (supports en, fr, de, ru, etc.)
- Routing: `i18n/routing.ts` with localePrefix 'as-needed' (default locale has no prefix)
- Request config: `i18n/request.ts`
- Messages in `app/messages/{locale}.json`

## Game Rules (Nerdle)

1. All equations must be mathematically valid
2. Exactly one `=` sign required
3. Result must be a positive integer
4. Use only numbers 0-9 and operators `+`, `-`, `*`, `/`, `=`
5. Modes: Classic (8 chars), Mini (6 chars), Expert (10 chars)

## Code Style

- TypeScript strict mode
- `@/` path aliases (configured in tsconfig.json)
- Component files: PascalCase (e.g., `GameBoard.tsx`)
- Utility files: camelCase (e.g., `game-engine.ts`)
- Tailwind CSS utility-first styling

## Security

- CSP and security headers in `next.config.js`
- XSS protection, frame protection, content-type sniffing prevention

This codebase is production-ready for the Nerdle game with expanding Garden/Grassland features.

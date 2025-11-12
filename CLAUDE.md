# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nerdle** is a daily math equation puzzle game built with Next.js, React 19, and TypeScript. The project also has comprehensive documentation for **Global Trellis** - an upcoming creative social platform expansion that will add Canvas-based drawing and plant growth mechanics to the existing math game.

## Development Commands

```bash
# Core development
npm run dev          # Start development server (localhost:3000)
npm run build        # Build production version
npm run start        # Start production server
npm run preview      # Build and preview production version

# Code quality
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # Run TypeScript type validation

# Package management
pnpm install         # Install dependencies (uses pnpm as package manager)
```

## Tech Stack & Architecture

### Current (Pages Router)
- **Framework**: Next.js 15.5.0 with Pages Router
- **Frontend**: React 19.0.0, TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence
- **Animations**: Framer Motion
- **SEO**: Next-SEO with comprehensive meta tags
- **Deployment**: Vercel (production at chimii.com)

### Planned (Global Trellis Expansion)
- **Router**: Migration to App Router (/garden route)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: Cloudinary for plant images
- **Caching**: Redis for feed performance
- **Canvas**: HTML5 Canvas API for drawing

## Core Architecture Patterns

### State Management (Zustand)
The game uses Zustand for state management with persistence:
- `lib/store.ts` - Main game state (current equation, attempts, statistics)
- State persists to localStorage automatically
- Game logic validation in `lib/game-engine.ts`

### Component Architecture
- **Pages**: Located in `pages/` directory
- **Components**: Reusable React components in `components/`
- **Game Components**: `GameBoard.tsx`, `GameKeyboard.tsx`, `GameHeader.tsx`
- **Utilities**: Core logic in `lib/` directory

### SEO & Performance
- Comprehensive SEO implementation in `lib/seo.ts`
- Dynamic sitemap generation (`pages/sitemap.xml.tsx`)
- Security headers configured in `next.config.js`
- Performance optimized with Vercel deployment

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- Use `@/` path aliases for imports
- Follow Tailwind CSS utility-first approach
- Component files use PascalCase naming
- Utility files use camelCase naming

### Game Logic Rules
When working with game mechanics (`lib/game-engine.ts`):
1. All equations must be mathematically valid
2. Exactly one equals sign required
3. Result must be a positive integer
4. Use only numbers 0-9 and operators +, -, *, /, =
5. Classic mode: 8 characters, Mini: 6, Expert: 10

### Global Trellis Architecture
The planned expansion uses `/garden` route with:
- Canvas drawing system in `components/garden/canvas/`
- Plant growth animations using Framer Motion
- Infinite scroll feed with Zustand state management
- RESTful API routes in `app/api/garden/`

## Key Technical Decisions

### Next.js Configuration
- React Strict Mode enabled for better debugging
- Security headers implemented (CSP, XSS protection)
- Image domains configured for CDN font loading
- Output file tracing for better build performance

### Package Management
- Uses pnpm 10.15.0 (not npm)
- Node.js >=22.x required
- TypeScript 5.5.4 with strict type checking

### Build & Deployment
- Vercel deployment with automatic production builds
- Environment variables managed through Vercel dashboard
- Performance optimized for Core Web Vitals

## File Structure Notes

- `components/` - Reusable React components
- `lib/` - Core utilities, game logic, and configurations
- `pages/` - Next.js pages and API routes
- `public/` - Static assets (images, icons)
- `styles/` - Global CSS and Tailwind configurations
- `docs/` - Technical documentation (including Global Trellis specs)
- `plans/` - Product requirements and planning documents

## Performance Considerations

- Client-side heavy architecture (most logic runs in browser)
- Zustand persistence for game state
- Optimized for Lighthouse scores (95+)
- Bundle size minimization through Next.js optimizations
- SEO-optimized for search engine visibility

## Security Implementation

- Comprehensive security headers in Next.js config
- XSS protection with CSP headers
- Content-Type sniffing prevention
- Frame protection to prevent clickjacking

This codebase is production-ready for the current Nerdle game and has detailed architectural plans for the Global Trellis expansion. The focus is on performance, SEO optimization, and user experience.
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website built with Next.js 16.1.6 (App Router), TypeScript, and Tailwind CSS v4. Features three main sections: about-me page, blog with MDX support, and a habit tracker.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Next.js App Router Structure

Uses Next.js App Router with file-based routing:
- `/` - Home/about-me page ([app/page.tsx](app/page.tsx))
- `/blog` - Blog index listing all posts ([app/blog/page.tsx](app/blog/page.tsx))
- `/blog/[slug]` - Individual blog post pages ([app/blog/[slug]/page.tsx](app/blog/[slug]/page.tsx))
- `/habits` - Habit tracker ([app/habits/page.tsx](app/habits/page.tsx))
- `/api/habits` - API route for habits data ([app/api/habits/route.ts](app/api/habits/route.ts))

All pages are **Server Components** by default. The layout ([app/layout.tsx](app/layout.tsx)) wraps all pages with shared navigation and styling.

### Blog System (MDX)

**Key files:**
- [lib/mdx.ts](lib/mdx.ts) - MDX compilation utilities
- [content/blog/](content/blog/) - MDX blog posts (frontmatter + content)

**How it works:**
1. Blog posts are `.mdx` files in `content/blog/` with YAML frontmatter (title, date, description)
2. `getAllPosts()` reads all MDX files, extracts frontmatter, returns sorted array
3. `getPostBySlug()` compiles individual posts with `next-mdx-remote/rsc`
4. Math rendering via `remark-math` + `rehype-katex` (supports `$...$` and `$$...$$`)
5. Blog posts are statically generated at build time via `generateStaticParams()`

**Adding new blog posts:**
Create a new `.mdx` file in `content/blog/` with frontmatter:
```mdx
---
title: "Post Title"
date: "YYYY-MM-DD"
description: "Brief description"
---

Content here...
```

### Habit Tracker

**Key files:**
- [lib/habits.ts](lib/habits.ts) - Habit data utilities (read JSON, calculate streak, generate dates)
- [data/habits.json](data/habits.json) - Habit tracking data store
- [app/habits/page.tsx](app/habits/page.tsx) - Habit tracker UI
- [app/api/habits/route.ts](app/api/habits/route.ts) - API endpoint (currently GET only)

**Data structure:**
```json
{
  "habits": {
    "YYYY-MM-DD": "complete" | "incomplete" | "na"
  }
}
```

**How it works:**
1. Habit data stored as date-keyed object in JSON file
2. `getHabitsData()` reads JSON synchronously (server-side only)
3. `calculateStreak()` counts consecutive "complete" days backwards from today
4. `getMonthDays()` generates Date array for calendar grid rendering
5. UI displays current + next month as 7-column grids (GitHub-style)
6. Colors: green (complete), white (incomplete), grey (N/A)

**Editing habits:**
Directly edit `data/habits.json` and refresh the page. No UI editor implemented yet.

### Shared Components

- [components/Navigation.tsx](components/Navigation.tsx) - Site navigation (Hi!, Blog, Habits)

Navigation is imported in the root layout and appears on all pages.

### Styling

**System:**
- Tailwind CSS v4 via PostCSS
- Dark mode via `prefers-color-scheme` and `dark:` prefix
- KaTeX CSS imported in [app/globals.css](app/globals.css) for math rendering

**Design language:**
- Minimalist with lots of whitespace
- Max-width: 768px (3xl container)
- Muted color palette: zinc grays, white/black backgrounds
- Font: Geist Sans (variable font loaded in layout)
- Typography: Tailwind's `prose` classes for blog content

**Key classes:**
- Container: `max-w-3xl mx-auto px-8 py-12`
- Text colors: `text-zinc-600` (light), `dark:text-zinc-400` (dark)
- Headings: `text-3xl font-semibold` (h1), `text-xl font-medium` (h2)

### TypeScript Configuration

- Path alias: `@/*` maps to project root (use for all imports)
- Strict mode enabled
- Target: ES2017

### Important Patterns

**Next.js 16 params handling:**
In dynamic routes, `params` is a Promise that must be awaited:
```typescript
interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  // ...
}
```

**Server-side file reading:**
MDX and habits utilities use Node.js `fs` module - these only work server-side. Import them in Server Components or API routes, never in Client Components.

**Static generation:**
Blog posts use `generateStaticParams()` to pre-render all posts at build time. Add this function to any dynamic route that should be statically generated.

## File Organization

```
app/                    # Next.js App Router
├── layout.tsx         # Root layout with Navigation
├── page.tsx           # Home page
├── globals.css        # Global styles + KaTeX import
├── blog/              # Blog routes
├── habits/            # Habits route
└── api/habits/        # API routes

components/            # Shared React components
lib/                   # Utility functions (server-side)
content/blog/          # MDX blog posts
data/                  # JSON data files
public/                # Static assets
```

## Dependencies

**Production:**
- `next@16.1.6` - React framework with App Router
- `react@19.2.3`, `react-dom@19.2.3` - React library
- `next-mdx-remote` - Server-side MDX compilation
- `remark-math`, `rehype-katex`, `katex` - Math rendering in blog posts

**Development:**
- `@tailwindcss/postcss@^4`, `tailwindcss@^4` - Styling
- `typescript@^5` - Type checking
- `eslint@^9`, `eslint-config-next` - Linting

## Notes

- No Next.js config customization needed - `next-mdx-remote` works out of the box
- No test suite currently implemented
- Dark mode is automatic via system preference (no manual toggle)
- Habits tracker is read-only in UI - edits via JSON file only

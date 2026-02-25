# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Colorear-web is a Spanish-language coloring pages website built with Next.js 16 (App Router). The site serves coloring images (dibujos para colorear) organized by categories, with images stored in Supabase Storage. Data is fetched directly from Supabase via REST API (no separate backend).

## Commands

### Development
```bash
npm install                # Install dependencies (run first time)
npm run dev                # Start frontend (localhost:3000)
```

### Production
```bash
npm run build              # Build frontend for production
```

### Other
```bash
npm run lint               # Run ESLint
```

## Architecture

### Frontend Organization
- `app/` - Next.js App Router pages with dynamic routes
  - `[category]/` - Category page (shows drawings in category)
  - `[category]/[slug]/` - Individual drawing page
  - `buscar/` - Search page
  - `api/drawings/search/` - Search API route
- `components/` - React components
  - `drawings/` - Drawing card, list, share buttons
  - `ui/` - Reusable UI primitives (button, card, modal, etc.)
- `lib/api.ts` - API client: types, Supabase REST fetchers, helpers
- `lib/utils.ts` - Utility functions (cn helper for Tailwind classes)
- `styles/globals.css` - Global styles with Tailwind CSS v4

### URL Structure
- `/` - Homepage (paginated drawings, sorted by popular/downloads/recent)
- `/[category]` - Drawings in a category
- `/[category]/[slug]` - Individual drawing detail page
- `/buscar?q=...` - Search results

### Data Flow
1. Next.js Server Components call functions from `lib/api.ts`
2. `lib/api.ts` fetches Supabase REST API directly with Next.js cache (1h revalidation)
3. Images resolved from `drawing_assets` table, served via Supabase Storage bucket `drawings`
4. Metrics (views/downloads) aggregated from `drawing_metrics_summary` view

### Database Schema (Supabase)

Key tables (new structure):

```sql
-- Categories (slug, name, description, is_active)
categories (id uuid PK, slug text UNIQUE, name text, description text, is_active boolean)

-- Drawings (linked to category, NOT subcategories)
drawings (id uuid PK, slug text UNIQUE, title text, description text,
          category_id uuid FK→categories, age_level enum, status enum,
          seo_title text, seo_description text, og_title text, og_description text,
          published_at timestamptz, created_at timestamptz)

-- Drawing assets (images in storage)
drawing_assets (id uuid PK, drawing_id uuid FK→drawings, kind enum, path text, ...)
-- kind: 'original_png' | 'thumbnail' | 'print_png' | 'pdf_a4' | 'pdf_letter' | 'pin_image'

-- Tags (N:N with drawings)
tags (id uuid PK, slug text UNIQUE, name text)
drawing_tags (drawing_id uuid, tag_id uuid, PK(drawing_id, tag_id))

-- Metrics
drawing_daily_metrics (drawing_id uuid, day date, views int, downloads int)
drawing_metrics_summary (VIEW: drawing_id, total_views, total_downloads)

-- Other: trends, pipeline_runs, pipeline_jobs, pinterest_boards,
--        pin_publications, drawing_moderation, drawing_events,
--        user_favorites, audit_log, profiles
```

### API Functions (lib/api.ts)
- `getDrawing(slug)` - Single drawing with assets, category, metrics
- `getCategories()` - Active categories
- `getDrawingsByCategory(categorySlug)` - Published drawings in a category
- `getDrawingsPaginated(sortBy, page, limit)` - Paginated with metrics sorting
- `getAllDrawings()` - For sitemap generation
- `getPublicUrl(path)` - Resolve storage path to public URL

### Path Aliases
- `@/*` maps to project root (configured in tsconfig.json)

## Tech Stack
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4 with tw-animate-css
- shadcn/ui (new-york style, lucide icons)
- Supabase (database + storage + RLS)
- @supabase/ssr + @supabase/supabase-js

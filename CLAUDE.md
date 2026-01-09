# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Colorear-web is a Spanish-language coloring pages website built with Next.js 16 (App Router) for the frontend and a separate Express.js backend. The site serves coloring images (dibujos para colorear) organized by categories and subcategories, with images stored in Supabase Storage.

## Commands

### Development
```bash
npm install                # Install dependencies (run first time)
npm run dev:all            # Start both frontend + backend together
npm run dev                # Start only frontend (localhost:3000)
npm run dev:backend        # Start only backend (localhost:5000)
```

### Production
```bash
npm run build              # Build frontend for production
npm run start:all          # Start both servers in production mode
```

### Other
```bash
npm run lint               # Run ESLint
```

### Running with Nginx
Nginx acts as a reverse proxy (access everything via port 80):
- `/` → Next.js (port 3000)
- `/api/*` → Express (port 5000)

```bash
# 1. Start both servers
npm run dev:all            # Development
npm run start:all          # Production

# 2. Configure nginx (Linux/Mac)
sudo cp nginx.conf /etc/nginx/sites-available/colorear-web
sudo ln -s /etc/nginx/sites-available/colorear-web /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload

# 2. Configure nginx (Windows)
copy nginx.conf C:\nginx\conf\conf.d\colorear-web.conf
nginx -t && nginx -s reload

# 3. Access at http://localhost
```

## Architecture

### Monorepo Structure
- **Frontend**: Next.js 16 with App Router in root directory
- **Backend**: Express.js API server in `/backend` directory (separate package.json)
- **Shared UI**: shadcn/ui components configured via `components.json`

### Frontend Organization
- `app/` - Next.js App Router pages with dynamic routes
  - `[category]/` - Category pages
  - `[category]/[subcategory]/` - Subcategory pages
  - `[category]/[subcategory]/[slug]/` - Individual drawing pages
- `frontend/components/` - React components
  - `ui/` - Reusable UI primitives (button, card, modal, etc.)
  - `home/` - Homepage layout components (navbar, footer, filtersBar)
  - `modals/` - Modal components
  - `seo/` - SEO-related components
- `frontend/lib/api.ts` - API client functions for backend communication
- `lib/utils.ts` - Utility functions (cn helper for Tailwind classes)
- `styles/globals.css` - Global styles with Tailwind CSS v4 and CSS variables

### Backend Organization
- `backend/index.js` - Express server entry point
- `backend/src/`
  - `routes/` - API route definitions (categories, subcategories, drawings, interactions)
  - `controllers/` - Request handlers
  - `services/` - Business logic and Supabase queries
  - `config/supabaseClient.js` - Supabase client configuration

### API Endpoints
All endpoints prefixed with `/api`:
- `/categories` - Category listing and details
- `/categories/:slug/subcategories` - Subcategories of a category
- `/subcategories/:slug` - Subcategory data
- `/subcategories/:slug/drawings` - Drawings in a subcategory
- `/drawings/:slug` - Single drawing metadata
- `/drawings/all?sortBy=popular|downloads|recent&page=1&limit=30` - Paginated drawings
- `/trending` - Top 20 by likes
- `/trending/:slug/like` - Add like (POST)
- `/trending/:slug/download` - Add download (POST)

### Database Schema (Supabase)
```sql
-- Categories
categories (
  id uuid primary key,
  slug text unique not null,
  nombre text not null,
  descripcion text,
  imagen text,
  created_at timestamp
)

-- Subcategories
subcategories (
  id uuid primary key,
  category_id uuid references categories(id),
  slug text unique not null,
  nombre text not null,
  descripcion text,
  imagen text,
  created_at timestamp
)

-- Drawings
drawings (
  id uuid primary key,
  subcategory_id uuid references subcategories(id),
  slug text unique not null,
  titulo text not null,
  descripcion text,
  imagen text not null,
  likes integer default 0,
  downloads integer default 0,
  created_at timestamp
)

-- Interactions (like/download tracking)
drawing_interactions (
  id uuid primary key,
  drawing_id uuid references drawings(id),
  interaction_type text not null,  -- 'like' | 'download'
  ip_hash text not null,
  created_at timestamp
)
```

### Example Data
```sql
-- Insert categories
INSERT INTO categories (slug, nombre, descripcion, imagen) VALUES
  ('navidad', 'Navidad', 'Dibujos navideños para colorear', 'category/bebebox.jpg'),
  ('animales', 'Animales', 'Animales tiernos para colorear', 'category/cat.jpg'),
  ('gabbyDollhouse', 'cartoon', 'Gabby Casa de muñecos', 'category/gabby.jpg');

-- Insert subcategories (use category_id from above)
INSERT INTO subcategories (category_id, slug, nombre, descripcion, imagen) VALUES
  ('1a7cd1d9-3237-471d-bdda-9b652332b3b3', 'arbol-navidad', 'Árbol de Navidad', 'Árboles de navidad para colorear', 'subcategory/bebebox.jpg'),
  ('1a7cd1d9-3237-471d-bdda-9b652332b3b3', 'santa-claus', 'Santa Claus', 'Dibujos de Santa Claus para niños', 'subcategory/cat.jpg');
```

### Data Flow
1. Next.js pages fetch data via `frontend/lib/api.ts`
2. API client calls Express backend at `localhost:5000/api`
3. Backend services query Supabase database
4. Images served from Supabase Storage bucket `drawings` (`dpvulchbiygiidolzrjl.supabase.co/storage/v1/object/public/drawings/`)

### Path Aliases
- `@/*` maps to project root (configured in tsconfig.json)
- shadcn aliases: `@/components`, `@/lib/utils`, `@/components/ui`

## Tech Stack
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4 with tw-animate-css
- shadcn/ui (new-york style, lucide icons)
- Express.js 5 with ES modules
- Supabase (database + storage)
- next-seo for SEO optimization

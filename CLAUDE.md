# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An ammunition inventory management system for reloaders. Tracks ammo boxes, firearm actions/barrels, load recipes, and reloading components. Built as a full-stack TypeScript monorepo.

## Commands

### Development
```bash
npm run dev              # Start both client (Vite :5173) and server (:3001) concurrently
npm run dev:client       # Client only
npm run dev:server       # Server only
npm run install:all      # Install all packages (root + client + server)
```

### Build & Run
```bash
npm run build            # Build client (tsc + vite) and server (tsc)
npm start                # Start production server
```

### Individual Workspace
```bash
cd client && npm run dev      # Vite dev server on :5173
cd server && npm run dev      # tsx watch on :3001
cd client && npm run build    # tsc -b && vite build
cd server && npm run build    # tsc (outputs to dist/)
```

There are no test commands configured.

## Architecture

### Monorepo Structure
- `client/` — React 18 + Vite + TailwindCSS frontend
- `server/` — Express 4 + TypeScript backend
- `shared/` — Shared TypeScript types (imported by both client and server)
- `data/` — JSON file storage (gitignored)

### Data Flow
The client proxies all `/api` requests to the server during development (configured in `client/vite.config.ts`). In production, Express serves the Vite build as static files and handles SPA fallback.

### Storage
All data is persisted in a single JSON file (`data/data.json`). The store (`server/src/storage/store.ts`) handles reads/writes and includes migration logic from an older "Rifle" schema to the current Action + Barrel schema.

### Domain Model (`shared/types.ts`)
- **Action** — Firearm receiver/action (with scope details)
- **Barrel** — Linked to an Action; has caliber, twist rate, zero distance
- **AmmoBox** — Box of ammunition with current Load and full LoadHistory + BarrelHistory
- **Load** — Reloading spec: powder, powder charge, primer, projectile, cartridge length
- **SavedLoad** — Named/reusable load recipe
- **Components** — Library of available powders, primers, and projectiles

### API Routes (`server/src/routes/`)
RESTful endpoints under `/api/`:
- `boxes` — AmmoBox CRUD + `POST /api/boxes/:id/reload` + `POST /api/boxes/:id/barrel`
- `actions` — Action CRUD
- `barrels` — Barrel CRUD (barrel is always linked to an action)
- `loads` — SavedLoad CRUD
- `components` — Components library CRUD

### API Client (`client/src/api/client.ts`)
Typed fetch wrapper used by all React pages. All server communication goes through this file.

### Frontend Structure
Pages in `client/src/pages/` follow a List / Detail / Form pattern for each entity. Reusable components live in `client/src/components/`.

## Design System

The UI uses a "precision industrial" dark theme defined in `client/tailwind.config.js` and `client/src/index.css`:
- **`gun-*`** — Dark gray palette (backgrounds, surfaces)
- **`brass-*`** — Gold/brass accent colors for interactive elements
- **Fonts**: Bebas Neue (display/headings), Barlow (body), JetBrains Mono (technical/numeric values)

Custom Tailwind utilities in `index.css` remap standard colors to this palette globally.

## Deployment

Docker multi-stage build: builds client and server, then runs Express which serves both the API and the compiled SPA. Key env vars: `PORT`, `DATA_PATH`, `CLIENT_DIST`.

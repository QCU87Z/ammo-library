# Codebase Guide

This document explains what every file in this project does, written for someone who doesn't know web development or TypeScript.

---

## The Big Picture

The app is split into three separate pieces that work together:

- **`client/`** — Everything the user sees in their browser (the website)
- **`server/`** — The program running in the background that saves and retrieves data
- **`shared/`** — Definitions of what the data looks like, used by both the client and server so they stay in sync

When you open the app in a browser, the browser loads the client. When you create a box or save a load, the client sends a request to the server, which writes the data to a file on disk and sends back a response.

---

## Root Files (Project-Wide)

| File | What it does |
|------|-------------|
| `package.json` | The master "control panel" for the project. Lists shortcuts like `npm run dev` (start everything) and `npm run build` (package it for production). |
| `Dockerfile` | A recipe for packaging the entire app into a self-contained unit called a container, so it can run anywhere without setup. |
| `docker-compose.yml` | A simpler way to run that container. Points the app at your data folder so nothing gets lost when you restart. |
| `CLAUDE.md` | Instructions for the AI assistant (Claude) explaining how this project is structured. |

---

## Shared Data Definitions

### `shared/types.ts`
Think of this as a shared glossary. It defines what a "box," "barrel," "action," "load," etc. actually look like in the database — what fields they have and what types those fields are. Both the browser code and the server code import from here so they always agree on the shape of the data.

---

## Server Files

The server is a program that runs quietly in the background. It listens for requests from the browser, reads or writes to the data file, and sends back answers.

### `server/src/index.ts`
The front door of the server. It starts up Express (the web framework), connects all the route files (see below), and — in production — also serves the website files so everything runs from a single address.

### `server/src/storage/store.ts`
The filing cabinet. This file handles reading from and writing to `data/data.json` — the single file where all your boxes, barrels, actions, and loads are stored. It also contains migration code that automatically upgrades old data (when barrels were called "Rifles") to the current format the first time it runs.

### Route Files — `server/src/routes/`

Each route file handles one type of data. They all follow the same pattern: list everything, get one item, create one, update one, delete one.

| File | What it manages |
|------|----------------|
| `boxes.ts` | Ammo boxes — also handles the "reload" action (logs the old load to history and sets a new one) and barrel assignment. |
| `actions.ts` | Gun actions (receivers) — won't let you delete one if it still has barrels attached. |
| `barrels.ts` | Barrels — tracks total rounds fired through each, won't let you delete if boxes are still assigned. |
| `loads.ts` | Saved load recipes — your reusable reloading recipes. |
| `components.ts` | The lists of powders, primers, and projectiles that appear in dropdowns throughout the app. |

---

## Client Files

The client is everything that runs in your browser. It's a single-page app, meaning the browser loads it once and then navigates between "pages" without ever reloading.

### Entry Points

| File | What it does |
|------|-------------|
| `client/src/main.tsx` | The very first thing that runs. Mounts the app onto the blank HTML page. |
| `client/src/App.tsx` | The table of contents. Maps every URL path (e.g. `/boxes/123`) to the correct page component. |
| `client/src/api/client.ts` | A helper that handles all communication with the server. Every time the app needs to load, save, or delete data, it calls a function from this file. |
| `client/src/index.css` | Global visual styles. Overrides the defaults so everything matches the dark industrial theme. |

### Configuration Files

| File | What it does |
|------|-------------|
| `client/vite.config.ts` | Configuration for Vite, the tool that bundles all the code into files the browser can understand. Also sets up the `/api` proxy so browser requests reach the server during development. |
| `client/tailwind.config.js` | Configuration for Tailwind CSS, the styling system. This is where the custom color names (`gun-900`, `brass-400`, etc.) and fonts (Bebas Neue, Barlow, JetBrains Mono) are defined. |
| `client/postcss.config.js` | A small config that tells the build process to run Tailwind and a browser-compatibility tool. |
| `client/tsconfig.json` | Tells the TypeScript compiler how strict to be and where to find files. |

---

## Pages — `client/src/pages/`

Each file here is one screen of the app.

### Dashboard
**`Dashboard.tsx`** — The home screen. Shows counts (total boxes, active boxes, actions, barrels), a search bar, and a list of recent boxes. Has quick-access buttons for the QR scanner and label printer.

### Ammo Boxes
| File | Screen |
|------|--------|
| `BoxList.tsx` | The full list of all boxes with filters for status and barrel assignment. |
| `BoxDetail.tsx` | The detail view for one box: current load, barrel history, load history timeline, QR code, and action buttons. |
| `BoxForm.tsx` | The create/edit form for a box: number, brand, round count, barrel assignment, and optional starting load. |
| `ReloadForm.tsx` | The form for recording a reload event. Archives the current load with optional notes, then sets a new one. |

### Actions (Receivers)
| File | Screen |
|------|--------|
| `ActionList.tsx` | List of all gun actions with name, serial, and scope info. |
| `ActionDetail.tsx` | Detail view for one action: specs, notes, and attached barrels. |
| `ActionForm.tsx` | Create/edit form for an action: name, serial, scope, notes. |

### Barrels
| File | Screen |
|------|--------|
| `BarrelList.tsx` | List of all barrels showing caliber, length, twist rate, and round count. |
| `BarrelDetail.tsx` | Detail view for one barrel: all specs, total rounds, and assigned boxes. |
| `BarrelForm.tsx` | Create/edit form for a barrel: caliber, length, twist rate, zero distance, notes. |

### Loads & Components
| File | Screen |
|------|--------|
| `LoadList.tsx` | List of all saved load recipes. |
| `LoadForm.tsx` | Create/edit form for a saved load: name, projectile, powder, charge weight, primer, OAL, notes. |
| `ComponentManager.tsx` | Three-column editor for your lists of powders, primers, and projectiles — the items that appear in dropdowns across the app. |

### Utility Screens
| File | Screen |
|------|--------|
| `ScanQR.tsx` | Opens the camera and reads a QR code from a printed label, then jumps directly to that box's detail page. |
| `PrintLabels.tsx` | Lets you pick boxes, preview their labels, and print a sheet (3 columns × 8 rows) of standard adhesive labels with QR codes. |

---

## Components — `client/src/components/`

These are reusable building blocks used across multiple pages. Think of them as Lego pieces.

| File | What it is |
|------|-----------|
| `Layout.tsx` | The outer shell of every page — the sidebar + content area. Handles the responsive layout so the sidebar collapses on small screens. |
| `Navbar.tsx` | The navigation sidebar with links to every section of the app. Highlights the current page. |
| `SearchBar.tsx` | The search input box with a magnifying-glass icon. Reused on the dashboard and box list. |
| `BoxCard.tsx` | The card-shaped summary for one box (number, brand, rounds, barrel, load, status). Used in lists. |
| `StatusBadge.tsx` | The small green "Active" or gray "Retired" pill shown on box cards. |
| `QRCodeDisplay.tsx` | Generates and displays the QR code image for a box, showing the URL it encodes. |
| `QRScanner.tsx` | The live camera view that scans QR codes. |
| `PrintableLabel.tsx` | The label layout that gets sent to the printer — sized to fit standard Avery label sheets. Contains the QR code, box number, brand, barrel, and load. |
| `LoadHistoryTimeline.tsx` | A vertical timeline showing every past reload for a box in chronological order. |
| `ConfirmDialog.tsx` | The "Are you sure?" popup that appears before deleting anything. |

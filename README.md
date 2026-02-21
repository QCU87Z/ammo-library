# Gun Library // DOPE

A self-hosted gun inventory and ballistics tracking app. Manages ammo boxes, firearm actions and barrels, handload recipes, and scope elevation (DOPE) data — all in one place.

## Features

- **Ammo boxes** — track brand, round count, current load, barrel assignment, and full reload history
- **Actions & barrels** — manage receivers and barrels separately; barrels track total rounds fired
- **Saved loads** — reusable handload recipes (powder, charge, primer, projectile, OAL)
- **Components library** — maintain lists of powders, primers, and projectiles for dropdown menus
- **DOPE / elevations** — record scope elevation data (MOA) by barrel, load, and distance; grouped and filterable
- **QR codes** — generate and print labels for boxes; scan with camera to jump straight to a box
- **Print labels** — print sheets of Avery-compatible labels (3×8) for your boxes

## Stack

- **Client** — React 18, Vite, Tailwind CSS
- **Server** — Express 4, TypeScript
- **Storage** — single JSON file (`data/data.json`)
- **Fonts** — Bebas Neue (headings), Barlow (body), JetBrains Mono (numeric values)

## Development

```bash
npm run install:all   # install root + client + server dependencies
npm run dev           # start client (:5173) and server (:3001) concurrently
```

## Production (Docker)

```bash
docker compose up --build
```

The app runs on port 3000. Mount a volume for `data/` to persist across restarts — the compose file handles this automatically.

```yaml
# docker-compose.yml already maps ./data:/app/data
```

## Data

All data lives in `data/data.json` (gitignored). The server creates it automatically on first run. Backup by copying the file.

## Project structure

```
client/       React frontend
server/       Express backend
shared/       TypeScript types shared by both
data/         JSON storage (gitignored)
```

See [CODEBASE_GUIDE.md](./CODEBASE_GUIDE.md) for a plain-English walkthrough of every file.

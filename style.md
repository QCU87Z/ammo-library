# Design System — "Precision Industrial" Dark Theme

## Concept
A high-contrast dark UI that evokes precision engineering equipment — think machined metal, tactical gear, and instrument panels. Heavy use of monospace type, muted steel-blue grays, and a single warm brass/gold accent color for all interactive and highlighted elements.

---

## Color Palette

### `gun-*` — Primary surface/text scale (12-step neutral, distinct luminance per step)
```
gun-950: #0a0c11   ← deepest background, form inputs
gun-900: #13161c   ← page background (body)
gun-800: #1f2229   ← card surfaces, sidebar
gun-750: #2a2d35   ← hover state for cards
gun-700: #3c4150   ← borders, dividers, hairlines
gun-600: #5b6170   ← decorative dim labels (nav section headers) — NOT body text
gun-500: #8d94a3   ← muted text, label-tier — readable on gun-800 (~12:1)
gun-400: #aeb4c1   ← secondary labels, subtext, unit annotations
gun-300: #cdd1da   ← tertiary text, key meta lines
gun-200: #e2e5eb   ← medium text
gun-100: #eef0f4   ← primary body text
gun-50:  #f9fafc   ← near-white (rarely used)
```
Each step from 500 upward is ≥ 1.3× the luminance of the previous step, so labels at different tiers are visually distinguishable side-by-side.

### `brass-*` — Accent (warm gold, all interactive elements)
```
brass (DEFAULT): #d4a13a   ← primary accent, active nav, focus rings
brass-light:     #ecbf5a   ← hover state on brass elements, numeric highlights
brass-muted:     #8c6420   ← very subtle brass tint
brass-dark:      #7a5418   ← pressed/dark state
```

### Semantic colors
```
Success/Active:  emerald-400 (#34d399) on emerald-950/50 bg, emerald-800/40 border
Danger/Delete:   #f87171 text, #7f1d1d bg (dark red)
```

---

## Typography

### Font Stack
- **Display / Headings:** `Bebas Neue` — all caps, wide tracking, used for page titles and the app logo
- **Body / UI text:** `Barlow` — clean sans-serif for labels, descriptions, form elements, buttons
- **Technical / Numeric:** `JetBrains Mono` — monospace for numbers, IDs, codes, nav section labels, metadata

### Import (Google Fonts)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Usage Patterns
| Element | Class pattern |
|---|---|
| Page title (H1) | `font-display text-5xl tracking-widest text-gun-100 leading-none` |
| Section title | `font-display text-3xl tracking-widest text-gun-100` |
| Card title | `font-body font-semibold text-gun-100` |
| Body text | `font-body text-sm text-gun-400` |
| Metadata label | `text-[10px] font-mono tracking-[0.2em] text-gun-500 uppercase` |
| Numeric value | `font-mono text-3xl font-semibold text-gun-100` or `text-brass-light` |
| Section divider label | `text-[9px] font-mono text-gun-600 tracking-[0.2em] uppercase` |
| Loading state | `font-mono text-xs tracking-[0.25em] text-gun-500 uppercase` |

---

## Tailwind Config

```js
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gun: {
          950: "#090b0e",
          900: "#0f1318",
          800: "#161c25",
          750: "#1c2330",
          700: "#242e3d",
          600: "#2e3c4f",
          500: "#3d5069",
          400: "#5d728f",
          300: "#7a90a8",
          200: "#9fb2c4",
          100: "#d0dce8",
          50:  "#edf3f8",
        },
        brass: {
          DEFAULT: "#c8922a",
          light: "#dba93c",
          muted: "#8c6420",
          dark: "#7a5418",
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', "sans-serif"],
        body: ["Barlow", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
```

---

## Global CSS Patterns (`index.css`)

```css
@layer base {
  html { font-family: "Barlow", system-ui, sans-serif; }
  body { background-color: #0f1318; color: #d0dce8; }
}

/* Form elements — always deep background */
input[type="text"], input[type="number"], input[type="email"],
input[type="password"], input[type="search"], input:not([type]), textarea {
  background-color: #090b0e !important;
  border-color: #242e3d !important;
  color: #d0dce8 !important;
}
input::placeholder, textarea::placeholder { color: #5d728f !important; }

select {
  background-color: #090b0e !important;
  border-color: #242e3d !important;
  color: #d0dce8 !important;
}
select option, select optgroup {
  background-color: #0f1318 !important;
  color: #d0dce8 !important;
}

/* Focus: brass ring */
input:focus, textarea:focus, select:focus {
  outline: none !important;
  border-color: #c8922a !important;
  box-shadow: 0 0 0 2px rgba(200, 146, 42, 0.2) !important;
}
```

---

## Layout

### Overall structure
- Sidebar navigation (fixed left, `w-56`) + main content area
- Sidebar: `bg-gun-950`, bordered right with `border-gun-700`
- Main content: `bg-gun-900`, `max-w-6xl mx-auto`, padding `p-4 md:p-8`
- Mobile: sidebar collapses to a top bar with hamburger toggle

### Page structure pattern
```jsx
<div className="space-y-8">
  {/* Header */}
  <div>
    <h1 className="font-display text-5xl tracking-widest text-gun-100 leading-none">PAGE TITLE</h1>
    <div className="mt-2 h-px bg-gun-700" />  {/* hairline divider */}
    <p className="mt-1 text-[10px] font-mono text-gun-600 tracking-[0.25em] uppercase">Subtitle / description</p>
  </div>
  {/* Content */}
</div>
```

---

## Component Recipes

### Card (generic)
```jsx
<div className="bg-gun-800 border border-gun-700 rounded p-4 hover:bg-gun-750 hover:shadow-lg hover:shadow-black/30 transition-all">
```

### Card with brass left-border accent (highlighted/active item)
```jsx
<div className="bg-gun-800 border border-gun-700 border-l-2 border-l-brass rounded p-4">
```

### Primary Button (brass filled)
```jsx
<button className="inline-flex items-center gap-2 bg-brass text-gun-950 px-4 py-2 rounded text-sm font-body font-semibold hover:bg-brass-light transition-colors">
```

### Ghost/Outline Button
```jsx
<button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-body text-gun-400 hover:text-brass border border-gun-600 rounded transition-colors">
```

### Danger Button
```jsx
<button className="bg-red-900 hover:bg-red-800 text-red-300 px-4 py-2 rounded text-sm font-body font-medium transition-colors">
```

### Search Input
```jsx
<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gun-500" size={15} />
  <input
    type="text"
    className="w-full bg-gun-950 border border-gun-700 rounded text-sm text-gun-100 pl-9 pr-4 py-2 placeholder-gun-500 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass/20 transition-colors font-body"
    placeholder="Search..."
  />
</div>
```

### Select / Dropdown
```jsx
<select className="bg-gun-800 border border-gun-600 rounded px-3 py-2 text-sm font-body text-gun-300 focus:outline-none focus:border-brass">
```

### Status Badge (active / inactive)
```jsx
// Active
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-[0.15em] uppercase bg-emerald-950/50 text-emerald-400 border border-emerald-800/40">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
  Active
</span>

// Inactive/Retired
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-[0.15em] uppercase bg-gun-800 text-gun-400 border border-gun-700">
  <span className="w-1.5 h-1.5 rounded-full bg-gun-500" />
  Retired
</span>
```

### Section Divider with Label
```jsx
<div className="flex items-center gap-2 px-3 py-1">
  <div className="flex-1 h-px bg-gun-700" />
  <span className="text-[9px] font-mono text-gun-600 tracking-[0.2em] uppercase shrink-0">SECTION</span>
  <div className="flex-1 h-px bg-gun-700" />
</div>
```

### Stat Card
```jsx
<div className="bg-gun-800 border border-gun-700 rounded p-4 hover:bg-gun-750 transition-all">
  <div className="flex items-center gap-2 mb-2 text-gun-500">
    <Icon size={14} />
    <span className="text-[10px] font-mono tracking-[0.15em] uppercase">Label</span>
  </div>
  <div className="text-3xl font-mono font-semibold leading-none text-gun-100">42</div>
</div>
// Accent variant: swap text-gun-500 → text-brass, text-gun-100 → text-brass-light, add border-brass/25
```

### Empty State
```jsx
<div className="text-center py-12 border border-dashed border-gun-700 rounded">
  <p className="text-gun-500 text-xs font-mono mb-3">No items yet.</p>
  <a className="text-[10px] font-mono text-brass hover:text-brass-light tracking-[0.2em] uppercase transition-colors">
    Create One →
  </a>
</div>
```

### Loading State
```jsx
<div className="flex items-center justify-center py-24">
  <span className="font-mono text-xs tracking-[0.25em] text-gun-500 uppercase">Loading...</span>
</div>
```

---

## Sidebar / Navigation

### Structure
- `bg-gun-950` background, `border-r border-gun-700`
- Logo: `font-display text-[2rem] tracking-widest text-brass` — stacked on two lines
- Nav links: `font-body font-medium text-sm`
- Active link: `text-brass bg-gun-800 border-l-2 border-brass`
- Inactive link: `text-gun-400 hover:text-gun-100 hover:bg-gun-800 border-l-2 border-transparent`
- Icons: 15px, colored `text-brass` when active
- Bottom tag: `text-[10px] font-mono text-gun-600 tracking-[0.2em] uppercase`

---

## Design Principles

1. **One accent color** — `brass` is used exclusively for interactive/highlighted elements. Everything else is in the `gun-*` gray scale.
2. **Monospace for data** — IDs, numbers, metadata, and labels always use `font-mono`. Only prose/UI text uses `font-body`.
3. **Display type for titles** — `font-display` (Bebas Neue) only for page-level headings. Always uppercase, always widely tracked.
4. **Flat, sharp corners** — `rounded` (4px) is the standard radius. No heavy shadows. Hover shadows use `shadow-black/30` at most.
5. **Hairline dividers** — `h-px bg-gun-700` for section separation, never thick rules.
6. **Brass on dark, never on light** — The brass accent always sits on `gun-800` or darker backgrounds so it glows.
7. **Opacity for disabled/retired** — Inactive items use `opacity-60 hover:opacity-80`, not separate disabled styles.
8. **Left-border accent** — Cards for the "current" or "active" entity get `border-l-2 border-l-brass` to distinguish them from ordinary cards.

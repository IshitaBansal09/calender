# Wall Calendar — Interactive React/Next.js Component

An interactive wall calendar built with Next.js, TypeScript, and Tailwind CSS v4.

**Source Code:** [github.com/IshitaBansal09/calender](https://github.com/IshitaBansal09/calender)

---

## Features

### Core Requirements
- **Wall Calendar Aesthetic** — Physical wall calendar look with metallic punch-hole rings at top, hero photography per month, and a clean date grid
- **Day Range Selector** — Click once to set start date, click again to set end date. Hover preview shows the range before confirming. Clear visual states for start, end, in-between, and single-day selections
- **Integrated Notes** — Notes attach to your selected date/range or float as general monthly memos. Color-coded sticky notes with inline editing, persisted to `localStorage`
- **Fully Responsive** — Desktop: side-by-side calendar + notes panel. Mobile: stacked vertically with touch-friendly tap targets

### Bonus / Creative Features
- **Month Themes** — Each month has its own color scheme (primary + accent) that tints the entire UI — navigation, highlights, badges, and notes all adapt
- **Season Badge** — Season label overlaid on the hero image (Winter, Spring, Summer, Fall)
- **Holiday Markers** — 16 US holidays shown with emoji indicators on their calendar dates
- **Slide Animation** — Month transitions animate left/right (forward/backward) using CSS keyframes
- **Dark Mode** — Toggle between warm paper and dark slate themes via the moon/sun button
- **Today Indicator** — Current date has a ring outline + dot marker
- **Note Colors** — Six color swatches for note cards (amber, blue, green, pink, purple, orange)
- **Keyboard Shortcut** — `Ctrl+Enter` saves a note; `Escape` exits edit mode

---

## Design Choices

### Framework — Next.js (App Router)
Chosen for its zero-config TypeScript support, built-in font optimization via `next/font/google`, and fast local dev with Turbopack. The calendar is entirely client-side (`"use client"`) with no backend needed, so Next.js adds minimal overhead while keeping the door open for SSR/SSG if needed later.

### Styling — Tailwind CSS v4
Tailwind v4's new CSS-first configuration and native CSS variable support made it easy to layer dynamic month theme colors (from JS state) on top of utility classes without fighting the framework. No custom config file needed.

### Typography — Playfair Display + Inter
`Playfair Display` (serif) is used for month names and headings — it gives the editorial, print-calendar feel. `Inter` (sans-serif) handles all UI text, numbers, and notes for maximum readability. Both are loaded via `next/font/google` for zero layout shift.

### State Management — Custom Hook (`useCalendarState`)
All calendar state lives in a single `useCalendarState` hook rather than a global store (no Redux/Zustand). The scope is small and self-contained, so a hook keeps logic co-located and testable without the boilerplate of a state library.

### Persistence — `localStorage`
No backend is required. Notes are serialized to JSON and saved to `localStorage` on every change. This keeps the project fully static and instantly deployable anywhere (Vercel, GitHub Pages, etc.).

### Images — picsum.photos
Seeded `picsum.photos` URLs give consistent, beautiful placeholder photography per month without requiring an API key or managing assets.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16 | React framework, App Router |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Utility-first styling |
| Lucide React | latest | Icons |
| Playfair Display + Inter | — | Google Fonts (via next/font) |
| picsum.photos | — | Month hero images |
| localStorage | — | Client-side note persistence |

---

## Project Structure

```
app/
  components/
    WallCalendar.tsx    # Root container, layout, toolbar, dark mode
    CalendarGrid.tsx    # 7×6 date grid with range selection logic
    HeroImage.tsx       # Month photo + gradient overlay + season badge
    NotesPanel.tsx      # Notes input, list, inline edit, delete
  hooks/
    useCalendarState.ts # All calendar state & interaction logic
  types/
    calendar.ts         # Shared TypeScript interfaces
  utils/
    calendar.ts         # Date helpers, month themes, holidays, image URLs
  globals.css           # Keyframe animations, ring-hole styles, fonts
  layout.tsx            # Root layout with Google Fonts setup
  page.tsx              # Entry point
```

---

## Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/IshitaBansal09/calender.git
cd calender

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Requires Node.js 18+.

---

## Usage

| Action | How |
|---|---|
| Select start date | Click any day |
| Select end date | Click another day (hover to preview range) |
| Clear selection | Click the range badge next to the month name |
| Add a note | Type in the note box → **Add** or `Ctrl+Enter` |
| Pin note to a date/range | Keep the range toggle active (appears when a date is selected) |
| Edit a note | Click the note text |
| Delete a note | Hover the note → click ✕ |
| Navigate months | Click the arrow buttons |
| Toggle dark mode | Click the moon / sun icon |

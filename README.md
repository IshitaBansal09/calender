# Wall Calendar — Interactive React/Next.js Component

A polished, interactive wall calendar component built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### Core Requirements
- **Wall Calendar Aesthetic** — Physical wall calendar look with punch-hole rings at top, hero photography per month, paper texture, and clean grid layout
- **Day Range Selector** — Click once to set start date, click again to set end date. Hover preview shows the range before confirming. Clear visual states for start, end, in-between, and single-day selections
- **Integrated Notes** — Notes attach to your selected date/range or float as general monthly memos. Color-coded sticky notes with inline editing, persisted to `localStorage`
- **Fully Responsive** — Desktop: three-panel layout (image | calendar | notes). Mobile: stacked vertically with touch-friendly tap targets

### Bonus / Creative Features
- **Month Themes** — Each month has its own color scheme (primary + accent) that tints the UI — navigation, highlights, badges all adapt
- **Season Badge** — Season label overlaid on the hero image (Winter, Spring, Summer, Fall)
- **Holiday Markers** — 16 US holidays shown with emoji indicators on their calendar dates
- **Slide Animation** — Month transitions animate left/right (forward/backward) using CSS keyframes
- **Dark Mode** — Toggle between warm paper and dark slate themes via the moon/sun button
- **Today Indicator** — Current date has a ring outline + dot marker
- **Note Colors** — Six color swatches for note cards (amber, blue, green, pink, purple, orange)
- **Keyboard Shortcut** — `Ctrl+Enter` saves a new note; `Escape` exits edit mode

## Tech Stack

- **Next.js 15** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide React** — icons
- **picsum.photos** — royalty-free placeholder photography per month
- **localStorage** — client-side note persistence (no backend)

## Project Structure

```
app/
  components/
    WallCalendar.tsx   # Root calendar container, layout, toolbar
    CalendarGrid.tsx   # 7x6 date grid with range selection logic
    HeroImage.tsx      # Month photo + overlay + season badge
    NotesPanel.tsx     # Notes input, list, edit, delete
  hooks/
    useCalendarState.ts  # All calendar state & interactions
  types/
    calendar.ts          # Shared TypeScript interfaces
  utils/
    calendar.ts          # Date helpers, themes, holidays, image URLs
  globals.css            # Animations, paper texture, scrollbars
  page.tsx               # Entry point
```

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

| Action | How |
|---|---|
| Select start date | Click any day |
| Select end date | Click another day (hover to preview range) |
| Clear selection | Click the range badge next to the month name |
| Add a note | Type in the note box, click **Add** or press `Ctrl+Enter` |
| Pin note to selection | Keep the range toggle active (appears when a date is selected) |
| Edit a note | Click the note text |
| Delete a note | Hover note, click X |
| Navigate months | Click the arrow buttons |
| Dark mode | Click moon/sun icon |

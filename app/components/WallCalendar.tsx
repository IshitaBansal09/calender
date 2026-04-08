"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Sun, Moon } from "lucide-react";
import HeroImage from "./HeroImage";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import { useCalendarState } from "../hooks/useCalendarState";
import { MONTH_NAMES, MONTH_THEMES, formatDateKey } from "../utils/calendar";

export default function WallCalendar() {
  const [isDark, setIsDark] = useState(false);

  const {
    currentMonth,
    currentYear,
    dateRange,
    hoverDate,
    setHoverDate,
    selectionStep,
    notes,
    animDir,
    isFlipping,
    navigateMonth,
    handleDayClick,
    clearSelection,
    addNote,
    updateNote,
    deleteNote,
    getNotesForMonth,
    getRangeKey,
  } = useCalendarState();

  const theme = MONTH_THEMES[currentMonth];

  const rangeLabel = (() => {
    if (!dateRange.start) return null;
    const startStr = dateRange.start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (
      !dateRange.end ||
      formatDateKey(dateRange.start) === formatDateKey(dateRange.end)
    ) {
      return startStr;
    }
    const endStr = dateRange.end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${startStr} – ${endStr}`;
  })();

  const animClass =
    animDir === "left"
      ? "animate-slide-in-right"
      : animDir === "right"
        ? "animate-slide-in-left"
        : "animate-fade-in";

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-3 sm:p-6 transition-colors duration-700 ${
        isDark
          ? "bg-gray-900"
          : "bg-gradient-to-br from-stone-100 via-amber-50 to-orange-50"
      }`}
    >
      {/* Main calendar card */}
      <div
        className={`w-full max-w-4xl rounded-2xl overflow-hidden theme-transition ${
          isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
        }`}
        style={{
          boxShadow: isDark
            ? "0 30px 70px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)"
            : "0 30px 70px rgba(0,0,0,0.14), 0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        {/* ── Binding / Ring-hole strip ── */}
        <div className="calendar-binding flex justify-center items-center gap-6 sm:gap-8 px-6 py-3 z-10 relative">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="ring-hole" />
          ))}
        </div>

        {/* ── Main content ── */}
        <div className="flex flex-col">
          {/* Hero Image */}
          <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80">
            <div className={`h-full transition-all duration-500 ${animClass}`}>
              <HeroImage month={currentMonth} year={currentYear} />
            </div>
          </div>

          {/* Calendar + Notes */}
          <div className="flex flex-col lg:flex-row flex-1">

            {/* ── Calendar section (LEFT on desktop) ── */}
            <div
              className={`flex-1 p-5 sm:p-6 flex flex-col border-b lg:border-b-0 lg:border-r theme-transition ${
                isDark ? "border-gray-700" : "border-black/8"
              }`}
            >
              {/* Navigation header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigateMonth("prev")}
                    disabled={isFlipping}
                    className="p-1.5 rounded-full transition-all duration-150 hover:scale-110 active:scale-95 disabled:opacity-40"
                    style={{ backgroundColor: `${theme.accent}35` }}
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-4 h-4" style={{ color: theme.primary }} />
                  </button>

                  <div className={`text-center transition-all duration-300 ${animClass}`}>
                    <div
                      className="font-playfair text-2xl font-bold tracking-tight leading-none"
                      style={{ color: theme.primary }}
                    >
                      {MONTH_NAMES[currentMonth]}
                    </div>
                    <div
                      className={`text-xs mt-0.5 tracking-widest uppercase font-medium ${
                        isDark ? "text-gray-400" : "text-gray-400"
                      }`}
                    >
                      {currentYear}
                    </div>
                  </div>

                  <button
                    onClick={() => navigateMonth("next")}
                    disabled={isFlipping}
                    className="p-1.5 rounded-full transition-all duration-150 hover:scale-110 active:scale-95 disabled:opacity-40"
                    style={{ backgroundColor: `${theme.accent}35` }}
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-4 h-4" style={{ color: theme.primary }} />
                  </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className={`p-1.5 rounded-full transition-all hover:scale-110 ${
                      isDark ? "bg-yellow-500/20" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    title="Toggle dark mode"
                  >
                    {isDark ? (
                      <Sun className="w-3.5 h-3.5 text-yellow-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>

                  {dateRange.start && (
                    <button
                      onClick={clearSelection}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all hover:scale-105"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                      title="Clear selection"
                    >
                      <X className="w-3 h-3" />
                      {rangeLabel}
                    </button>
                  )}
                </div>
              </div>

              {/* Selection hint */}
              {selectionStep === "selecting" && (
                <div
                  className="text-xs text-center mb-2.5 py-1.5 rounded-lg animate-fade-in font-medium"
                  style={{
                    backgroundColor: `${theme.accent}28`,
                    color: theme.primary,
                  }}
                >
                  Click to set end date
                </div>
              )}
              {selectionStep === "idle" && !dateRange.start && (
                <div
                  className={`text-xs text-center mb-2.5 py-1 tracking-wide ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Click a date to start selecting a range
                </div>
              )}

              {/* Calendar grid */}
              <div className={`flex-1 transition-all duration-300 ${animClass}`}>
                <CalendarGrid
                  month={currentMonth}
                  year={currentYear}
                  dateRange={dateRange}
                  hoverDate={hoverDate}
                  selectionStep={selectionStep}
                  onDayClick={handleDayClick}
                  onDayHover={setHoverDate}
                  isDark={isDark}
                />
              </div>

              {/* Legend */}
              <div
                className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 pt-3 border-t text-xs ${
                  isDark ? "border-gray-700 text-gray-500" : "border-black/8 text-gray-400"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: `${theme.accent}45` }}
                  />
                  <span>Range</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full border-2"
                    style={{ borderColor: theme.primary }}
                  />
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🎉</span>
                  <span>Holiday</span>
                </div>
              </div>
            </div>

            {/* ── Notes section (RIGHT on desktop) ── */}
            <div
              className={`w-full lg:w-72 xl:w-80 p-5 sm:p-6 flex flex-col min-h-[260px] lg:min-h-0 theme-transition ${
                isDark ? "" : ""
              }`}
              style={{
                backgroundColor: isDark
                  ? "rgba(31,41,55,0.85)"
                  : "rgba(252,250,246,0.95)",
              }}
            >
              <NotesPanel
                month={currentMonth}
                year={currentYear}
                dateRange={dateRange}
                notes={getNotesForMonth()}
                onAddNote={addNote}
                onUpdateNote={updateNote}
                onDeleteNote={deleteNote}
                rangeKey={getRangeKey()}
                isDark={isDark}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

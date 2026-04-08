"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Sun, Moon, Info } from "lucide-react";
import HeroImage from "./HeroImage";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import { useCalendarState } from "../hooks/useCalendarState";
import { MONTH_NAMES, MONTH_THEMES, formatDateKey } from "../utils/calendar";

export default function WallCalendar() {
  const [isDark, setIsDark] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
          : "bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100"
      }`}
    >
      {/* Main calendar card */}
      <div
        className={`md:max-w-[650px] w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl theme-transition ${
          isDark ? "bg-gray-800 text-gray-100" : "bg-amber-50 text-gray-800"
        }`}
        style={{
          boxShadow: isDark
            ? "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)"
            : "0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        {/* Ring holes decoration */}
        <div
          className="flex justify-center gap-8 py-2 z-10 relative"
          style={{ backgroundColor: isDark ? "#1f2937" : "#2c2c2c" }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="ring-hole" />
          ))}
        </div>

        {/* Main layout: image + calendar + notes */}
        <div className="flex flex-col md:min-h-[560px]">
          {/* Hero Image Panel */}
          <div className="w-full h-52 md:h-64 lg:h-72">
            <div className={`h-full transition-all duration-500 ${animClass}`}>
              <HeroImage month={currentMonth} year={currentYear} />
            </div>
          </div>

          {/* Calendar + Notes Panel */}
          <div className="flex flex-col lg:flex-row flex-1">
            {/* Notes section */}
            <div
              className={`w-full lg:w-64 xl:w-72 p-4 sm:p-5 flex flex-col min-h-[260px] lg:min-h-0 theme-transition ${
                isDark ? "bg-gray-750" : "bg-white/50"
              }`}
              style={{
                backgroundColor: isDark
                  ? "rgba(31,41,55,0.8)"
                  : "rgba(255,253,245,0.8)",
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
              />
            </div>
            {/* Calendar section */}
            <div
              className={`flex-1 p-4 sm:p-5 flex flex-col border-b lg:border-b-0 lg:border-r theme-transition ${
                isDark ? "border-gray-700" : "border-black/10"
              }`}
            >
              {/* Navigation header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigateMonth("prev")}
                    disabled={isFlipping}
                    className="p-1.5 rounded-full transition-all duration-150 hover:scale-110 active:scale-95 disabled:opacity-40"
                    style={{ backgroundColor: `${theme.accent}40` }}
                    aria-label="Previous month"
                  >
                    <ChevronLeft
                      className="w-4 h-4"
                      style={{ color: theme.primary }}
                    />
                  </button>

                  <div
                    className={`text-center transition-all duration-300 ${animClass}`}
                  >
                    <div
                      className="text-xl font-bold tracking-tight"
                      style={{ color: theme.primary }}
                    >
                      {MONTH_NAMES[currentMonth]}
                    </div>
                    <div
                      className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {currentYear}
                    </div>
                  </div>

                  <button
                    onClick={() => navigateMonth("next")}
                    disabled={isFlipping}
                    className="p-1.5 rounded-full transition-all duration-150 hover:scale-110 active:scale-95 disabled:opacity-40"
                    style={{ backgroundColor: `${theme.accent}40` }}
                    aria-label="Next month"
                  >
                    <ChevronRight
                      className="w-4 h-4"
                      style={{ color: theme.primary }}
                    />
                  </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2">
                  {/* Dark mode toggle */}
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className={`p-1.5 rounded-full transition-all hover:scale-110 ${
                      isDark ? "bg-yellow-500/20" : "bg-gray-200"
                    }`}
                    title="Toggle dark mode"
                  >
                    {isDark ? (
                      <Sun className="w-3.5 h-3.5 text-yellow-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-gray-600" />
                    )}
                  </button>

                  {/* Clear selection */}
                  {dateRange.start && (
                    <button
                      onClick={clearSelection}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-all hover:scale-105"
                      style={{
                        backgroundColor: `${theme.primary}20`,
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
                  className="text-xs text-center mb-2 py-1.5 rounded-lg animate-fade-in"
                  style={{
                    backgroundColor: `${theme.accent}30`,
                    color: theme.primary,
                  }}
                >
                  Click to set end date
                </div>
              )}
              {selectionStep === "idle" && !dateRange.start && (
                <div
                  className={`text-xs text-center mb-2 py-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Click a date to start selecting a range
                </div>
              )}

              {/* Calendar grid */}
              <div
                className={`flex-1 transition-all duration-300 ${animClass}`}
              >
                <CalendarGrid
                  month={currentMonth}
                  year={currentYear}
                  dateRange={dateRange}
                  hoverDate={hoverDate}
                  selectionStep={selectionStep}
                  onDayClick={handleDayClick}
                  onDayHover={setHoverDate}
                />
              </div>

              {/* Legend */}
              <div
                className={`flex items-center gap-4 mt-3 pt-3 border-t text-xs ${
                  isDark
                    ? "border-gray-700 text-gray-400"
                    : "border-black/10 text-gray-500"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3.5 h-3.5 rounded-full shadow-sm"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3.5 h-3.5 rounded"
                    style={{ backgroundColor: `${theme.accent}40` }}
                  />
                  <span>Range</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🎉</span>
                  <span>Holiday</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

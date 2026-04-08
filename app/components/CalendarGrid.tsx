"use client";

import { useMemo } from "react";
import {
  getDaysInMonth, getFirstDayOfMonth, DAY_NAMES,
  getHolidayForDate, isDateInRange, isSameDay, isToday,
  MONTH_THEMES
} from "../utils/calendar";
import { DateRange } from "../types/calendar";

interface CalendarGridProps {
  month: number;
  year: number;
  dateRange: DateRange;
  hoverDate: Date | null;
  selectionStep: "idle" | "selecting";
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date | null) => void;
  isDark?: boolean;
}

export default function CalendarGrid({
  month, year, dateRange, hoverDate, selectionStep, onDayClick, onDayHover, isDark
}: CalendarGridProps) {
  const theme = MONTH_THEMES[month];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const effectiveEnd = selectionStep === "selecting" && hoverDate
    ? hoverDate
    : dateRange.end;

  const cells = useMemo(() => {
    const result = [];

    for (let i = 0; i < firstDay; i++) {
      const d = daysInPrevMonth - firstDay + 1 + i;
      result.push({ day: d, current: false, overflow: "prev" as const });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ day: d, current: true, overflow: null });
    }

    const remaining = 42 - result.length;
    for (let d = 1; d <= remaining; d++) {
      result.push({ day: d, current: false, overflow: "next" as const });
    }

    return result;
  }, [month, year, daysInMonth, firstDay, daysInPrevMonth]);

  return (
    <div className="flex flex-col h-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((name, i) => (
          <div
            key={name}
            className="text-center text-[11px] font-semibold uppercase tracking-widest py-2"
            style={{
              color: i === 0
                ? "#ef4444"
                : i === 6
                  ? theme.primary
                  : isDark ? "#6b7280" : "#9ca3af"
            }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-0.5 flex-1">
        {cells.map((cell, idx) => {
          if (!cell.current) {
            return (
              <div
                key={`overflow-${cell.overflow}-${idx}`}
                className="flex items-center justify-center h-9 text-sm opacity-15"
                style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              >
                {cell.day}
              </div>
            );
          }

          const date = new Date(year, month, cell.day);
          const holiday = getHolidayForDate(month, cell.day);
          const isStart = dateRange.start && isSameDay(date, dateRange.start);
          const isEnd = effectiveEnd && isSameDay(date, effectiveEnd);
          const inRange = isDateInRange(date, dateRange.start, effectiveEnd);
          const todayMark = isToday(date);
          const colIdx = idx % 7;
          const isWeekend = colIdx === 0 || colIdx === 6;
          const isRangeStart = isStart && !isEnd;
          const isRangeEnd = isEnd && !isStart;
          const isSingleDay = isStart && isEnd;
          const isSelected = isStart || isEnd || isSingleDay;

          // Text color for non-selected days
          const textColor = isSelected
            ? "white"
            : isWeekend
              ? colIdx === 0 ? "#ef4444" : theme.primary
              : isDark ? "#e5e7eb" : "#374151";

          return (
            <div
              key={`day-${cell.day}`}
              className="relative flex items-center justify-center"
              style={{
                background: inRange ? `${theme.accent}28` : undefined,
              }}
            >
              {/* Range start cap */}
              {isRangeStart && (
                <div
                  className="absolute inset-y-0.5 left-1/2 right-0 rounded-l-full"
                  style={{ backgroundColor: `${theme.accent}28` }}
                />
              )}

              {/* Range end cap */}
              {isRangeEnd && (
                <div
                  className="absolute inset-y-0.5 left-0 right-1/2 rounded-r-full"
                  style={{ backgroundColor: `${theme.accent}28` }}
                />
              )}

              <button
                onClick={() => onDayClick(date)}
                onMouseEnter={() => selectionStep === "selecting" && onDayHover(date)}
                onMouseLeave={() => selectionStep === "selecting" && onDayHover(null)}
                className={`
                  calendar-day relative z-10 flex flex-col items-center justify-center
                  w-9 h-9 rounded-full text-sm font-medium transition-all duration-150
                  ${isSelected
                    ? "shadow-md"
                    : todayMark
                      ? "ring-2 font-bold"
                      : isDark
                        ? "hover:bg-white/10"
                        : "hover:bg-black/8"
                  }
                `}
                style={{
                  backgroundColor: isSelected ? theme.primary : undefined,
                  color: textColor,
                }}
                title={holiday ? holiday.name : undefined}
              >
                <span className="leading-none tabular-nums">{cell.day}</span>
                {holiday && (
                  <span className="text-[8px] leading-none mt-0.5" title={holiday.name}>
                    {holiday.emoji}
                  </span>
                )}
              </button>

              {/* Today dot */}
              {todayMark && !isSelected && (
                <div
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
}

export default function CalendarGrid({
  month, year, dateRange, hoverDate, selectionStep, onDayClick, onDayHover
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

    // Previous month overflow days
    for (let i = 0; i < firstDay; i++) {
      const d = daysInPrevMonth - firstDay + 1 + i;
      result.push({ day: d, current: false, overflow: "prev" as const });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ day: d, current: true, overflow: null });
    }

    // Next month overflow days
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
            className="text-center text-xs font-bold uppercase tracking-wider py-2"
            style={{
              color: i === 0 ? "#dc2626" : i === 6 ? theme.primary : "#6b7280"
            }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1 flex-1">
        {cells.map((cell, idx) => {
          if (!cell.current) {
            return (
              <div
                key={`overflow-${cell.overflow}-${idx}`}
                className="flex items-center justify-center h-9 text-sm opacity-20"
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
          const isWeekend = idx % 7 === 0 || idx % 7 === 6;
          const isRangeStart = isStart && !isEnd;
          const isRangeEnd = isEnd && !isStart;
          const isSingleDay = isStart && isEnd;

          return (
            <div
              key={`day-${cell.day}`}
              className="relative flex items-center justify-center"
              style={{
                background: inRange ? `${theme.accent}30` : undefined,
              }}
            >
              {/* Range connection line */}
              {inRange && (
                <div
                  className="absolute inset-y-1 left-0 right-0"
                  style={{ backgroundColor: `${theme.accent}25` }}
                />
              )}

              {/* Start cap */}
              {isRangeStart && (
                <div
                  className="absolute inset-y-1 left-1/2 right-0 rounded-l-full"
                  style={{ backgroundColor: `${theme.accent}30` }}
                />
              )}

              {/* End cap */}
              {isRangeEnd && (
                <div
                  className="absolute inset-y-1 left-0 right-1/2 rounded-r-full"
                  style={{ backgroundColor: `${theme.accent}30` }}
                />
              )}

              <button
                onClick={() => onDayClick(date)}
                onMouseEnter={() => selectionStep === "selecting" && onDayHover(date)}
                onMouseLeave={() => selectionStep === "selecting" && onDayHover(null)}
                className={`
                  calendar-day relative z-10 flex flex-col items-center justify-center
                  w-9 h-9 rounded-full text-sm font-medium transition-all duration-150
                  ${isStart || isEnd || isSingleDay
                    ? "text-white shadow-md scale-105"
                    : todayMark
                      ? "ring-2 font-bold"
                      : "hover:bg-black/10"
                  }
                  ${isWeekend && !isStart && !isEnd ? "text-red-500" : ""}
                `}
                style={{
                  backgroundColor: (isStart || isEnd || isSingleDay)
                    ? theme.primary
                    : undefined,
                  /* ring color set via Tailwind className above */
                  color: (isStart || isEnd || isSingleDay)
                    ? "white"
                    : isWeekend
                      ? idx % 7 === 0 ? "#dc2626" : theme.primary
                      : undefined,
                }}
                title={holiday ? holiday.name : undefined}
              >
                <span className="leading-none">{cell.day}</span>
                {holiday && (
                  <span className="text-[8px] leading-none mt-0.5" title={holiday.name}>
                    {holiday.emoji}
                  </span>
                )}
              </button>

              {/* Today dot */}
              {todayMark && !isStart && !isEnd && (
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

"use client";

import { useState, useEffect, useCallback } from "react";
import { Note, DateRange } from "../types/calendar";
import { formatDateKey } from "../utils/calendar";

export function useCalendarState() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selectionStep, setSelectionStep] = useState<"idle" | "selecting">("idle");
  const [notes, setNotes] = useState<Note[]>([]);
  const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  // Load notes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wall-calendar-notes");
      if (stored) setNotes(JSON.parse(stored));
    } catch {}
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("wall-calendar-notes", JSON.stringify(notes));
    } catch {}
  }, [notes]);

  const navigateMonth = useCallback((dir: "prev" | "next") => {
    if (isFlipping) return;
    setIsFlipping(true);
    setAnimDir(dir === "next" ? "left" : "right");

    setTimeout(() => {
      setCurrentMonth(prev => {
        if (dir === "next") {
          if (prev === 11) { setCurrentYear(y => y + 1); return 0; }
          return prev + 1;
        } else {
          if (prev === 0) { setCurrentYear(y => y - 1); return 11; }
          return prev - 1;
        }
      });
      setAnimDir(null);
      setTimeout(() => setIsFlipping(false), 350);
    }, 300);
  }, [isFlipping]);

  const handleDayClick = useCallback((date: Date) => {
    if (selectionStep === "idle") {
      setDateRange({ start: date, end: null });
      setSelectionStep("selecting");
    } else {
      const start = dateRange.start!;
      if (date < start) {
        setDateRange({ start: date, end: start });
      } else {
        setDateRange({ start, end: date });
      }
      setSelectionStep("idle");
      setHoverDate(null);
    }
  }, [selectionStep, dateRange.start]);

  const clearSelection = useCallback(() => {
    setDateRange({ start: null, end: null });
    setSelectionStep("idle");
    setHoverDate(null);
  }, []);

  const addNote = useCallback((text: string, dateKey?: string, color = "#fef3c7") => {
    const note: Note = {
      id: Date.now().toString(),
      text,
      dateKey,
      createdAt: Date.now(),
      color,
    };
    setNotes(prev => [...prev, note]);
  }, []);

  const updateNote = useCallback((id: string, text: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, text } : n));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const getNotesForMonth = useCallback(() => {
    const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
    return notes.filter(n => !n.dateKey || n.dateKey.startsWith(monthKey));
  }, [notes, currentMonth, currentYear]);

  const getNotesForRange = useCallback(() => {
    if (!dateRange.start) return [];
    if (!dateRange.end) {
      const key = formatDateKey(dateRange.start);
      return notes.filter(n => n.dateKey === key);
    }
    const start = dateRange.start.getTime();
    const end = dateRange.end.getTime();
    return notes.filter(n => {
      if (!n.dateKey) return false;
      const [y, m, d] = n.dateKey.split("-").map(Number);
      const t = new Date(y, m - 1, d).getTime();
      return t >= start && t <= end;
    });
  }, [notes, dateRange]);

  const getRangeKey = useCallback(() => {
    if (!dateRange.start) return undefined;
    if (!dateRange.end) return formatDateKey(dateRange.start);
    return `${formatDateKey(dateRange.start)}_${formatDateKey(dateRange.end)}`;
  }, [dateRange]);

  return {
    currentMonth, currentYear,
    dateRange, hoverDate, setHoverDate, selectionStep,
    notes, animDir, isFlipping,
    navigateMonth,
    handleDayClick, clearSelection,
    addNote, updateNote, deleteNote,
    getNotesForMonth, getNotesForRange, getRangeKey,
  };
}

"use client";

import { useState, useRef, type ReactNode } from "react";
import { Plus, StickyNote, CalendarDays, X } from "lucide-react";
import { Note, DateRange, MonthTheme } from "../types/calendar";
import { formatDateKey, MONTH_NAMES, MONTH_THEMES } from "../utils/calendar";

const NOTE_COLORS = [
  "#fef3c7", // amber
  "#dbeafe", // blue
  "#dcfce7", // green
  "#fce7f3", // pink
  "#ede9fe", // purple
  "#ffedd5", // orange
];

interface NotesPanelProps {
  month: number;
  year: number;
  dateRange: DateRange;
  notes: Note[];
  onAddNote: (text: string, dateKey?: string, color?: string) => void;
  onUpdateNote: (id: string, text: string) => void;
  onDeleteNote: (id: string) => void;
  rangeKey?: string;
  isDark?: boolean;
}

export default function NotesPanel({
  month, year, dateRange, notes, onAddNote, onUpdateNote, onDeleteNote, rangeKey, isDark
}: NotesPanelProps) {
  const theme = MONTH_THEMES[month];
  const [newNoteText, setNewNoteText] = useState("");
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
  const [attachToRange, setAttachToRange] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasRange = !!(dateRange.start);
  const rangeLabel = (() => {
    if (!dateRange.start) return null;
    const startStr = dateRange.start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!dateRange.end || formatDateKey(dateRange.start) === formatDateKey(dateRange.end)) {
      return startStr;
    }
    const endStr = dateRange.end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${startStr} – ${endStr}`;
  })();

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthNotes = notes.filter(n => !n.dateKey || n.dateKey.startsWith(monthKey));

  const rangeNotes = (() => {
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
  })();

  const generalNotes = monthNotes.filter(n => !n.dateKey);

  const handleAdd = () => {
    const text = newNoteText.trim();
    if (!text) return;
    const dateKey = hasRange && attachToRange ? rangeKey : undefined;
    onAddNote(text, dateKey, selectedColor);
    setNewNoteText("");
    textareaRef.current?.focus();
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdateNote(editingId, editText);
      setEditingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className={`flex items-center gap-2 mb-3 pb-3 border-b ${isDark ? "border-white/10" : "border-black/8"}`}>
        <StickyNote className="w-4 h-4 shrink-0" style={{ color: theme.primary }} />
        <h3
          className="font-playfair font-bold text-base tracking-tight"
          style={{ color: theme.primary }}
        >
          Notes
          <span className={`ml-1.5 font-inter text-xs font-normal tracking-wide ${isDark ? "text-gray-400" : "text-gray-400"}`}>
            — {MONTH_NAMES[month]}
          </span>
        </h3>
      </div>

      {/* Note input area */}
      <div
        className="rounded-xl p-3 mb-3 border transition-all duration-200 shadow-sm"
        style={{
          backgroundColor: selectedColor,
          borderColor: `${theme.primary}25`,
        }}
      >
        {hasRange && (
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setAttachToRange(!attachToRange)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all duration-200 font-medium ${
                attachToRange
                  ? "text-white shadow-sm"
                  : isDark
                    ? "bg-white/10 text-gray-300"
                    : "bg-black/10 text-gray-600"
              }`}
              style={attachToRange ? { backgroundColor: theme.primary } : {}}
            >
              <CalendarDays className="w-3 h-3 shrink-0" />
              {attachToRange ? `📌 ${rangeLabel}` : "General"}
            </button>
            {attachToRange && (
              <span className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Pinned to selection
              </span>
            )}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={newNoteText}
          onChange={e => setNewNoteText(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAdd();
          }}
          placeholder="Add a note… (Ctrl+Enter to save)"
          className="notes-textarea w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 min-h-[68px]"
          rows={3}
        />

        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-1.5">
            {NOTE_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
                  selectedColor === color
                    ? "scale-110 border-gray-500"
                    : isDark
                      ? "border-white/20"
                      : "border-black/10"
                }`}
                style={{
                  backgroundColor: color,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
                }}
              />
            ))}
          </div>

          <button
            onClick={handleAdd}
            disabled={!newNoteText.trim()}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full text-white font-semibold transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed hover:shadow-md active:scale-95"
            style={{ backgroundColor: theme.primary }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {hasRange && rangeNotes.length > 0 && (
          <div>
            <SectionLabel
              icon={<CalendarDays className="w-3 h-3" style={{ color: theme.primary }} />}
              label={rangeLabel ?? ""}
              primaryColor={theme.primary}
              isDark={isDark}
            />
            {rangeNotes.map(note => (
              <NoteCard key={note.id} note={note} editingId={editingId} editText={editText}
                onEdit={startEdit} onSave={saveEdit} onDelete={onDeleteNote} onEditTextChange={setEditText} theme={theme} isDark={isDark} />
            ))}
          </div>
        )}

        {generalNotes.length > 0 && (
          <div>
            <SectionLabel icon={<StickyNote className="w-3 h-3 opacity-50" />} label="General" muted isDark={isDark} />
            {generalNotes.map(note => (
              <NoteCard key={note.id} note={note} editingId={editingId} editText={editText}
                onEdit={startEdit} onSave={saveEdit} onDelete={onDeleteNote} onEditTextChange={setEditText} theme={theme} isDark={isDark} />
            ))}
          </div>
        )}

        {monthNotes.filter(n => n.dateKey && !rangeNotes.includes(n)).length > 0 && (
          <div>
            <SectionLabel label="Other dates" muted isDark={isDark} />
            {monthNotes.filter(n => n.dateKey && !rangeNotes.includes(n)).map(note => (
              <NoteCard key={note.id} note={note} editingId={editingId} editText={editText}
                onEdit={startEdit} onSave={saveEdit} onDelete={onDeleteNote} onEditTextChange={setEditText} theme={theme} isDark={isDark} />
            ))}
          </div>
        )}

        {monthNotes.length === 0 && (
          <div className={`flex flex-col items-center justify-center py-10 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            <StickyNote className="w-9 h-9 mb-2.5 opacity-25" style={{ color: theme.primary }} />
            <p className="text-sm font-medium">No notes yet</p>
            <p className="text-xs mt-1 opacity-60">Add a note above</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({
  icon, label, muted, primaryColor, isDark
}: {
  icon?: ReactNode;
  label: string;
  muted?: boolean;
  primaryColor?: string;
  isDark?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5 mt-0.5">
      {icon}
      <span
        className="text-[11px] font-semibold uppercase tracking-wider"
        style={{
          color: muted
            ? isDark ? "#6b7280" : "#9ca3af"
            : primaryColor ?? (isDark ? "#9ca3af" : "#6b7280"),
        }}
      >
        {label}
      </span>
    </div>
  );
}

function NoteCard({
  note, editingId, editText, onEdit, onSave, onDelete, onEditTextChange, theme, isDark
}: {
  note: Note;
  editingId: string | null;
  editText: string;
  onEdit: (note: Note) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
  onEditTextChange: (text: string) => void;
  theme: MonthTheme;
  isDark?: boolean;
}) {
  const isEditing = editingId === note.id;

  // Note cards always have light pastel backgrounds — text is always dark
  // but in dark mode we use a slightly more opaque border so the card reads against the panel
  return (
    <div
      className="animate-fade-in group relative rounded-xl p-3 mb-1.5 shadow-sm transition-all duration-150 hover:shadow-md"
      style={{
        backgroundColor: note.color,
        border: `1px solid ${isDark ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.06)"}`,
        // subtle inner highlight so card "pops" from the dark panel
        boxShadow: isDark
          ? "0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)"
          : "0 1px 3px rgba(0,0,0,0.07)",
      }}
    >
      {isEditing ? (
        <div>
          <textarea
            autoFocus
            value={editText}
            onChange={e => onEditTextChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onSave();
              if (e.key === "Escape") onSave();
            }}
            className="notes-textarea w-full bg-transparent text-sm text-gray-700 min-h-[56px]"
            rows={2}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={onSave}
              className="text-xs px-2.5 py-1 rounded-lg text-white font-semibold"
              style={{ backgroundColor: theme.primary }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div
          className="text-sm text-gray-700 cursor-text whitespace-pre-wrap break-words leading-relaxed"
          onClick={() => onEdit(note)}
        >
          {note.text}
        </div>
      )}

      {note.dateKey && (
        <div className="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
          <CalendarDays className="w-2.5 h-2.5 shrink-0" />
          {new Date(note.dateKey + "T12:00:00").toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
          })}
        </div>
      )}

      <button
        onClick={() => onDelete(note.id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-black/10"
        title="Delete note"
      >
        <X className="w-3 h-3 text-gray-500" />
      </button>
    </div>
  );
}

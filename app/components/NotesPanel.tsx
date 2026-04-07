"use client";

import { useState, useRef } from "react";
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
}

export default function NotesPanel({
  month, year, dateRange, notes, onAddNote, onUpdateNote, onDeleteNote, rangeKey
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

  // Filter notes for current view
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthNotes = notes.filter(n => !n.dateKey || n.dateKey.startsWith(monthKey));

  // Range-specific notes
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
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-black/10">
        <StickyNote className="w-4 h-4" style={{ color: theme.primary }} />
        <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: theme.primary }}>
          Notes — {MONTH_NAMES[month]}
        </h3>
      </div>

      {/* Note input area */}
      <div
        className="rounded-lg p-3 mb-3 border transition-all duration-200"
        style={{
          backgroundColor: selectedColor,
          borderColor: `${theme.primary}30`,
        }}
      >
        {/* Range attachment toggle */}
        {hasRange && (
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setAttachToRange(!attachToRange)}
              className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full transition-all duration-200 ${
                attachToRange ? "text-white shadow-sm" : "bg-black/10 text-gray-600"
              }`}
              style={attachToRange ? { backgroundColor: theme.primary } : {}}
            >
              <CalendarDays className="w-3 h-3" />
              {attachToRange ? `📌 ${rangeLabel}` : "General"}
            </button>
            {attachToRange && (
              <span className="text-xs text-gray-500">Note pinned to selection</span>
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
          placeholder="Add a note... (Ctrl+Enter to save)"
          className="notes-textarea w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 min-h-[72px] font-sans"
          rows={3}
        />

        <div className="flex items-center justify-between mt-2">
          {/* Color picker */}
          <div className="flex gap-1.5">
            {NOTE_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
                  selectedColor === color ? "scale-110 border-gray-600" : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <button
            onClick={handleAdd}
            disabled={!newNoteText.trim()}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full text-white font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md active:scale-95"
            style={{ backgroundColor: theme.primary }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {/* Range notes */}
        {hasRange && rangeNotes.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <CalendarDays className="w-3 h-3" style={{ color: theme.primary }} />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {rangeLabel}
              </span>
            </div>
            {rangeNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                editingId={editingId}
                editText={editText}
                onEdit={startEdit}
                onSave={saveEdit}
                onDelete={onDeleteNote}
                onEditTextChange={setEditText}
                theme={theme}
              />
            ))}
          </div>
        )}

        {/* General month notes */}
        {generalNotes.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <StickyNote className="w-3 h-3 text-gray-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                General
              </span>
            </div>
            {generalNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                editingId={editingId}
                editText={editText}
                onEdit={startEdit}
                onSave={saveEdit}
                onDelete={onDeleteNote}
                onEditTextChange={setEditText}
                theme={theme}
              />
            ))}
          </div>
        )}

        {/* Date-specific notes not in range */}
        {monthNotes.filter(n => n.dateKey && !rangeNotes.includes(n)).length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Other dates
              </span>
            </div>
            {monthNotes.filter(n => n.dateKey && !rangeNotes.includes(n)).map(note => (
              <NoteCard
                key={note.id}
                note={note}
                editingId={editingId}
                editText={editText}
                onEdit={startEdit}
                onSave={saveEdit}
                onDelete={onDeleteNote}
                onEditTextChange={setEditText}
                theme={theme}
              />
            ))}
          </div>
        )}

        {monthNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <StickyNote className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">No notes yet</p>
            <p className="text-xs mt-1 opacity-70">Add a note above</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NoteCard({
  note, editingId, editText, onEdit, onSave, onDelete, onEditTextChange, theme
}: {
  note: Note;
  editingId: string | null;
  editText: string;
  onEdit: (note: Note) => void;
  onSave: () => void;
  onDelete: (id: string) => void;
  onEditTextChange: (text: string) => void;
  theme: MonthTheme;
}) {
  const isEditing = editingId === note.id;

  return (
    <div
      className="animate-fade-in group relative rounded-lg p-2.5 mb-1.5 border border-black/5 shadow-sm transition-all duration-150 hover:shadow-md"
      style={{ backgroundColor: note.color }}
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
            className="notes-textarea w-full bg-transparent text-sm text-gray-700 min-h-[60px] font-sans"
            rows={2}
          />
          <div className="flex justify-end mt-1.5">
            <button
              onClick={onSave}
              className="text-xs px-2 py-1 rounded text-white font-medium"
              style={{ backgroundColor: theme.primary }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div
          className="text-sm text-gray-700 cursor-text whitespace-pre-wrap break-words"
          onClick={() => onEdit(note)}
        >
          {note.text}
        </div>
      )}

      {/* Date badge */}
      {note.dateKey && (
        <div className="mt-1.5 text-[10px] text-gray-400 flex items-center gap-1">
          <CalendarDays className="w-2.5 h-2.5" />
          {new Date(note.dateKey + "T12:00:00").toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
          })}
        </div>
      )}

      {/* Delete button */}
      <button
        onClick={() => onDelete(note.id)}
        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-black/10"
        title="Delete note"
      >
        <X className="w-3 h-3 text-gray-500" />
      </button>
    </div>
  );
}

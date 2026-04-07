export interface Note {
  id: string;
  text: string;
  dateKey?: string; // "YYYY-MM-DD" or undefined for general monthly note
  createdAt: number;
  color: string;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Holiday {
  date: string; // "MM-DD"
  name: string;
  emoji: string;
}

export interface MonthTheme {
  primary: string;
  accent: string;
  bg: string;
  text: string;
  imageTopic: string;
  imageQuery: string;
  season: string;
}

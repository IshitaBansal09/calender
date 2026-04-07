import { MonthTheme, Holiday } from "../types/calendar";

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_THEMES: MonthTheme[] = [
  { primary: "#2d6a4f", accent: "#52b788", bg: "#d8f3dc", text: "#1b4332", imageTopic: "winter forest", imageQuery: "winter+snow+forest", season: "Winter" },
  { primary: "#6d4c7d", accent: "#b39ddb", bg: "#ede7f6", text: "#4527a0", imageTopic: "purple flowers", imageQuery: "lavender+purple+flowers", season: "Late Winter" },
  { primary: "#2e7d32", accent: "#81c784", bg: "#f1f8e9", text: "#1b5e20", imageTopic: "spring bloom", imageQuery: "spring+cherry+blossom", season: "Spring" },
  { primary: "#558b2f", accent: "#aed581", bg: "#f9fbe7", text: "#33691e", imageTopic: "spring garden", imageQuery: "spring+garden+tulips", season: "Spring" },
  { primary: "#e65100", accent: "#ffb74d", bg: "#fff3e0", text: "#bf360c", imageTopic: "golden fields", imageQuery: "golden+wheat+field+sunset", season: "Late Spring" },
  { primary: "#1565c0", accent: "#64b5f6", bg: "#e3f2fd", text: "#0d47a1", imageTopic: "summer beach", imageQuery: "summer+beach+ocean", season: "Summer" },
  { primary: "#c62828", accent: "#ef9a9a", bg: "#ffebee", text: "#b71c1c", imageTopic: "summer mountains", imageQuery: "summer+mountain+lake", season: "Summer" },
  { primary: "#6a1b9a", accent: "#ce93d8", bg: "#f3e5f5", text: "#4a148c", imageTopic: "sunset", imageQuery: "purple+sunset+horizon", season: "Late Summer" },
  { primary: "#bf360c", accent: "#ff8a65", bg: "#fbe9e7", text: "#8d1f06", imageTopic: "autumn leaves", imageQuery: "autumn+fall+leaves+forest", season: "Fall" },
  { primary: "#e65100", accent: "#ffa726", bg: "#fff8e1", text: "#bf360c", imageTopic: "harvest", imageQuery: "autumn+harvest+pumpkins", season: "Fall" },
  { primary: "#37474f", accent: "#90a4ae", bg: "#eceff1", text: "#263238", imageTopic: "misty morning", imageQuery: "foggy+misty+forest+autumn", season: "Late Fall" },
  { primary: "#1a237e", accent: "#7986cb", bg: "#e8eaf6", text: "#0d1478", imageTopic: "winter night", imageQuery: "winter+snow+night+stars", season: "Winter" },
];

export const HOLIDAYS: Holiday[] = [
  { date: "01-01", name: "New Year's Day", emoji: "🎆" },
  { date: "01-15", name: "MLK Day", emoji: "✊" },
  { date: "02-14", name: "Valentine's Day", emoji: "❤️" },
  { date: "03-17", name: "St. Patrick's Day", emoji: "🍀" },
  { date: "04-01", name: "April Fools'", emoji: "🎭" },
  { date: "04-22", name: "Earth Day", emoji: "🌍" },
  { date: "05-05", name: "Cinco de Mayo", emoji: "🎉" },
  { date: "06-19", name: "Juneteenth", emoji: "✊" },
  { date: "07-04", name: "Independence Day", emoji: "🎇" },
  { date: "09-01", name: "Labor Day", emoji: "⚒️" },
  { date: "10-31", name: "Halloween", emoji: "🎃" },
  { date: "11-11", name: "Veterans Day", emoji: "🎖️" },
  { date: "11-27", name: "Thanksgiving", emoji: "🦃" },
  { date: "12-24", name: "Christmas Eve", emoji: "🎄" },
  { date: "12-25", name: "Christmas Day", emoji: "🎅" },
  { date: "12-31", name: "New Year's Eve", emoji: "🥂" },
];

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function getHolidayForDate(month: number, day: number): Holiday | undefined {
  const key = `${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return HOLIDAYS.find(h => h.date === key);
}

export function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const d = date.getTime();
  const s = start.getTime();
  const e = end.getTime();
  return d > Math.min(s, e) && d < Math.max(s, e);
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

// Unsplash source URLs for month images
export function getMonthImageUrl(month: number, width = 600): string {
  const themes = [
    "winter,snow,forest",
    "lavender,purple,flowers",
    "cherry,blossom,spring",
    "tulips,spring,garden",
    "golden,wheat,field",
    "beach,ocean,summer",
    "mountain,lake,summer",
    "sunset,purple,sky",
    "autumn,fall,leaves",
    "harvest,pumpkins,autumn",
    "foggy,misty,forest",
    "winter,snow,night",
  ];
  // Use picsum with a seed based on month for consistent images
  const seeds = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
  return `https://picsum.photos/seed/${seeds[month]}/${width}/400`;
}

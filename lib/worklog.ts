import fs from 'fs';
import path from 'path';

export interface TimeEntry {
  hours: number;
  minutes: number;
}

export interface WorkLogData {
  workLog: Record<string, TimeEntry>;
}

export interface DayData {
  date: Date;
  dateKey: string;
  hours: number; // decimal hours
  formattedTime: string; // e.g., "8h 30m"
}

/**
 * Read work log data from JSON file
 */
export function getWorkLogData(filename: string = 'worklog.json'): Record<string, TimeEntry> {
  const filePath = path.join(process.cwd(), 'data', filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data: WorkLogData = JSON.parse(fileContents);
  return data.workLog;
}

/**
 * Convert hours and minutes to decimal hours (e.g., 8h 30m -> 8.5)
 */
export function toDecimalHours(entry: TimeEntry): number {
  return entry.hours + entry.minutes / 60;
}

/**
 * Format time entry as "Xh Ym" string
 */
export function formatTime(entry: TimeEntry): string {
  if (entry.hours === 0 && entry.minutes === 0) {
    return '0h';
  }
  if (entry.minutes === 0) {
    return `${entry.hours}h`;
  }
  return `${entry.hours}h ${entry.minutes}m`;
}

/**
 * Get the last N days of work log data, including today
 */
export function getLastNDays(workLog: Record<string, TimeEntry>, days: number = 7): DayData[] {
  const result: DayData[] = [];
  const today = new Date();

  // Generate last N days (including today)
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const entry = workLog[dateKey] || { hours: 0, minutes: 0 };

    result.push({
      date,
      dateKey,
      hours: toDecimalHours(entry),
      formattedTime: formatTime(entry),
    });
  }

  return result;
}

/**
 * Calculate max hours worked in a single day
 */
export function getMaxHours(workLog: Record<string, TimeEntry>): number {
  const entries = Object.values(workLog);
  if (entries.length === 0) {
    return 0;
  }

  const maxDecimal = Math.max(...entries.map(toDecimalHours));
  return maxDecimal;
}

/**
 * Get max hours entry for display (returns TimeEntry)
 */
export function getMaxHoursEntry(workLog: Record<string, TimeEntry>): TimeEntry {
  const entries = Object.values(workLog);
  if (entries.length === 0) {
    return { hours: 0, minutes: 0 };
  }

  let maxEntry = entries[0];
  let maxDecimal = toDecimalHours(maxEntry);

  for (const entry of entries) {
    const decimal = toDecimalHours(entry);
    if (decimal > maxDecimal) {
      maxDecimal = decimal;
      maxEntry = entry;
    }
  }

  return maxEntry;
}

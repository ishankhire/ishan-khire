import fs from 'fs';
import path from 'path';

const habitsPath = path.join(process.cwd(), 'data/habits.json');

export type HabitStatus = 'complete' | 'incomplete' | 'na';

export interface HabitsData {
  habits: Record<string, HabitStatus>;
}

export function getHabitsData(): Record<string, HabitStatus> {
  const data = fs.readFileSync(habitsPath, 'utf8');
  return JSON.parse(data).habits;
}

export function calculateStreak(habits: Record<string, HabitStatus>): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  const currentDate = new Date(today);

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const status = habits[dateStr];

    if (status !== 'complete') break;

    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

export function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
}

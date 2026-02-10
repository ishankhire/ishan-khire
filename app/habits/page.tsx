import { getHabitsData, calculateStreak, getMonthDays } from '@/lib/habits';

export default function HabitsPage() {
  const habits = getHabitsData();
  const streak = calculateStreak(habits);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const nextMonth = (currentMonth + 1) % 12;
  const nextYear = nextMonth === 0 ? currentYear + 1 : currentYear;

  const currentMonthDays = getMonthDays(currentYear, currentMonth);
  const nextMonthDays = getMonthDays(nextYear, nextMonth);

  const renderMonth = (days: Date[], monthName: string) => (
    <div>
      <h2 className="text-lg font-medium mb-4 text-zinc-900 dark:text-zinc-50">
        {monthName}
      </h2>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = day.toISOString().split('T')[0];
          const status = habits[dateStr] || 'incomplete';
          const dayOfMonth = day.getDate();

          const colorClass = {
            complete: 'bg-green-500',
            incomplete:
              'bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700',
            na: 'bg-zinc-300 dark:bg-zinc-700',
          }[status];

          return (
            <div
              key={dateStr}
              className={`w-6 h-6 rounded ${colorClass} flex items-center justify-center text-xs text-zinc-900 dark:text-zinc-50`}
              title={`${dateStr}: ${status}`}
            >
              {dayOfMonth}
            </div>
          );
        })}
      </div>
    </div>
  );

  const currentMonthName = now.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const nextMonthName = new Date(nextYear, nextMonth).toLocaleString(
    'default',
    {
      month: 'long',
      year: 'numeric',
    }
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8 text-zinc-900 dark:text-zinc-50">
        Habits
      </h1>

      <div className="mb-12">
        <div className="mb-6">
          <p className="text-sm mb-2 text-zinc-600 dark:text-zinc-400">
            Days without youtube, social media, video games, etc. I think that all of these things will make my life worse at the margin, and I want to quit entirely. Starting as of February 9th, 2026, 1:29 am.
          </p>
          <p className="text-sm text-zinc-900 dark:text-zinc-50">
            Current Streak:{' '}
            <span className="font-semibold text-green-500">{streak} days</span>
          </p>
        </div>

        <div className="flex gap-8 flex-wrap">
          {renderMonth(currentMonthDays, currentMonthName)}
          {renderMonth(nextMonthDays, nextMonthName)}
        </div>
      </div>

      <div className="mb-12">
        <div className="mb-6">
          <p className="text-sm mb-2 text-zinc-600 dark:text-zinc-400">
            Placeholder habit description. Replace this with your actual habit tracking goal and start date.
          </p>
          <p className="text-sm text-zinc-900 dark:text-zinc-50">
            Current Streak:{' '}
            <span className="font-semibold text-green-500">0 days</span>
          </p>
        </div>

        <div className="flex gap-8 flex-wrap">
          {renderMonth(currentMonthDays, currentMonthName)}
          {renderMonth(nextMonthDays, nextMonthName)}
        </div>
      </div>
    </div>
  );
}

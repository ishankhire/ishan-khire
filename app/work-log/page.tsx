import {
  getWorkLogData,
  getLastNDays,
  getMaxHoursEntry,
  formatTime,
} from '@/lib/worklog';

export default function WorkLogPage() {
  // Read work log data
  const workLog = getWorkLogData();

  // Get last 7 days of data
  const weekData = getLastNDays(workLog, 7);

  // Calculate max hours for the chart scale
  const maxHoursEntry = getMaxHoursEntry(workLog);
  const maxHoursDecimal = Math.max(
    ...weekData.map((day) => day.hours),
    8 // Minimum scale of 8 hours for better visualization
  );

  // Chart configuration
  const chartHeight = 300; // pixels
  const minBarHeight = 4; // minimum height in pixels for visibility

  // Day name formatter
  const getDayName = (date: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        Work Log
      </h1>

      {/* Max hours stat */}
      <div className="mb-8">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Max Hours Worked:{' '}
          <span className="font-semibold text-green-600 dark:text-green-500">
            {formatTime(maxHoursEntry)}
          </span>
        </p>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8">
        {/* Chart area */}
        <div className="relative" style={{ height: `${chartHeight}px` }}>
          {/* Y-axis grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(6)].map((_, i) => {
              const value = Math.round((maxHoursDecimal * (5 - i)) / 5);
              return (
                <div key={i} className="flex items-center">
                  <span className="text-xs text-zinc-400 dark:text-zinc-600 w-8 text-right mr-2">
                    {value}h
                  </span>
                  <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
                </div>
              );
            })}
          </div>

          {/* Bars container */}
          <div className="absolute inset-0 pl-12 flex items-end justify-around gap-4">
            {weekData.map((day) => {
              const barHeightPercent = maxHoursDecimal > 0
                ? (day.hours / maxHoursDecimal) * 100
                : 0;
              const barHeightPx = Math.max(
                (chartHeight * barHeightPercent) / 100,
                day.hours > 0 ? minBarHeight : 0
              );

              return (
                <div
                  key={day.dateKey}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  {/* Time label above bar */}
                  <div className="h-6 flex items-end justify-center">
                    {day.hours > 0 && (
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        {day.formattedTime}
                      </span>
                    )}
                  </div>

                  {/* Bar */}
                  <div className="flex-1 flex items-end w-full">
                    <div className="w-full flex justify-center">
                      <div
                        className={`w-full max-w-[60px] rounded-t-md transition-all ${
                          day.hours > 0
                            ? 'bg-green-500 dark:bg-green-600'
                            : 'bg-zinc-200 dark:bg-zinc-800'
                        }`}
                        style={{
                          height: `${barHeightPx}px`,
                        }}
                        title={`${day.dateKey}: ${day.formattedTime}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis labels (days) */}
        <div className="flex items-center mt-4 pl-12">
          <div className="flex-1 flex justify-around gap-4">
            {weekData.map((day) => (
              <div
                key={day.dateKey}
                className="flex-1 text-center text-sm text-zinc-600 dark:text-zinc-400"
              >
                <div className="font-medium">{getDayName(day.date)}</div>
                <div className="text-xs text-zinc-400 dark:text-zinc-600">
                  {day.date.getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Helper text */}
      <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
        Last 7 days of work logged. It's a bit arbitrary how I count time worked.
        E.g., English lecture doesn't count, but English homework or CS lecture does.
        I'm aiming for ~5 hours per day in an average week.
      </p>
    </div>
  );
}

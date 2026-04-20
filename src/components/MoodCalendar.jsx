import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns'

export function MoodCalendar({ entries }) {
  const today = new Date()
  const days = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  })
  const entryDays = new Set(entries.map((entry) => entry.date))

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-lg font-semibold text-slate-700 dark:text-slate-100">
        Calendar View
      </h2>
      <div className="grid grid-cols-7 gap-2 text-center text-xs">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="font-semibold text-slate-500 dark:text-slate-400">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd')
          const hasEntry = entryDays.has(dayKey)
          return (
            <div
              key={dayKey}
              className={`rounded-lg border px-2 py-2 ${
                hasEntry
                  ? 'border-green-200 bg-green-200 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200'
                  : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {format(day, 'd')}
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-green-100" />
          entry exists
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-slate-100" />
          no entry
        </span>
      </div>
    </section>
  )
}

import { moodMetrics } from '../services/moodService'

export function FilterControls({ range, moodType, onRangeChange, onMoodTypeChange }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-lg font-semibold text-slate-700 dark:text-slate-100">Filters</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="range"
            className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            Date Range
          </label>
          <select
            id="range"
            value={range}
            onChange={(event) => onRangeChange(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="moodType"
            className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            Mood Type
          </label>
          <select
            id="moodType"
            value={moodType}
            onChange={(event) => onMoodTypeChange(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="all">All emotions</option>
            {moodMetrics.map((metric) => (
              <option key={metric} value={metric}>
                {metric[0].toUpperCase() + metric.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}

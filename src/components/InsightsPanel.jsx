export function InsightsPanel({ insights }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-lg font-semibold text-slate-700 dark:text-slate-100">Insights</h2>
      {insights.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Add entries to generate insights.
        </p>
      ) : (
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-200">
          {insights.map((insight) => (
            <li key={insight} className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
              {insight}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

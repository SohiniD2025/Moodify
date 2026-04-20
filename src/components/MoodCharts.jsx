import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const colors = ['#818cf8', '#fca5a5', '#93c5fd', '#fcd34d', '#86efac']

export function MoodCharts({ averages, distributions }) {
  const coloredDistributions = distributions.map((entry, index) => ({
    ...entry,
    fill: colors[index % colors.length],
  }))

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 text-lg font-semibold text-slate-700 dark:text-slate-100">
          Average Emotions
        </h2>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={averages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="#818cf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 text-lg font-semibold text-slate-700 dark:text-slate-100">
          Emotion Distribution (%)
        </h2>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={coloredDistributions}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

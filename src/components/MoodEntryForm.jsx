import { useCallback, useMemo, useState } from 'react'
import { moodMetrics } from '../services/moodService'

const labels = {
  happiness: 'Happiness',
  sadness: 'Sadness',
  anxiety: 'Anxiety',
  anger: 'Anger',
  energy: 'Energy',
}

const initialValues = moodMetrics.reduce((acc, key) => ({ ...acc, [key]: 50 }), {})

export function MoodEntryForm({ onSubmit, saving }) {
  const [values, setValues] = useState(initialValues)
  const [journalText, setJournalText] = useState('')

  const averages = useMemo(() => {
    const total = moodMetrics.reduce((acc, metric) => acc + Number(values[metric]), 0)
    return Math.round(total / moodMetrics.length)
  }, [values])

  const handleSliderChange = useCallback((metric, value) => {
    setValues((current) => ({ ...current, [metric]: Number(value) }))
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit({ values, journalText })
    setJournalText('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100">
          Daily Mood Entry
        </h2>
        <p className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
          Overall: {averages}/100
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mood Sliders Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Mood Levels</h3>
          {moodMetrics.map((metric) => (
            <div key={metric}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <label htmlFor={metric} className="font-medium text-slate-600 dark:text-slate-300">
                  {labels[metric]}
                </label>
                <span className="text-slate-500 dark:text-slate-400">{values[metric]}</span>
              </div>
              <input
                id={metric}
                type="range"
                min="0"
                max="100"
                value={values[metric]}
                onChange={(event) => handleSliderChange(metric, event.target.value)}
                className="w-full accent-indigo-400"
              />
            </div>
          ))}
        </div>

        {/* Journal Entry Section */}
        <div className="flex flex-col">
          <label
            htmlFor="journalText"
            className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300"
          >
            Journal Entry (optional)
          </label>
          <textarea
            id="journalText"
            value={journalText}
            onChange={(event) => setJournalText(event.target.value)}
            placeholder="Write anything about how your day felt..."
            className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {saving ? 'Saving...' : 'Save Entry'}
      </button>
    </form>
  )
}

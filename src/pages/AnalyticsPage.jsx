import { format, isWeekend, parseISO, subDays, subMonths, subYears } from 'date-fns'
import { useMemo, useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { FilterControls } from '../components/FilterControls'
import { InsightsPanel } from '../components/InsightsPanel'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { MoodCharts } from '../components/MoodCharts'
import { useAuth } from '../hooks/useAuth'
import { useMoodEntries } from '../hooks/useMoodEntries'
import { moodMetrics } from '../services/moodService'

const getFromDate = (range) => {
  const now = new Date()
  if (range === 'week') return format(subDays(now, 6), 'yyyy-MM-dd')
  if (range === 'month') return format(subMonths(now, 1), 'yyyy-MM-dd')
  return format(subYears(now, 1), 'yyyy-MM-dd')
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [range, setRange] = useState('month')
  const [moodType, setMoodType] = useState('all')

  const filters = useMemo(
    () => ({
      fromDate: getFromDate(range),
      toDate: format(new Date(), 'yyyy-MM-dd'),
    }),
    [range],
  )
  const { entries, loading, error } = useMoodEntries(user?.uid, filters)

  const emotionAverages = useMemo(() => {
    if (entries.length === 0) return []

    const metrics = moodType === 'all' ? moodMetrics : [moodType]
    return metrics.map((metric) => ({
      name: `${metric[0].toUpperCase()}${metric.slice(1)}`,
      value: Math.round(
        entries.reduce((sum, entry) => sum + Number(entry[metric] || 0), 0) / entries.length,
      ),
    }))
  }, [entries, moodType])

  const distributions = useMemo(() => {
    if (emotionAverages.length === 0) return []
    const total = emotionAverages.reduce((sum, row) => sum + row.value, 0) || 1
    return emotionAverages.map((row) => ({
      ...row,
      value: Number(((row.value / total) * 100).toFixed(1)),
    }))
  }, [emotionAverages])

  const insights = useMemo(() => {
    if (entries.length === 0) return []

    const bestMood = emotionAverages.reduce((best, current) =>
      current.value > best.value ? current : best,
    )

    const weekdayEntries = entries.filter((entry) => !isWeekend(parseISO(entry.date)))
    const weekendEntries = entries.filter((entry) => isWeekend(parseISO(entry.date)))
    const weekdayAnxiety =
      weekdayEntries.reduce((sum, entry) => sum + Number(entry.anxiety), 0) /
      (weekdayEntries.length || 1)
    const weekendAnxiety =
      weekendEntries.reduce((sum, entry) => sum + Number(entry.anxiety), 0) /
      (weekendEntries.length || 1)

    const list = [`You felt highest ${bestMood.name.toLowerCase()} in this ${range}.`]

    if (weekdayEntries.length > 0 || weekendEntries.length > 0) {
      list.push(
        weekdayAnxiety > weekendAnxiety
          ? 'Your anxiety was higher on weekdays than weekends.'
          : 'Your anxiety was similar or lower on weekdays compared to weekends.',
      )
    }

    return list
  }, [emotionAverages, entries, range])

  return (
    <AppLayout title="Analytics">
      <FilterControls
        range={range}
        moodType={moodType}
        onRangeChange={setRange}
        onMoodTypeChange={setMoodType}
      />

      <div className="mt-4">
        {error && <ErrorState message={error} />}
        {loading ? (
          <LoadingSpinner text="Crunching mood analytics..." />
        ) : entries.length === 0 ? (
          <EmptyState
            title="No analytics yet"
            message="Add mood entries in the dashboard to unlock charts and insights."
          />
        ) : (
          <div className="space-y-4">
            <MoodCharts averages={emotionAverages} distributions={distributions} />
            <InsightsPanel insights={insights} />
          </div>
        )}
      </div>
    </AppLayout>
  )
}

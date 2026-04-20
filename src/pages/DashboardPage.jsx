import { format, subDays, subMonths, subYears } from 'date-fns'
import { useCallback, useMemo, useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { FilterControls } from '../components/FilterControls'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { MoodCalendar } from '../components/MoodCalendar'
import { MoodEntryForm } from '../components/MoodEntryForm'
import { useAuth } from '../hooks/useAuth'
import { useMoodEntries } from '../hooks/useMoodEntries'
import { createMoodEntry, deleteMoodEntry, moodMetrics } from '../services/moodService'

const getFromDate = (range) => {
  const now = new Date()
  if (range === 'week') return format(subDays(now, 6), 'yyyy-MM-dd')
  if (range === 'month') return format(subMonths(now, 1), 'yyyy-MM-dd')
  return format(subYears(now, 1), 'yyyy-MM-dd')
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [range, setRange] = useState('week')
  const [moodType, setMoodType] = useState('all')
  const [saveError, setSaveError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingEntryId, setDeletingEntryId] = useState('')

  const filters = useMemo(
    () => ({
      fromDate: getFromDate(range),
      toDate: format(new Date(), 'yyyy-MM-dd'),
    }),
    [range],
  )

  const { entries, loading, error, refreshEntries } = useMoodEntries(user?.uid, filters)

  const filteredEntries = useMemo(() => {
    if (moodType === 'all') return entries
    // Filter entries where the selected mood has any value (> 0)
    return entries.filter((entry) => entry[moodType] > 0)
  }, [entries, moodType])

  const handleCreateEntry = useCallback(
    async ({ values, journalText }) => {
      if (!user) return

      setSaving(true)
      setSaveError('')
      try {
        await createMoodEntry({ userId: user.uid, values, journalText })
        await refreshEntries()
      } catch (err) {
        setSaveError(err.message || 'Failed to save entry')
      } finally {
        setSaving(false)
      }
    },
    [refreshEntries, user],
  )

  const handleDeleteEntry = useCallback(
    async (entryId) => {
      setDeletingEntryId(entryId)
      setDeleteError('')
      try {
        await deleteMoodEntry(entryId)
        await refreshEntries()
      } catch (err) {
        setDeleteError(err.message || 'Failed to delete entry')
      } finally {
        setDeletingEntryId('')
      }
    },
    [refreshEntries],
  )

  return (
    <AppLayout title="Dashboard">
      <FilterControls
        range={range}
        moodType={moodType}
        onRangeChange={setRange}
        onMoodTypeChange={setMoodType}
      />

      <div className="mt-4">
        <MoodEntryForm onSubmit={handleCreateEntry} saving={saving} />
      </div>

      {saveError && (
        <div className="mt-4">
          <ErrorState message={saveError} />
        </div>
      )}
      {deleteError && (
        <div className="mt-4">
          <ErrorState message={deleteError} />
        </div>
      )}

      <div className="mt-4">
        {error && <ErrorState message={error} />}
        {loading ? (
          <LoadingSpinner text="Loading your mood history..." />
        ) : filteredEntries.length === 0 ? (
          <EmptyState
            title={entries.length === 0 ? "No entries yet" : `No entries with ${moodType}`}
            message={
              entries.length === 0
                ? "Log your first mood entry and MoodMap will start building your trend history."
                : `No entries found with ${moodType} levels. Try selecting "All emotions" or choose a different mood type.`
            }
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <MoodCalendar entries={filteredEntries} />
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-3 text-lg font-semibold text-slate-700 dark:text-slate-100">
                Recent Entries
              </h2>
              <div className="space-y-3">
                {filteredEntries.slice(0, 6).map((entry) => (
                  <article key={entry.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-100">
                        {entry.date}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-500 dark:text-slate-300">
                          Avg:{' '}
                          {Math.round(
                            moodMetrics.reduce((sum, metric) => sum + Number(entry[metric]), 0) /
                              moodMetrics.length,
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeleteEntry(entry.id)}
                          disabled={deletingEntryId === entry.id}
                          className="rounded-md border border-rose-200 bg-white px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
                          aria-label={`Delete mood entry for ${entry.date}`}
                        >
                          {deletingEntryId === entry.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                      {moodMetrics.map((metric) => (
                        <p key={metric}>
                          {metric}: {entry[metric]}
                        </p>
                      ))}
                    </div>
                    {entry.journalText && (
                      <p className="mt-2 rounded bg-white p-2 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {entry.journalText}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

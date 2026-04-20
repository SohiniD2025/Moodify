import { format, subYears } from 'date-fns'
import { useMemo } from 'react'
import { AppLayout } from '../components/AppLayout'
import { EmptyState } from '../components/EmptyState'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { useMoodEntries } from '../hooks/useMoodEntries'

export default function ProfilePage() {
  const { user } = useAuth()
  const filters = useMemo(
    () => ({
      fromDate: format(subYears(new Date(), 1), 'yyyy-MM-dd'),
      toDate: format(new Date(), 'yyyy-MM-dd'),
    }),
    [],
  )
  const { entries, loading } = useMoodEntries(user?.uid, filters)

  return (
    <AppLayout title="Profile">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100">Account</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <p>
            <span className="font-medium">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-medium">User ID:</span> {user?.uid}
          </p>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100">
          Your Activity
        </h2>
        {loading ? (
          <LoadingSpinner text="Loading profile stats..." />
        ) : entries.length === 0 ? (
          <EmptyState
            title="No activity yet"
            message="Start logging entries from dashboard to see your profile activity."
          />
        ) : (
          <div className="mt-3 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-xs uppercase text-slate-400 dark:text-slate-500">
                Entries (last year)
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-700 dark:text-slate-100">
                {entries.length}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-xs uppercase text-slate-400 dark:text-slate-500">
                Latest entry date
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-700 dark:text-slate-100">
                {entries[0]?.date}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-xs uppercase text-slate-400 dark:text-slate-500">
                Journaled days
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-700 dark:text-slate-100">
                {entries.filter((entry) => entry.journalText).length}
              </p>
            </div>
          </div>
        )}
      </section>
    </AppLayout>
  )
}

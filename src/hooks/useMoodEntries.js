import { useCallback, useEffect, useState } from 'react'
import { fetchMoodEntries } from '../services/moodService'

export function useMoodEntries(userId, filters) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshEntries = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setError('')
    try {
      const response = await fetchMoodEntries({
        userId,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      })
      setEntries(response)
    } catch (err) {
      setError(err.message || 'Could not load mood entries')
    } finally {
      setLoading(false)
    }
  }, [filters.fromDate, filters.toDate, userId])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refreshEntries()
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [refreshEntries])

  return { entries, loading, error, refreshEntries }
}

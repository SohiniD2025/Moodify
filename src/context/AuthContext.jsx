import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import { AuthContext } from './authContextObject'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser)
        setAuthLoading(false)
        setAuthError(null)
      },
      (error) => {
        console.error('Auth state listener error:', error)
        setAuthError(error.message)
        setAuthLoading(false)
      }
    )

    return unsubscribe
  }, [])

  const value = useMemo(() => ({ user, authLoading, authError }), [user, authLoading, authError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

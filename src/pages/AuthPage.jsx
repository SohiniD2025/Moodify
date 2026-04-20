import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { loginWithEmail, signupWithEmail } from '../services/authService'
import { auth } from '../services/firebase'

export default function AuthPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const getFirebaseErrorMessage = (code) => {
    const messages = {
      'auth/email-already-in-use': 'Email is already registered',
      'auth/invalid-email': 'Invalid email format',
      'auth/weak-password': 'Password must be at least 6 characters',
      'auth/user-not-found': 'User not found',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many login attempts. Please try again later.',
      'auth/operation-not-allowed': 'Login is currently disabled',
      'auth/invalid-credential': 'Invalid email or password',
    }
    return messages[code] || 'Authentication failed'
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'signup') {
        await signupWithEmail(email, password)
      } else {
        await loginWithEmail(email, password)
      }

      // Wait for Firebase auth state to update (max 2 seconds)
      let retries = 0
      const maxRetries = 20 // 20 * 100ms = 2 seconds
      while (!auth.currentUser && retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        retries++
      }

      if (!auth.currentUser) {
        throw new Error('Authentication failed: User not found after login')
      }

      const targetPath = location.state?.from || '/dashboard'
      navigate(targetPath, { replace: true })
    } catch (err) {
      const errorCode = err.code
      const errorMessage = errorCode
        ? getFirebaseErrorMessage(errorCode)
        : err.message || 'Authentication failed'
      setError(errorMessage)
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-semibold text-slate-700 dark:text-slate-100">MoodMap</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
          Track daily emotions and reflect over time.
        </p>

        <div className="mt-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-md py-2 text-sm ${
              mode === 'login'
                ? 'bg-white text-slate-700 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                : 'text-slate-500 dark:text-slate-300'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-md py-2 text-sm ${
              mode === 'signup'
                ? 'bg-white text-slate-700 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                : 'text-slate-500 dark:text-slate-300'
            }`}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-70"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

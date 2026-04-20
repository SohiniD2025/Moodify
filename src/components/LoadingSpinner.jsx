export function LoadingSpinner({ text = 'Loading...', fullScreen = false }) {
  const wrapperClass = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'w-full flex items-center justify-center py-8'

  return (
    <div className={wrapperClass}>
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-400 dark:border-slate-600 dark:border-t-indigo-300" />
        <p className="text-sm">{text}</p>
      </div>
    </div>
  )
}

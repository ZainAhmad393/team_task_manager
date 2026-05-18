import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../context/Authstore'

/* ── Full-screen loading spinner ── */
function InitSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface-50 z-50">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          <span className="text-white text-sm font-bold">TF</span>
        </div>
        <div className="w-5 h-5 border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    </div>
  )
}

/**
 * ProtectedRoute — renders children only if authenticated.
 * Wrapped around AppLayout so the sidebar is always present on protected pages.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return <InitSpinner />
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

/**
 * PublicRoute — renders children only if NOT authenticated.
 * Redirects logged-in users to the dashboard.
 */
export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return <InitSpinner />
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />
}
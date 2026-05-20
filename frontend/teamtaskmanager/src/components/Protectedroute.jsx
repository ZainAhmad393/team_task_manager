import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../context/Authstore'

/* ── Full-screen loading spinner ── */
function InitSpinner() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface-50)', zIndex: 50,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 16,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
        }}>
          <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>TF</span>
        </div>
        <div style={{
          width: 20, height: 20, borderRadius: '50%',
          border: '2px solid var(--surface-200)',
          borderTopColor: 'var(--brand-600)',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    </div>
  )
}

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return <InitSpinner />
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return <InitSpinner />
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />
}
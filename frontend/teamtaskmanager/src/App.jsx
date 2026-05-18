import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './context/Authstore'

// Layout
import AppLayout from './components/Applayout'

// Auth guards
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'

// Pages
import Login        from './pages/Login'
import Register     from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword  from './pages/ResetPassword'
import Dashboard    from './pages/Dashboard'
import Tasks        from './pages/Tasks'
import Teams        from './pages/Teams'
import TeamDetail   from './pages/TeamDetail'

export default function App() {
  const { initialize } = useAuthStore()

  // Restore session on app mount
  useEffect(() => { initialize() }, [initialize])

  return (
    <Routes>
      {/* ── Root redirect ── */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ── Public routes (redirect to dashboard if logged in) ── */}
      <Route element={<PublicRoute />}>
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
      </Route>

      {/* ── Protected routes (wrapped in AppLayout with sidebar) ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/tasks"      element={<Tasks />} />
          <Route path="/teams"      element={<Teams />} />
          <Route path="/teams/:id"  element={<TeamDetail />} />
        </Route>
      </Route>

      {/* ── 404 fallback ── */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
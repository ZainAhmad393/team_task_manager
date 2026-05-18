import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { teamsApi } from '../services/api'

/**
 * AppLayout
 * This component MUST be rendered inside <ProtectedRoute>.
 * It provides the sidebar + main content shell for all protected pages.
 *
 * FIX: Previously, the sidebar was not showing because AppLayout was not
 * correctly nested inside the protected route tree. The fix is in App.jsx —
 * AppLayout now wraps all protected page routes as a parent <Route>.
 */
export default function AppLayout() {
  const [teams, setTeams]     = useState([])
  const [sidebarOpen, setSidebar] = useState(false)

  /* Load teams for sidebar team list */
  const loadTeams = () => {
    teamsApi.getAll()
      .then(({ data }) => setTeams(data.teams || []))
      .catch(() => {})
  }

  useEffect(() => { loadTeams() }, [])

  const closeSidebar = () => setSidebar(false)

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">

      {/* ── Desktop Sidebar (always visible lg+) ── */}
      <div className="hidden lg:block flex-shrink-0 h-full">
        <Sidebar teams={teams} onTeamsChange={loadTeams} />
      </div>

      {/* ── Mobile Sidebar overlay ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={closeSidebar}
          />
          {/* Drawer */}
          <div className="relative z-10 flex h-full animate-slide-in-left">
            <Sidebar teams={teams} onClose={closeSidebar} onTeamsChange={loadTeams} />
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-surface-200 flex-shrink-0 z-10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              <span className="text-white text-[11px] font-bold">TF</span>
            </div>
            <span className="font-bold text-sm text-surface-900 tracking-tight">TaskFlow</span>
          </div>
          <button
            onClick={() => setSidebar(true)}
            className="p-2 rounded-xl hover:bg-surface-100 text-surface-600 transition-colors"
            aria-label="Open navigation menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </header>

        {/* Page content — Outlet renders the matched child route */}
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ teams, reloadTeams: loadTeams }} />
        </main>
      </div>
    </div>
  )
}
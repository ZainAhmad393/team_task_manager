import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { teamsApi } from '../services/api'

export default function AppLayout() {
  const [teams, setTeams] = useState([])
  const [sidebarOpen, setSidebar] = useState(false)

  const loadTeams = async () => {
    try {
      const { data } = await teamsApi.getAll()
      setTeams(data?.teams || [])
    } catch (err) {
      console.error('Failed to load teams:', err)
    }
  }

  useEffect(() => {
    loadTeams()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0 h-full">
        <Sidebar
          teams={teams}
          onTeamsChange={loadTeams}
        />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebar(false)}
          />

          <div className="relative z-10 flex h-full">
            <Sidebar
              teams={teams}
              onClose={() => setSidebar(false)}
              onTeamsChange={loadTeams}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile Header */}
        <header className="flex lg:hidden items-center justify-between px-4 py-3 bg-white border-b border-surface-150 flex-shrink-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">TF</span>
            </div>
            <span className="font-bold text-sm text-surface-900">
              TaskFlow
            </span>
          </div>

          <button
            onClick={() => setSidebar(true)}
            className="p-2 rounded-xl bg-transparent text-surface-500 hover:bg-surface-100 transition-colors"
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M2 5h14M2 9h14M2 13h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ teams, reloadTeams: loadTeams }} />
        </main>

      </div>
    </div>
  )
}
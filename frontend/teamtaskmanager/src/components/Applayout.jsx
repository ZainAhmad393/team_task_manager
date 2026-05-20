import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { teamsApi } from '../services/api'

export default function AppLayout() {
  const [teams, setTeams] = useState([])
  const [sidebarOpen, setSidebar] = useState(false)

  const loadTeams = () => {
    teamsApi.getAll()
      .then(({ data }) => setTeams(data.teams || []))
      .catch(() => {})
  }

  useEffect(() => { loadTeams() }, [])

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--surface-50)',
    }}>

      {/* ── Desktop Sidebar ── */}
      <div className="sidebar-desktop-wrapper" style={{
        flexShrink: 0,
        height: '100%',
      }}>
        <Sidebar teams={teams} onTeamsChange={loadTeams} />
      </div>

      {/* ── Mobile Sidebar overlay ── */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
        }}>
          {/* Backdrop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
            }}
            onClick={() => setSidebar(false)}
          />
          {/* Drawer */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', height: '100%' }}>
            <Sidebar teams={teams} onClose={() => setSidebar(false)} onTeamsChange={loadTeams} />
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflow: 'hidden',
      }}>

        {/* Mobile header */}
        <header className="mobile-header" style={{
          display: 'none', /* shown via CSS below */
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'white',
          borderBottom: '1px solid var(--surface-150)',
          flexShrink: 0,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--brand-500), var(--brand-600))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>TF</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--surface-900)' }}>TaskFlow</span>
          </div>
          <button
            onClick={() => setSidebar(true)}
            style={{
              padding: 8, borderRadius: 12, border: 'none',
              background: 'transparent', cursor: 'pointer',
              color: 'var(--surface-500)',
            }}
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </header>

        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet context={{ teams, reloadTeams: loadTeams }} />
        </main>
      </div>

      {/* Responsive style — only thing we keep in a style tag */}
      <style>{`
        @media (max-width: 1023px) {
          .sidebar-desktop-wrapper { display: none !important; }
          .mobile-header { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .sidebar-desktop-wrapper { display: block !important; }
          .mobile-header { display: none !important; }
        }
      `}</style>
    </div>
  )
}
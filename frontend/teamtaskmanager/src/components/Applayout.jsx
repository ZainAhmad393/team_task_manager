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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f8f8fc' }}>

      {/* Desktop Sidebar */}
      <div style={{ display: 'none' }} className="lg-sidebar">
        <Sidebar teams={teams} onTeamsChange={loadTeams} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setSidebar(false)}
          />
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', height: '100%' }}>
            <Sidebar teams={teams} onClose={() => setSidebar(false)} onTeamsChange={loadTeams} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Mobile Header */}
        <header className="mobile-header" style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'white',
          borderBottom: '1px solid #e8e8f2',
          flexShrink: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>TF</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#14142a' }}>TaskFlow</span>
          </div>
          <button
            onClick={() => setSidebar(true)}
            style={{ padding: 8, borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', color: '#505068' }}
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

      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar { display: flex !important; flex-shrink: 0; height: 100%; }
          .mobile-header { display: none !important; }
        }
        @media (max-width: 1023px) {
          .lg-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
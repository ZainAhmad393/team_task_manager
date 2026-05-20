import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../context/Authstore.js'
import { Avatar, Spinner } from './ui/index.jsx'
import logo from '../assets/logo.png'

/* ── Icons ── */
const Icons = {
  Dashboard: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9"   y="1.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="1.5" y="9"   width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9"   y="9"   width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  Tasks: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="13" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 8l2.5 2.5 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Teams: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1.5 14c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M14.5 14c0-1.933-1.12-3.5-2.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  Logout: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5.5 7h6M9 4.5L11.5 7 9 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 2H3A1.5 1.5 0 001.5 3.5v7A1.5 1.5 0 003 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
}

/* ── NavItem ── */
function NavItem({ to, Icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={{ textDecoration: 'none' }}
    >
      {({ isActive }) => (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '7px 10px', borderRadius: 12,
          fontSize: 13.5, fontWeight: isActive ? 600 : 500,
          color: isActive ? 'var(--brand-700)' : 'var(--surface-500)',
          background: isActive ? 'var(--brand-50)' : 'transparent',
          cursor: 'pointer', userSelect: 'none',
          transition: 'all 120ms',
          marginBottom: 2,
        }}
          onMouseEnter={e => {
            if (!isActive) {
              e.currentTarget.style.background = 'var(--surface-100)'
              e.currentTarget.style.color = 'var(--surface-800)'
            }
          }}
          onMouseLeave={e => {
            if (!isActive) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--surface-500)'
            }
          }}
        >
          <span style={{
            flexShrink: 0,
            color: isActive ? 'var(--brand-600)' : 'currentColor',
            display: 'flex',
          }}>
            <Icon />
          </span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {label}
          </span>
        </div>
      )}
    </NavLink>
  )
}

/* ── Sidebar ── */
export default function Sidebar({ teams = [], onClose }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/login')
      toast.success('Signed out successfully')
    } catch {
      toast.error('Logout failed. Please try again.')
      setLoggingOut(false)
    }
  }

  return (
    <aside style={{
      width: 240, minWidth: 240,
      height: '100%',
      display: 'flex', flexDirection: 'column',
      background: 'white',
      borderRight: '1px solid var(--surface-150)',
    }}>
      {/* ── Brand ── */}
      <div style={{
        padding: '0 20px', height: 56,
        display: 'flex', alignItems: 'center', gap: 10,
        flexShrink: 0,
        borderBottom: '1px solid var(--surface-100)',
      }}>
        <img
          src={logo}
          alt="TaskFlow"
          style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0, display: 'block' }}
        />
        <p style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em', color: 'var(--surface-900)', margin: 0 }}>
          TaskFlow
        </p>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', scrollbarWidth: 'none' }}>

        {/* Main nav */}
        <div style={{ marginBottom: 20 }}>
          <NavItem to="/dashboard" Icon={Icons.Dashboard} label="Dashboard" end />
          <NavItem to="/tasks"     Icon={Icons.Tasks}     label="My Tasks" />
          <NavItem to="/teams"     Icon={Icons.Teams}     label="Teams" />
        </div>

        {/* Teams list */}
        {teams.length > 0 && (
          <div>
            <p style={{
              padding: '0 10px 8px', fontSize: 10.5, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'var(--surface-400)', margin: 0,
            }}>
              Your Teams
            </p>
            {teams.map((team) => (
              <NavLink
                key={team.id}
                to={`/teams/${team.id}`}
                onClick={onClose}
                style={{ textDecoration: 'none' }}
              >
                {({ isActive }) => (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px', borderRadius: 12,
                    fontSize: 13, cursor: 'pointer',
                    color: isActive ? 'var(--brand-700)' : 'var(--surface-500)',
                    background: isActive ? 'var(--brand-50)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 120ms', marginBottom: 2,
                  }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--surface-50)'
                        e.currentTarget.style.color = 'var(--surface-800)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--surface-500)'
                      }
                    }}
                  >
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: team.color || 'var(--brand-500)',
                    }} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {team.name}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--surface-400)', flexShrink: 0 }}>
                      {team._count?.tasks ?? 0}
                    </span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* ── User Profile ── */}
      <div style={{ padding: 12, flexShrink: 0, borderTop: '1px solid var(--surface-100)' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 12,
            cursor: 'default', background: 'transparent',
            transition: 'background 120ms',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-50)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Avatar name={user?.name} size="sm" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 14, fontWeight: 600,
              color: 'var(--surface-900)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              margin: 0, lineHeight: 1.3,
            }}>
              {user?.name}
            </p>
            <p style={{
              fontSize: 11, color: 'var(--surface-400)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              margin: '2px 0 0', lineHeight: 1.3,
            }}>
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Sign out"
            style={{
              padding: 6, borderRadius: 8, border: 'none',
              background: 'transparent', cursor: loggingOut ? 'wait' : 'pointer',
              color: 'var(--surface-400)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: loggingOut ? 0.3 : 1,
              transition: 'all 120ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger-text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--surface-400)' }}
          >
            {loggingOut ? <Spinner size="xs" /> : <Icons.Logout />}
          </button>
        </div>

        {user?.role === 'ADMIN' && (
          <div style={{
            marginTop: 8, marginLeft: 8, marginRight: 8,
            padding: '4px 12px', borderRadius: 8, textAlign: 'center',
            background: 'var(--brand-50)',
            border: '1px solid var(--brand-100)',
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-600)', margin: 0 }}>
              System Admin
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
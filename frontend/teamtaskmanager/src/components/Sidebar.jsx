import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../context/authStore'
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
  ChevronRight: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

/* ── NavItem ── */
function NavItem({ to, Icon, label, badge, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13.5px] font-medium
         transition-all duration-150 cursor-pointer select-none group
         ${isActive
           ? 'bg-[var(--brand-50)] text-[var(--brand-700)] font-semibold'
           : 'text-[var(--surface-500)] hover:text-[var(--surface-800)] hover:bg-[var(--surface-100)]'
         }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className="flex-shrink-0 transition-colors"
            style={{ color: isActive ? 'var(--brand-600)' : 'inherit' }}
          >
            <Icon />
          </span>
          <span className="truncate flex-1">{label}</span>
          {badge != null && (
            <span
              className="text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center"
              style={{
                background: isActive ? 'var(--brand-100)' : 'var(--surface-100)',
                color: isActive ? 'var(--brand-600)' : 'var(--surface-400)',
              }}
            >
              {badge}
            </span>
          )}
        </>
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
    <aside
      className="h-full flex flex-col"
      style={{
        width: '240px',
        minWidth: '240px',
        background: 'white',
        borderRight: '1px solid var(--surface-150)',
      }}
    >
      {/* ── Brand ── */}
      <div
        className="px-5 h-14 flex items-center gap-2.5 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--surface-100)' }}
      >
        {/* ✅ Fixed: import-based logo with proper sizing */}
        <img
          src={logo}
          alt="TaskFlow"
          className="w-7 h-7 object-contain flex-shrink-0"
        />
        <p
          className="font-bold text-sm tracking-tight leading-none"
          style={{ color: 'var(--surface-900)' }}
        >
          TaskFlow
        </p>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-none">

        {/* Main nav */}
        <div className="space-y-0.5 mb-5">
          <NavItem to="/dashboard" Icon={Icons.Dashboard} label="Dashboard" end />
          <NavItem to="/tasks"     Icon={Icons.Tasks}     label="My Tasks" />
          <NavItem to="/teams"     Icon={Icons.Teams}     label="Teams" />
        </div>

        {/* Teams list */}
        {teams.length > 0 && (
          <div>
            <p
              className="px-2.5 pb-2 text-[10.5px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--surface-400)' }}
            >
              Your Teams
            </p>
            <div className="space-y-0.5">
              {teams.map((team) => (
                <NavLink
                  key={team.id}
                  to={`/teams/${team.id}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[13px] transition-all cursor-pointer
                     ${isActive
                       ? 'bg-[var(--brand-50)] text-[var(--brand-700)] font-semibold'
                       : 'text-[var(--surface-500)] hover:bg-[var(--surface-50)] hover:text-[var(--surface-800)]'
                     }`
                  }
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: team.color || 'var(--brand-500)' }}
                  />
                  <span className="truncate flex-1">{team.name}</span>
                  <span
                    className="text-[11px] flex-shrink-0"
                    style={{ color: 'var(--surface-400)' }}
                  >
                    {team._count?.tasks ?? 0}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── User Profile ── */}
      <div
        className="p-3 flex-shrink-0"
        style={{ borderTop: '1px solid var(--surface-100)' }}
      >
        <div
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors group cursor-default"
          style={{ background: 'transparent' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-50)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Avatar name={user?.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-semibold truncate leading-tight"
              style={{ color: 'var(--surface-900)' }}
            >
              {user?.name}
            </p>
            <p
              className="text-[11px] truncate leading-tight mt-0.5"
              style={{ color: 'var(--surface-400)' }}
            >
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Sign out"
            className="
              opacity-0 group-hover:opacity-100 transition-all
              p-1.5 rounded-lg
              disabled:cursor-wait disabled:opacity-30
              flex-shrink-0
            "
            style={{ color: 'var(--surface-400)' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--danger-bg)'
              e.currentTarget.style.color = 'var(--danger-text)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--surface-400)'
            }}
          >
            {loggingOut ? <Spinner size="xs" /> : <Icons.Logout />}
          </button>
        </div>

        {/* Role badge */}
        {user?.role === 'ADMIN' && (
          <div
            className="mt-2 mx-2 px-3 py-1 rounded-lg text-center"
            style={{
              background: 'var(--brand-50)',
              border: '1px solid var(--brand-100)',
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--brand-600)' }}
            >
              System Admin
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
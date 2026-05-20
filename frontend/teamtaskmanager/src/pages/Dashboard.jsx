import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format, isAfter } from 'date-fns'
import { tasksApi, teamsApi } from '../services/api'
import { PriorityBadge, LoadingPage, EmptyState, Avatar } from '../components/ui/index.jsx'
import TaskFormModal from '../components/Taskformmodal.jsx'
import useAuthStore from '../context/Authstore'

/* ── Stat Card ── */
function StatCard({ label, value, sub, icon, accentColor, accentBg }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--surface-150)',
      borderRadius: 16,
      boxShadow: 'var(--shadow-sm)',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <p style={{
          fontSize: 11.5, fontWeight: 600, color: 'var(--surface-400)',
          textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0,
        }}>{label}</p>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
          background: accentBg, color: accentColor,
        }}>
          {icon}
        </div>
      </div>
      <div>
        <p style={{
          fontSize: 28, fontWeight: 700,
          letterSpacing: '-0.03em', color: 'var(--surface-900)',
          lineHeight: 1, margin: 0,
        }}>{value}</p>
        {sub && (
          <p style={{ fontSize: 11.5, marginTop: 4, color: 'var(--surface-400)', margin: '4px 0 0' }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}

/* ── Quick Action ── */
function QuickAction({ icon, label, onClick, accentColor, accentBg }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'white',
        border: '1.5px solid var(--surface-150)',
        borderRadius: 16,
        boxShadow: 'var(--shadow-sm)',
        padding: 16,
        cursor: 'pointer',
        transition: 'all 200ms var(--ease-spring)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 10,
        width: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = accentColor + '40'
        e.currentTarget.style.background = accentBg
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = `0 8px 20px ${accentColor}18`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--surface-150)'
        e.currentTarget.style.background = 'white'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, background: accentBg, color: accentColor,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--surface-700)', textAlign: 'center', lineHeight: 1.3 }}>
        {label}
      </span>
    </button>
  )
}

export default function Dashboard() {
  const [stats, setStats]           = useState(null)
  const [recentTasks, setRecentTasks] = useState([])
  const [teams, setTeams]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const { user } = useAuthStore()

  const load = async () => {
    setLoading(true)
    try {
      const [statsRes, tasksRes, teamsRes] = await Promise.all([
        tasksApi.getStats(),
        tasksApi.getAll({ limit: 6 }),
        teamsApi.getAll(),
      ])
      setStats(statsRes.data.stats)
      setRecentTasks(tasksRes.data.tasks)
      setTeams(teamsRes.data.teams)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  if (loading) return <LoadingPage />

  const completionRate = stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{
      padding: '28px 32px',
      maxWidth: 1280,
      margin: '0 auto',
      width: '100%',
      animation: 'fadeUp 0.35s var(--ease-spring) both',
    }}>

      {/* ── Welcome Banner ── */}
      <div style={{
        borderRadius: 16, marginBottom: 28,
        overflow: 'hidden', position: 'relative',
        background: 'linear-gradient(135deg, var(--brand-600) 0%, var(--brand-800) 100%)',
        padding: '28px 32px',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)',
        }} />
        <div style={{
          position: 'relative', display: 'flex',
          flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500, margin: '0 0 4px' }}>
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white', letterSpacing: '-0.03em', margin: 0 }}>
              {greeting}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
              {stats?.pending || 0} tasks pending · {completionRate}% complete overall
            </p>
          </div>
          <button
            onClick={() => setTaskModalOpen(true)}
            style={{
              flexShrink: 0, padding: '10px 20px', borderRadius: 12,
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white', backdropFilter: 'blur(8px)',
              transition: 'all 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            + New Task
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid" style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Tasks"  value={stats?.total || 0}      icon="◈" accentColor="var(--brand-600)" accentBg="var(--brand-50)"  sub="Across all teams" />
        <StatCard label="In Progress"  value={stats?.inProgress || 0} icon="⚡" accentColor="#2563eb"           accentBg="#eff6ff"          sub="Active right now" />
        <StatCard label="Completed"    value={stats?.completed || 0}  icon="✓" accentColor="#16a34a"           accentBg="#f0fdf4"          sub={`${completionRate}% rate`} />
        <StatCard label="Overdue"      value={stats?.overdue || 0}    icon="⚠" accentColor="#e11d48"           accentBg="#fff1f2"          sub="Need attention" />
      </div>
      <style>{`
        .stats-grid { grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 1280px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }
      `}</style>

      {/* ── Progress Bar ── */}
      {stats?.total > 0 && (
        <div style={{
          background: 'white', border: '1px solid var(--surface-150)',
          borderRadius: 16, boxShadow: 'var(--shadow-sm)',
          padding: 20, marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--surface-800)', margin: 0 }}>
                Overall Progress
              </h3>
              <p style={{ fontSize: 12, marginTop: 2, color: 'var(--surface-400)' }}>
                {stats.completed} of {stats.total} tasks complete
              </p>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--brand-600)' }}>
              {completionRate}%
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 99, overflow: 'hidden', background: 'var(--surface-100)' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${completionRate}%`,
              background: 'linear-gradient(90deg, var(--brand-500), var(--brand-400))',
              transition: 'width 700ms ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--surface-400)' }}>
            <span>{stats.completed} done</span>
            <span>{(stats.pending || 0) + (stats.inProgress || 0)} remaining</span>
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{
          fontSize: 11, fontWeight: 700, color: 'var(--surface-400)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 12,
        }}>Quick Actions</h2>
        <div className="quick-actions-grid" style={{ display: 'grid', gap: 12 }}>
          <QuickAction icon="＋" label="New Task"  onClick={() => setTaskModalOpen(true)}             accentColor="var(--brand-600)" accentBg="var(--brand-50)" />
          <QuickAction icon="◈" label="New Team"  onClick={() => window.location.href = '/teams'}    accentColor="#7c3aed" accentBg="#f5f3ff" />
          <QuickAction icon="☑" label="My Tasks"  onClick={() => window.location.href = '/tasks'}    accentColor="#2563eb" accentBg="#eff6ff" />
          <QuickAction icon="◉" label="All Teams" onClick={() => window.location.href = '/teams'}    accentColor="#059669" accentBg="#f0fdf4" />
        </div>
        <style>{`.quick-actions-grid { grid-template-columns: repeat(4, 1fr); } @media (max-width: 640px) { .quick-actions-grid { grid-template-columns: repeat(2, 1fr); } }`}</style>
      </div>

      {/* ── Main Grid ── */}
      <div className="dashboard-main-grid" style={{ display: 'grid', gap: 20 }}>

        {/* Recent Tasks */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: 'var(--surface-400)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Recent Tasks
            </h2>
            <Link to="/tasks" style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-600)', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div style={{ background: 'white', border: '1px solid var(--surface-150)', borderRadius: 16, boxShadow: 'var(--shadow-sm)' }}>
              <EmptyState
                icon="✓"
                title="No tasks yet"
                description="Create your first task to get started"
                action={
                  <button onClick={() => setTaskModalOpen(true)} className="btn-primary">
                    + Create Task
                  </button>
                }
              />
            </div>
          ) : (
            <div style={{
              background: 'white', border: '1px solid var(--surface-150)',
              borderRadius: 16, boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
            }}>
              {recentTasks.map((task, i) => {
                const isOverdue = task.dueDate && !isAfter(new Date(task.dueDate), new Date()) && task.status !== 'COMPLETED'
                return (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', cursor: 'pointer',
                      borderBottom: i < recentTasks.length - 1 ? '1px solid var(--surface-100)' : 'none',
                      background: 'white', transition: 'background 120ms',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-50)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: task.status === 'COMPLETED' ? 'var(--success-text)'
                        : task.status === 'IN_PROGRESS' ? 'var(--info-text)' : '#f59e0b',
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 14, fontWeight: 500, margin: 0,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        color: task.status === 'COMPLETED' ? 'var(--surface-400)' : 'var(--surface-900)',
                        textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                      }}>
                        {task.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                        {task.team && <span style={{ fontSize: 12, color: 'var(--surface-400)' }}>{task.team.name}</span>}
                        {task.dueDate && (
                          <span style={{ fontSize: 12, fontWeight: 500, color: isOverdue ? 'var(--danger-text)' : 'var(--surface-400)' }}>
                            · {isOverdue ? '⚠ ' : ''}{format(new Date(task.dueDate), 'MMM d')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <PriorityBadge priority={task.priority} />
                      {task.assignee && <Avatar name={task.assignee.name} size="xs" />}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Teams Sidebar */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: 'var(--surface-400)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Your Teams
            </h2>
            <Link to="/teams" style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-600)', textDecoration: 'none' }}>
              Manage →
            </Link>
          </div>

          {teams.length === 0 ? (
            <div style={{ background: 'white', border: '1px solid var(--surface-150)', borderRadius: 16, boxShadow: 'var(--shadow-sm)' }}>
              <EmptyState icon="◈" title="No teams yet" description="Create a team to collaborate" />
            </div>
          ) : (
            <div style={{
              background: 'white', border: '1px solid var(--surface-150)',
              borderRadius: 16, boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
            }}>
              {teams.map((team, i) => (
                <Link
                  key={team.id}
                  to={`/teams/${team.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', textDecoration: 'none',
                    borderBottom: i < teams.length - 1 ? '1px solid var(--surface-100)' : 'none',
                    background: 'white', transition: 'background 120ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ width: 12, height: 12, borderRadius: '50%', flexShrink: 0, background: team.color }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--surface-900)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {team.name}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--surface-400)', margin: 0 }}>
                      {team._count?.members || 0} members
                    </p>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 99, flexShrink: 0,
                    background: 'var(--surface-100)', color: 'var(--surface-500)',
                  }}>
                    {team._count?.tasks || 0}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .dashboard-main-grid { grid-template-columns: 1fr; }
        @media (min-width: 1024px) { .dashboard-main-grid { grid-template-columns: 2fr 1fr; } }
      `}</style>

      <TaskFormModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSuccess={load}
      />
    </div>
  )
}
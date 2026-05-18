import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format, isAfter } from 'date-fns'
import { tasksApi, teamsApi } from '../services/api'
import { StatusBadge, PriorityBadge, LoadingPage, EmptyState, Avatar } from '../components/ui/index.jsx'
import TaskFormModal from '../components/Taskformmodal.jsx'
import useAuthStore from '../context/Authstore'

/* ── Stat Card ── */
function StatCard({ label, value, sub, icon, accentColor, accentBg }) {
  return (
    <div
      className="card p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-md cursor-default"
      style={{ '--accent': accentColor }}
    >
      <div className="flex items-start justify-between">
        <p className="stat-label">{label}</p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: accentBg, color: accentColor }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="stat-value">{value}</p>
        {sub && (
          <p className="text-[11.5px] mt-1" style={{ color: 'var(--surface-400)' }}>
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
      className="card flex flex-col items-center gap-2.5 p-4 cursor-pointer transition-all duration-200 w-full"
      style={{ border: '1.5px solid var(--surface-150)' }}
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
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{ background: accentBg, color: accentColor }}
      >
        {icon}
      </div>
      <span
        className="text-xs font-semibold text-center leading-tight"
        style={{ color: 'var(--surface-700)' }}
      >
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
    <div className="page animate-fade-up">

      {/* ── Welcome Banner ── */}
      <div
        className="rounded-2xl mb-7 overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, var(--brand-600) 0%, var(--brand-800) 100%)',
          padding: '28px 32px',
        }}
      >
        {/* Subtle texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)',
          }}
        />
        <div
          className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)',
            transform: 'translate(30%, -30%)',
          }}
        />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
            <h1
              className="text-2xl font-bold text-white tracking-tight"
              style={{ letterSpacing: '-0.03em' }}
            >
              {greeting}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {stats?.pending || 0} tasks pending · {completionRate}% complete overall
            </p>
          </div>
          <button
            onClick={() => setTaskModalOpen(true)}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white',
              backdropFilter: 'blur(8px)',
            }}
          >
            + New Task
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Tasks"
          value={stats?.total || 0}
          icon="◈"
          accentColor="var(--brand-600)"
          accentBg="var(--brand-50)"
          sub="Across all teams"
        />
        <StatCard
          label="In Progress"
          value={stats?.inProgress || 0}
          icon="⚡"
          accentColor="#2563eb"
          accentBg="#eff6ff"
          sub="Active right now"
        />
        <StatCard
          label="Completed"
          value={stats?.completed || 0}
          icon="✓"
          accentColor="#16a34a"
          accentBg="#f0fdf4"
          sub={`${completionRate}% rate`}
        />
        <StatCard
          label="Overdue"
          value={stats?.overdue || 0}
          icon="⚠"
          accentColor="#e11d48"
          accentBg="#fff1f2"
          sub="Need attention"
        />
      </div>

      {/* ── Progress Bar ── */}
      {stats?.total > 0 && (
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--surface-800)' }}>
                Overall Progress
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--surface-400)' }}>
                {stats.completed} of {stats.total} tasks complete
              </p>
            </div>
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: 'var(--brand-600)' }}
            >
              {completionRate}%
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'var(--surface-100)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${completionRate}%`,
                background: 'linear-gradient(90deg, var(--brand-500), var(--brand-400))',
              }}
            />
          </div>
          <div
            className="flex justify-between mt-2 text-xs"
            style={{ color: 'var(--surface-400)' }}
          >
            <span>{stats.completed} done</span>
            <span>{(stats.pending || 0) + (stats.inProgress || 0)} remaining</span>
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="mb-7">
        <h2 className="section-label mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 xs:grid-cols-4 gap-3">
          <QuickAction
            icon="＋"
            label="New Task"
            onClick={() => setTaskModalOpen(true)}
            accentColor="var(--brand-600)"
            accentBg="var(--brand-50)"
          />
          <QuickAction
            icon="◈"
            label="New Team"
            onClick={() => window.location.href = '/teams'}
            accentColor="#7c3aed"
            accentBg="#f5f3ff"
          />
          <QuickAction
            icon="☑"
            label="My Tasks"
            onClick={() => window.location.href = '/tasks'}
            accentColor="#2563eb"
            accentBg="#eff6ff"
          />
          <QuickAction
            icon="◉"
            label="All Teams"
            onClick={() => window.location.href = '/teams'}
            accentColor="#059669"
            accentBg="#f0fdf4"
          />
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-label">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="text-xs font-semibold transition-colors"
              style={{ color: 'var(--brand-600)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-700)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--brand-600)'}
            >
              View all →
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="card">
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
            <div
              className="card overflow-hidden"
              style={{ padding: 0 }}
            >
              {recentTasks.map((task, i) => {
                const isOverdue = task.dueDate && !isAfter(new Date(task.dueDate), new Date()) && task.status !== 'COMPLETED'
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                    style={{
                      borderBottom: i < recentTasks.length - 1 ? '1px solid var(--surface-100)' : 'none',
                      background: 'white',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-50)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    {/* Status dot */}
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background:
                          task.status === 'COMPLETED' ? 'var(--success-text)' :
                          task.status === 'IN_PROGRESS' ? 'var(--info-text)' :
                          '#f59e0b',
                      }}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{
                          color: task.status === 'COMPLETED' ? 'var(--surface-400)' : 'var(--surface-900)',
                          textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {task.team && (
                          <span
                            className="text-xs"
                            style={{ color: 'var(--surface-400)' }}
                          >
                            {task.team.name}
                          </span>
                        )}
                        {task.dueDate && (
                          <span
                            className="text-xs font-medium"
                            style={{
                              color: isOverdue ? 'var(--danger-text)' : 'var(--surface-400)',
                            }}
                          >
                            · {isOverdue ? '⚠ ' : ''}{format(new Date(task.dueDate), 'MMM d')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2 flex-shrink-0">
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-label">Your Teams</h2>
            <Link
              to="/teams"
              className="text-xs font-semibold transition-colors"
              style={{ color: 'var(--brand-600)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-700)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--brand-600)'}
            >
              Manage →
            </Link>
          </div>

          {teams.length === 0 ? (
            <div className="card">
              <EmptyState icon="◈" title="No teams yet" description="Create a team to collaborate" />
            </div>
          ) : (
            <div className="card overflow-hidden" style={{ padding: 0 }}>
              {teams.map((team, i) => (
                <Link
                  key={team.id}
                  to={`/teams/${team.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{
                    borderBottom: i < teams.length - 1 ? '1px solid var(--surface-100)' : 'none',
                    background: 'white',
                    display: 'flex',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: team.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: 'var(--surface-900)' }}
                    >
                      {team.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--surface-400)' }}
                    >
                      {team._count?.members || 0} members
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: 'var(--surface-100)',
                      color: 'var(--surface-500)',
                    }}
                  >
                    {team._count?.tasks || 0}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskFormModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSuccess={load}
      />
    </div>
  )
}
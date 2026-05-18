import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { teamsApi, tasksApi } from '../services/api'
import { LoadingPage, EmptyState, Avatar } from '../components/ui/index.jsx'
import TaskCard from '../components/TaskCard'
import TaskFormModal from '../components/TaskFormModal'
import TaskDetailModal from '../components/TaskDetailModal'
import TeamFormModal from '../components/TeamFormModal'
import Modal from '../components/Modal'
import useAuthStore from '../context/authStore'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

/* ── Stat Pill ── */
function StatPill({ value, label, color }) {
  return (
    <div className="text-center px-4 py-3">
      <p className="text-xl font-bold tracking-tight" style={{ color }}>
        {value}
      </p>
      <p className="text-xs mt-0.5" style={{ color: 'var(--surface-400)' }}>
        {label}
      </p>
    </div>
  )
}

export default function TeamDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [team, setTeam]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('tasks')

  const [taskCreateOpen, setTaskCreateOpen]   = useState(false)
  const [editTask, setEditTask]               = useState(null)
  const [detailTaskId, setDetailTaskId]       = useState(null)
  const [editTeamOpen, setEditTeamOpen]       = useState(false)
  const [memberModalOpen, setMemberModalOpen] = useState(false)
  const [memberEmail, setMemberEmail]         = useState('')
  const [memberRole, setMemberRole]           = useState('MEMBER')
  const [addingMember, setAddingMember]       = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await teamsApi.getOne(id)
      setTeam(data.team)
    } catch {
      toast.error('Team not found')
      navigate('/teams')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const isOwner = team?.owner?.id === user?.id
  const isAdmin = isOwner || team?.members?.find(m => m.user?.id === user?.id)?.role === 'ADMIN'

  const handleStatusChange = async (taskId, status) => {
    try {
      const { data } = await tasksApi.update(taskId, { status })
      setTeam(t => ({
        ...t,
        tasks: t.tasks.map(task => task.id === taskId ? { ...task, ...data.task } : task),
      }))
      toast.success('Updated')
    } catch {
      toast.error('Update failed')
    }
  }

  const handleTaskSaved = (savedTask) => {
    setTeam(t => ({
      ...t,
      tasks: t.tasks.find(task => task.id === savedTask.id)
        ? t.tasks.map(task => task.id === savedTask.id ? savedTask : task)
        : [savedTask, ...t.tasks],
    }))
  }

  const handleTaskDeleted = (taskId) => {
    setTeam(t => ({ ...t, tasks: t.tasks.filter(task => task.id !== taskId) }))
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!memberEmail.trim()) return
    setAddingMember(true)
    try {
      await teamsApi.manageMembers(id, { email: memberEmail, role: memberRole, action: 'add' })
      toast.success('Member added!')
      setMemberEmail('')
      setMemberModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.message || 'Failed to add member')
    } finally {
      setAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberUserId, memberName) => {
    if (!confirm(`Remove ${memberName} from the team?`)) return
    try {
      const member = team.members.find(m => m.user?.id === memberUserId)
      await teamsApi.manageMembers(id, { email: member.user.email, action: 'remove' })
      toast.success(`${memberName} removed`)
      load()
    } catch (err) {
      toast.error(err.message || 'Failed to remove member')
    }
  }

  const handleDeleteTeam = async () => {
    if (!confirm(`Delete "${team.name}"? This cannot be undone.`)) return
    try {
      await teamsApi.delete(id)
      toast.success('Team deleted')
      navigate('/teams')
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  if (loading) return <LoadingPage />
  if (!team)   return null

  const taskStats = {
    pending:    team.tasks?.filter(t => t.status === 'PENDING').length    || 0,
    inProgress: team.tasks?.filter(t => t.status === 'IN_PROGRESS').length || 0,
    completed:  team.tasks?.filter(t => t.status === 'COMPLETED').length  || 0,
  }

  return (
    <div className="page animate-fade-up">

      {/* Breadcrumb */}
      <div
        className="flex items-center gap-2 text-xs mb-5 font-medium"
        style={{ color: 'var(--surface-400)' }}
      >
        <Link
          to="/teams"
          className="transition-colors hover:text-[var(--surface-700)]"
        >
          Teams
        </Link>
        <span style={{ color: 'var(--surface-300)' }}>/</span>
        <span style={{ color: 'var(--surface-700)' }}>{team.name}</span>
      </div>

      {/* Team Header */}
      <div className="card p-6 mb-5">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex-shrink-0"
              style={{ backgroundColor: team.color, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <div>
              <h1 className="page-title">{team.name}</h1>
              {team.description && (
                <p
                  className="mt-0.5 text-sm"
                  style={{ color: 'var(--surface-500)' }}
                >
                  {team.description}
                </p>
              )}
              <p
                className="text-xs mt-1.5"
                style={{ color: 'var(--surface-400)' }}
              >
                Created {format(new Date(team.createdAt), 'MMM d, yyyy')} by{' '}
                <span style={{ color: 'var(--surface-600)', fontWeight: 500 }}>
                  {team.owner?.name}
                </span>
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditTeamOpen(true)} className="btn-secondary">
                Edit
              </button>
              <button onClick={handleDeleteTeam} className="btn-danger">
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div
          className="flex flex-wrap gap-1 mt-5 pt-5"
          style={{ borderTop: '1px solid var(--surface-100)' }}
        >
          <StatPill value={team.tasks?.length || 0}  label="Total"      color="var(--surface-800)" />
          <StatPill value={taskStats.pending}         label="Pending"    color="#d97706" />
          <StatPill value={taskStats.inProgress}      label="In Progress" color="#2563eb" />
          <StatPill value={taskStats.completed}       label="Completed"  color="#16a34a" />
          <StatPill value={team.members?.length || 0} label="Members"    color="var(--surface-800)" />
        </div>
      </div>

      {/* Tab Bar */}
      <div className="tab-bar mb-5">
        {['tasks', 'members'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'tab-item-active' : 'tab-item'}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}{' '}
            <span style={{ opacity: 0.55 }}>
              ({tab === 'tasks' ? team.tasks?.length || 0 : team.members?.length || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-label">Team Tasks</h2>
            <button onClick={() => setTaskCreateOpen(true)} className="btn-primary">
              + Add Task
            </button>
          </div>

          {!team.tasks?.length ? (
            <EmptyState
              icon="✓"
              title="No tasks yet"
              description="Add the first task to this team"
              action={
                <button onClick={() => setTaskCreateOpen(true)} className="btn-primary">
                  + Create Task
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {team.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={{ ...task, team: { id: team.id, name: team.name, color: team.color } }}
                  onClick={(t) => setDetailTaskId(t.id)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-label">Team Members</h2>
            {isAdmin && (
              <button onClick={() => setMemberModalOpen(true)} className="btn-primary">
                + Add Member
              </button>
            )}
          </div>

          <div className="card overflow-hidden" style={{ padding: 0 }}>
            {/* Owner */}
            <div
              className="p-4 flex items-center justify-between"
              style={{ borderBottom: team.members?.length ? '1px solid var(--surface-100)' : 'none' }}
            >
              <div className="flex items-center gap-3">
                <Avatar name={team.owner?.name} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--surface-900)' }}>
                    {team.owner?.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--surface-400)' }}>
                    {team.owner?.email}
                  </p>
                </div>
              </div>
              <span
                className="badge"
                style={{
                  background: 'var(--brand-50)',
                  color: 'var(--brand-700)',
                  border: '1px solid var(--brand-100)',
                }}
              >
                Owner
              </span>
            </div>

            {team.members
              ?.filter(m => m.user?.id !== team.owner?.id)
              .map((m, i, arr) => (
                <div
                  key={m.id}
                  className="p-4 flex items-center justify-between group"
                  style={{
                    borderBottom: i < arr.length - 1 ? '1px solid var(--surface-100)' : 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={m.user?.name} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--surface-900)' }}>
                        {m.user?.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--surface-400)' }}>
                        {m.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="badge"
                      style={m.role === 'ADMIN'
                        ? { background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }
                        : { background: 'var(--surface-100)', color: 'var(--surface-600)', border: '1px solid var(--surface-200)' }
                      }
                    >
                      {m.role}
                    </span>
                    {isAdmin && m.user?.id !== user?.id && (
                      <button
                        onClick={() => handleRemoveMember(m.user?.id, m.user?.name)}
                        className="opacity-0 group-hover:opacity-100 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          color: 'var(--danger-text)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        title="Add Member"
        description="Invite a team member by email address."
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="input"
              autoFocus
            />
          </div>
          <div>
            <label className="label">Role</label>
            <select
              value={memberRole}
              onChange={(e) => setMemberRole(e.target.value)}
              className="input"
              style={{ cursor: 'pointer' }}
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <button type="button" onClick={() => setMemberModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={addingMember} className="btn-primary">
              {addingMember ? 'Adding…' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>

      <TaskFormModal
        isOpen={taskCreateOpen}
        onClose={() => setTaskCreateOpen(false)}
        onSuccess={handleTaskSaved}
        defaultTeamId={id}
      />
      <TaskFormModal
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        onSuccess={handleTaskSaved}
        task={editTask}
      />
      <TaskDetailModal
        isOpen={!!detailTaskId}
        onClose={() => setDetailTaskId(null)}
        taskId={detailTaskId}
        onEdit={(t) => { setDetailTaskId(null); setEditTask(t) }}
        onDeleted={handleTaskDeleted}
      />
      <TeamFormModal
        isOpen={editTeamOpen}
        onClose={() => setEditTeamOpen(false)}
        onSuccess={(t) => setTeam(prev => ({ ...prev, ...t }))}
        team={team}
      />
    </div>
  )
}
import { useState, useEffect, useCallback } from 'react'
import { tasksApi, teamsApi } from '../services/api.js'
import TaskCard from '../components/Taskcard.jsx'
import TaskFormModal from '../components/Taskformmodal.jsx'
import TaskDetailModal from '../components/Taskdetailmodal.jsx'
import { LoadingPage, EmptyState, Spinner } from '../components/ui/index.jsx'
import toast from 'react-hot-toast'

export default function Tasks() {
  const [tasks, setTasks]           = useState([])
  const [teams, setTeams]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [pagination, setPagination] = useState({})

  const [search, setSearch]   = useState('')
  const [filters, setFilters] = useState({ teamId: '', assigneeId: '', status: '', priority: '' })

  const [createOpen, setCreateOpen]     = useState(false)
  const [editTask, setEditTask]         = useState(null)
  const [detailTaskId, setDetailTaskId] = useState(null)

  useEffect(() => {
    teamsApi.getAll().then(({ data }) => setTeams(data.teams || [])).catch(() => {})
  }, [])

  const loadTasks = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const { data } = await tasksApi.getAll({ ...filters, search, ...params })
      setTasks(data.tasks)
      setPagination(data.pagination)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [filters, search])

  useEffect(() => {
    const timer = setTimeout(() => loadTasks(), 300)
    return () => clearTimeout(timer)
  }, [loadTasks])

  const handleStatusChange = async (taskId, status) => {
    try {
      const { data } = await tasksApi.update(taskId, { status })
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...data.task } : t))
      toast.success(`Marked as ${status.replace('_', ' ').toLowerCase()}`)
    } catch {
      toast.error('Update failed')
    }
  }

  const handleTaskDeleted = (taskId) => setTasks(prev => prev.filter(t => t.id !== taskId))

  const handleTaskSaved = (savedTask) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === savedTask.id)
      if (exists) return prev.map(t => t.id === savedTask.id ? savedTask : t)
      return [savedTask, ...prev]
    })
  }

  const clearFilters = () => {
    setSearch('')
    setFilters({ teamId: '', assigneeId: '', status: '', priority: '' })
  }

  const hasFilters = search || Object.values(filters).some(Boolean)

  return (
    <div className="page animate-fade-up">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">
            {pagination.total ?? 0} task{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary">
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div
        className="card mb-5"
        style={{ padding: '14px 16px' }}
      >
        <div className="flex flex-col lg:flex-row gap-2.5">
          {/* Search */}
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--surface-400)' }}
              width="14" height="14" viewBox="0 0 14 14" fill="none"
            >
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              placeholder="Search tasks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '34px' }}
            />
          </div>

          <select
            value={filters.teamId}
            onChange={(e) => setFilters(f => ({ ...f, teamId: e.target.value }))}
            className="input"
            style={{ width: 'auto', minWidth: '140px', cursor: 'pointer' }}
          >
            <option value="">All teams</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            className="input"
            style={{ width: 'auto', minWidth: '130px', cursor: 'pointer' }}
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
            className="input"
            style={{ width: 'auto', minWidth: '120px', cursor: 'pointer' }}
          >
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className="btn-ghost whitespace-nowrap">
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Task grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon="✓"
          title={hasFilters ? 'No tasks match your filters' : 'No tasks yet'}
          description={
            hasFilters
              ? 'Try adjusting your search or filters'
              : 'Create your first task to get started'
          }
          action={!hasFilters && (
            <button onClick={() => setCreateOpen(true)} className="btn-primary">
              + Create Task
            </button>
          )}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={(t) => setDetailTaskId(t.id)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
          {pagination.totalPages > 1 && (
            <p
              className="text-center text-sm mt-8"
              style={{ color: 'var(--surface-400)' }}
            >
              Showing {tasks.length} of {pagination.total} tasks
            </p>
          )}
        </>
      )}

      <TaskFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleTaskSaved}
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
    </div>
  )
}
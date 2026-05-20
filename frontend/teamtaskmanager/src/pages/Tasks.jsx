import { useState, useEffect, useCallback } from 'react'
import { tasksApi, teamsApi } from '../services/api.js'
import TaskCard from '../components/Taskcard.jsx'
import TaskFormModal from '../components/Taskformmodal.jsx'
import TaskDetailModal from '../components/Taskdetailmodal.jsx'
import { LoadingPage, EmptyState, Spinner } from '../components/ui/index.jsx'
import toast from 'react-hot-toast'

// ── Style objects ────────────────────────────────────────────────────────────

const styles = {
  page: {
    padding: '28px 32px',
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%',
    animation: 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#14142a',           // --surface-900
    letterSpacing: '-0.03em',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    margin: 0,
  },
  pageSubtitle: {
    fontSize: '13px',
    color: '#6e6e88',           // --surface-500
    marginTop: '2px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontWeight: 600,
    fontSize: '13px',
    letterSpacing: '-0.01em',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 120ms cubic-bezier(0.16,1,0.3,1)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    borderRadius: '12px',
    padding: '0 14px',
    height: '36px',
    background: '#5048e5',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(101,96,240,0.28), inset 0 1px 0 rgba(255,255,255,0.12)',
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontWeight: 600,
    fontSize: '13px',
    letterSpacing: '-0.01em',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 120ms cubic-bezier(0.16,1,0.3,1)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    borderRadius: '12px',
    padding: '0 14px',
    height: '36px',
    background: 'transparent',
    color: '#505068',           // --surface-600
  },
  filterCard: {
    background: 'white',
    border: '1px solid #e8e8f2',  // --surface-150
    borderRadius: '16px',
    boxShadow: '0 1px 4px rgba(20,20,42,0.06), 0 0 0 1px rgba(20,20,42,0.04)',
    padding: '14px 16px',
    marginBottom: '20px',
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  searchWrapper: {
    flex: 1,
    position: 'relative',
    minWidth: '180px',
  },
  searchIcon: {
    position: 'absolute',
    left: '11px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: '#9898b0',           // --surface-400
  },
  input: {
    width: '100%',
    padding: '9px 13px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: '13.5px',
    color: '#14142a',
    background: 'white',
    border: '1.5px solid #dddde8',
    borderRadius: '12px',
    outline: 'none',
    lineHeight: 1.5,
    transition: 'all 120ms cubic-bezier(0.16,1,0.3,1)',
    boxSizing: 'border-box',
  },
  inputSearch: {
    width: '100%',
    padding: '9px 13px 9px 34px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: '13.5px',
    color: '#14142a',
    background: 'white',
    border: '1.5px solid #dddde8',
    borderRadius: '12px',
    outline: 'none',
    lineHeight: 1.5,
    transition: 'all 120ms cubic-bezier(0.16,1,0.3,1)',
    boxSizing: 'border-box',
  },
  select: {
    padding: '9px 13px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: '13.5px',
    color: '#14142a',
    background: 'white',
    border: '1.5px solid #dddde8',
    borderRadius: '12px',
    outline: 'none',
    lineHeight: 1.5,
    transition: 'all 120ms cubic-bezier(0.16,1,0.3,1)',
    boxSizing: 'border-box',
    cursor: 'pointer',
    minWidth: '130px',
  },
  taskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  spinnerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '64px',
    paddingBottom: '64px',
  },
  paginationText: {
    textAlign: 'center',
    fontSize: '13px',
    marginTop: '32px',
    color: '#9898b0',           // --surface-400
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
}

// ── Focus / hover helpers ────────────────────────────────────────────────────

function onFocus(e) {
  e.target.style.borderColor = '#817dfc'
  e.target.style.boxShadow = '0 0 0 3px rgba(101,96,240,0.10)'
}
function onBlur(e) {
  e.target.style.borderColor = '#dddde8'
  e.target.style.boxShadow = 'none'
}

// ── Component ────────────────────────────────────────────────────────────────

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
    <div style={styles.page}>

      {/* ── Header ── */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>My Tasks</h1>
          <p style={styles.pageSubtitle}>
            {pagination.total ?? 0} task{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          style={styles.btnPrimary}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#4037c8'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(101,96,240,0.35)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#5048e5'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(101,96,240,0.28)'
          }}
        >
          + New Task
        </button>
      </div>

      {/* ── Filters ── */}
      <div style={styles.filterCard}>
        <div style={styles.filterRow}>

          {/* Search */}
          <div style={styles.searchWrapper}>
            <svg
              style={styles.searchIcon}
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
              style={styles.inputSearch}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          {/* Team filter */}
          <select
            value={filters.teamId}
            onChange={(e) => setFilters(f => ({ ...f, teamId: e.target.value }))}
            style={{ ...styles.select, minWidth: '140px' }}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="">All teams</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          {/* Status filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            style={{ ...styles.select, minWidth: '130px' }}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Priority filter */}
          <select
            value={filters.priority}
            onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
            style={{ ...styles.select, minWidth: '120px' }}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              style={styles.btnGhost}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f0f0f8'
                e.currentTarget.style.color = '#22223a'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#505068'
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Task grid / empty / loading ── */}
      {loading ? (
        <div style={styles.spinnerWrapper}>
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
            <button
              onClick={() => setCreateOpen(true)}
              style={styles.btnPrimary}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#4037c8'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#5048e5'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              + Create Task
            </button>
          )}
        />
      ) : (
        <>
          <div style={styles.taskGrid}>
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
            <p style={styles.paginationText}>
              Showing {tasks.length} of {pagination.total} tasks
            </p>
          )}
        </>
      )}

      {/* ── Modals ── */}
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
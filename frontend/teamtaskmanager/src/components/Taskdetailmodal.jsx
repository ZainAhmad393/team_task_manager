import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Modal from './Modal'
import { StatusBadge, PriorityBadge, Avatar, Spinner } from './ui/index.jsx'
import { tasksApi } from '../services/api'
import useAuthStore from '../context/Authstore.js'
import toast from 'react-hot-toast'

/* ── Meta Cell ── */
function MetaCell({ label, children }) {
  return (
    <div
      className="rounded-xl p-3.5"
      style={{
        background: 'var(--surface-50)',
        border: '1px solid var(--surface-150)',
      }}
    >
      <p
        className="text-[10.5px] font-bold uppercase tracking-wider mb-2"
        style={{ color: 'var(--surface-400)' }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}

export default function TaskDetailModal({
  isOpen, onClose, taskId, onEdit, onDeleted,
}) {
  const [task, setTask]         = useState(null)
  const [loading, setLoading]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    if (!isOpen || !taskId) return
    setLoading(true)
    setTask(null)
    tasksApi.getOne(taskId)
      .then(({ data }) => setTask(data.task))
      .catch(() => toast.error('Failed to load task'))
      .finally(() => setLoading(false))
  }, [isOpen, taskId])

  const handleDelete = async () => {
    if (!confirm('Delete this task? This action cannot be undone.')) return
    setDeleting(true)
    try {
      await tasksApi.delete(task.id)
      toast.success('Task deleted')
      onDeleted?.(task.id)
      onClose()
    } catch (err) {
      toast.error(err.message || 'Delete failed')
      setDeleting(false)
    }
  }

  const canDelete =
    task &&
    (task.creator?.id === user?.id ||
      task.team?.ownerId === user?.id ||
      user?.role === 'ADMIN')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      size="lg"
      footer={
        task ? (
          <div className="flex items-center justify-between">
            <div>
              {canDelete && (
                <button onClick={handleDelete} disabled={deleting} className="btn-danger">
                  {deleting ? 'Deleting…' : 'Delete Task'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <button onClick={onClose} className="btn-secondary">Close</button>
              <button
                onClick={() => { onEdit?.(task); onClose() }}
                className="btn-primary"
              >
                Edit Task
              </button>
            </div>
          </div>
        ) : null
      }
    >
      {loading ? (
        <div className="flex justify-center py-14">
          <Spinner size="lg" />
        </div>
      ) : !task ? (
        <p
          className="text-center py-10 text-sm"
          style={{ color: 'var(--surface-400)' }}
        >
          Task not found
        </p>
      ) : (
        <div className="space-y-5">

          {/* Header */}
          <div>
            <div className="flex items-start gap-2 mb-2.5">
              <h3
                className="flex-1 text-[17px] font-bold tracking-tight leading-snug"
                style={{ color: 'var(--surface-900)' }}
              >
                {task.title}
              </h3>
              <PriorityBadge priority={task.priority} />
            </div>
            <StatusBadge status={task.status} />
          </div>

          {/* Description */}
          {task.description && (
            <div
              className="rounded-xl p-4"
              style={{
                background: 'var(--surface-50)',
                border: '1px solid var(--surface-150)',
              }}
            >
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: 'var(--surface-700)' }}
              >
                {task.description}
              </p>
            </div>
          )}

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            <MetaCell label="Team">
              {task.team ? (
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: task.team.color }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--surface-900)' }}
                  >
                    {task.team.name}
                  </span>
                </div>
              ) : (
                <span className="text-sm" style={{ color: 'var(--surface-400)' }}>—</span>
              )}
            </MetaCell>

            <MetaCell label="Due Date">
              <span
                className="text-sm font-semibold"
                style={{ color: 'var(--surface-900)' }}
              >
                {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '—'}
              </span>
            </MetaCell>

            <MetaCell label="Assigned To">
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar name={task.assignee.name} size="sm" />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--surface-900)' }}
                  >
                    {task.assignee.name}
                  </span>
                </div>
              ) : (
                <span className="text-sm" style={{ color: 'var(--surface-400)' }}>Unassigned</span>
              )}
            </MetaCell>

            <MetaCell label="Created By">
              {task.creator ? (
                <div className="flex items-center gap-2">
                  <Avatar name={task.creator.name} size="sm" />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--surface-900)' }}
                  >
                    {task.creator.name}
                  </span>
                </div>
              ) : (
                <span className="text-sm" style={{ color: 'var(--surface-400)' }}>—</span>
              )}
            </MetaCell>
          </div>

          {/* Activity */}
          {task.activities?.length > 0 && (
            <div>
              <h4 className="section-label mb-3">Activity</h4>
              <div className="space-y-3 max-h-44 overflow-y-auto pr-1 scrollbar-none">
                {task.activities.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <Avatar name={log.user?.name} size="xs" className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: 'var(--surface-700)' }}
                      >
                        {log.details}
                      </p>
                      <p
                        className="text-[11px] mt-0.5"
                        style={{ color: 'var(--surface-400)' }}
                      >
                        {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <p
            className="text-xs pt-3"
            style={{
              color: 'var(--surface-400)',
              borderTop: '1px solid var(--surface-100)',
            }}
          >
            Created {format(new Date(task.createdAt), 'MMMM d, yyyy')}
            {task.updatedAt !== task.createdAt && (
              <> · Updated {format(new Date(task.updatedAt), 'MMM d')}</>
            )}
          </p>
        </div>
      )}
    </Modal>
  )
}
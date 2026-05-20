import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Modal from './Modal'
import { StatusBadge, PriorityBadge, Avatar, Spinner } from './ui/index.jsx'
import { tasksApi } from '../services/api'
import useAuthStore from '../context/Authstore.js'
import toast from 'react-hot-toast'

function MetaCell({ label, children }) {
  return (
    <div style={{
      borderRadius: 12, padding: 14,
      background: 'var(--surface-50)',
      border: '1px solid var(--surface-150)',
    }}>
      <p style={{
        fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.06em', color: 'var(--surface-400)',
        margin: '0 0 8px',
      }}>
        {label}
      </p>
      {children}
    </div>
  )
}

export default function TaskDetailModal({ isOpen, onClose, taskId, onEdit, onDeleted }) {
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

  const canDelete = task && (
    task.creator?.id === user?.id ||
    task.team?.ownerId === user?.id ||
    user?.role === 'ADMIN'
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      size="lg"
      footer={
        task ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              {canDelete && (
                <button onClick={handleDelete} disabled={deleting} className="btn-danger">
                  {deleting ? 'Deleting…' : 'Delete Task'}
                </button>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={onClose} className="btn-secondary">Close</button>
              <button onClick={() => { onEdit?.(task); onClose() }} className="btn-primary">
                Edit Task
              </button>
            </div>
          </div>
        ) : null
      }
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '56px 0' }}>
          <Spinner size="lg" />
        </div>
      ) : !task ? (
        <p style={{ textAlign: 'center', padding: '40px 0', fontSize: 14, color: 'var(--surface-400)' }}>
          Task not found
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
              <h3 style={{
                flex: 1, fontSize: 17, fontWeight: 700,
                letterSpacing: '-0.02em', lineHeight: 1.3,
                color: 'var(--surface-900)', margin: 0,
              }}>
                {task.title}
              </h3>
              <PriorityBadge priority={task.priority} />
            </div>
            <StatusBadge status={task.status} />
          </div>

          {/* Description */}
          {task.description && (
            <div style={{
              borderRadius: 12, padding: 16,
              background: 'var(--surface-50)',
              border: '1px solid var(--surface-150)',
            }}>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--surface-700)', margin: 0, whiteSpace: 'pre-wrap' }}>
                {task.description}
              </p>
            </div>
          )}

          {/* Meta grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <MetaCell label="Team">
              {task.team ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: task.team.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--surface-900)' }}>{task.team.name}</span>
                </div>
              ) : (
                <span style={{ fontSize: 14, color: 'var(--surface-400)' }}>—</span>
              )}
            </MetaCell>

            <MetaCell label="Due Date">
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--surface-900)' }}>
                {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '—'}
              </span>
            </MetaCell>

            <MetaCell label="Assigned To">
              {task.assignee ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar name={task.assignee.name} size="sm" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--surface-900)' }}>{task.assignee.name}</span>
                </div>
              ) : (
                <span style={{ fontSize: 14, color: 'var(--surface-400)' }}>Unassigned</span>
              )}
            </MetaCell>

            <MetaCell label="Created By">
              {task.creator ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar name={task.creator.name} size="sm" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--surface-900)' }}>{task.creator.name}</span>
                </div>
              ) : (
                <span style={{ fontSize: 14, color: 'var(--surface-400)' }}>—</span>
              )}
            </MetaCell>
          </div>

          {/* Activity */}
          {task.activities?.length > 0 && (
            <div>
              <h4 style={{
                fontSize: 11, fontWeight: 700, color: 'var(--surface-400)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                margin: '0 0 12px',
              }}>Activity</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 176, overflowY: 'auto' }}>
                {task.activities.map((log) => (
                  <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <Avatar name={log.user?.name} size="xs" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--surface-700)', margin: 0 }}>
                        {log.details}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--surface-400)', margin: '2px 0 0' }}>
                        {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <p style={{
            fontSize: 12, color: 'var(--surface-400)',
            paddingTop: 12, borderTop: '1px solid var(--surface-100)',
            margin: 0,
          }}>
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
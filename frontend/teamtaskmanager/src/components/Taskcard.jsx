import { format, isPast, isToday, differenceInDays } from 'date-fns'
import { StatusBadge, PriorityBadge, Avatar } from './ui/index'

/* ── Due date chip ── */
function DueDateChip({ date, status }) {
  if (!date) return null
  const d = new Date(date)
  const overdue  = isPast(d) && status !== 'COMPLETED'
  const dueToday = isToday(d)
  const daysLeft = differenceInDays(d, new Date())

  let color = 'var(--surface-400)'
  let textDecoration = 'none'
  let fontWeight = 400
  let label = format(d, 'MMM d')
  let showAlert = false

  if (status === 'COMPLETED') {
    color = 'var(--surface-300)'
    textDecoration = 'line-through'
  } else if (overdue) {
    color = 'var(--danger-text)'
    fontWeight = 600
    showAlert = true
  } else if (dueToday) {
    color = 'var(--warning-text)'
    fontWeight = 600
    label = 'Today'
  } else if (daysLeft <= 2) {
    color = 'var(--warning-text)'
    fontWeight = 500
  }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11.5, color, textDecoration, fontWeight,
    }}>
      {showAlert && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 16, height: 16, borderRadius: '50%',
          background: 'var(--danger-bg)', color: 'var(--danger-text)',
          fontSize: 9, fontWeight: 700, flexShrink: 0,
        }}>!</span>
      )}
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.5, flexShrink: 0 }}>
        <rect x="1" y="2" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M3 1v2M7 1v2M1 5h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
      <span>{label}</span>
    </span>
  )
}

/* ── TaskCard ── */
export default function TaskCard({ task, onClick, onStatusChange }) {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'COMPLETED'
  const stop = (fn) => (e) => { e.stopPropagation(); fn?.() }

  return (
    <article
      onClick={() => onClick?.(task)}
      style={{
        background: 'white',
        border: `1px solid var(--surface-150)`,
        borderLeft: isOverdue ? '3px solid var(--danger-text)' : '1px solid var(--surface-150)',
        borderRadius: 16,
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        transition: 'all 200ms var(--ease-spring)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--brand-200)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md), 0 0 0 1px var(--brand-100)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isOverdue ? 'var(--danger-text)' : 'var(--surface-150)'
        e.currentTarget.style.borderLeft = isOverdue ? '3px solid var(--danger-text)' : '1px solid var(--surface-150)'
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Row 1: Team + Priority */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          {task.team && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: task.team.color || 'var(--brand-500)',
              }} />
              <span style={{
                fontSize: 11, fontWeight: 600, color: 'var(--surface-500)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100,
              }}>
                {task.team.name}
              </span>
            </span>
          )}
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Row 2: Title */}
      <h3 style={{
        fontSize: 14, fontWeight: 600, lineHeight: 1.4, margin: 0,
        color: task.status === 'COMPLETED' ? 'var(--surface-400)' : 'var(--surface-900)',
        textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
        display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden', wordBreak: 'break-word',
      }}>
        {task.title}
      </h3>

      {/* Row 3: Description */}
      {task.description && (
        <p style={{
          fontSize: 12, lineHeight: 1.5, marginTop: 8,
          color: 'var(--surface-500)',
          display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', wordBreak: 'break-word',
        }}>
          {task.description}
        </p>
      )}

      {/* Spacer */}
      <div style={{ flex: 1, minHeight: 10 }} />

      {/* Row 4: Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        paddingTop: 12, marginTop: 4,
        borderTop: '1px solid var(--surface-100)',
      }}>
        <StatusBadge status={task.status} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DueDateChip date={task.dueDate} status={task.status} />
          {task.assignee && <Avatar name={task.assignee.name} size="xs" title={task.assignee.name} />}
        </div>
      </div>

      {/* Quick Actions */}
      {task.status !== 'COMPLETED' && (
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}
          className="task-quick-actions"
        >
          {task.status === 'PENDING' && (
            <button
              onClick={stop(() => onStatusChange?.(task.id, 'IN_PROGRESS'))}
              style={{
                flex: 1, padding: '6px 0', fontSize: 11.5, fontWeight: 600,
                borderRadius: 8, cursor: 'pointer', border: '1px solid var(--info-border)',
                background: 'var(--info-bg)', color: 'var(--info-text)',
                transition: 'opacity 150ms',
              }}
            >
              Start →
            </button>
          )}
          <button
            onClick={stop(() => onStatusChange?.(task.id, 'COMPLETED'))}
            style={{
              flex: 1, padding: '6px 0', fontSize: 11.5, fontWeight: 600,
              borderRadius: 8, cursor: 'pointer', border: '1px solid var(--success-border)',
              background: 'var(--success-bg)', color: 'var(--success-text)',
              transition: 'opacity 150ms',
            }}
          >
            ✓ Done
          </button>
        </div>
      )}
    </article>
  )
}
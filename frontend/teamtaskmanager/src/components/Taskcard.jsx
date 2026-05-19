import { format, isPast, isToday, differenceInDays } from 'date-fns'
import { StatusBadge, PriorityBadge, Avatar } from './ui/index'

/* ── Due date chip ── */
function DueDateChip({ date, status }) {
  if (!date) return null
  const d = new Date(date)
  const overdue  = isPast(d) && status !== 'COMPLETED'
  const dueToday = isToday(d)
  const daysLeft = differenceInDays(d, new Date())

  let textColor = 'var(--surface-400)'
  let textDecoration = 'none'
  let fontWeight = '400'
  let label = format(d, 'MMM d')
  let icon = null
  let iconBg = null
  let iconColor = null

  if (status === 'COMPLETED') {
    textColor = 'var(--surface-300)'
    textDecoration = 'line-through'
  } else if (overdue) {
    textColor = 'var(--danger-text)'
    fontWeight = '600'
    iconBg = 'var(--danger-bg)'
    iconColor = 'var(--danger-text)'
    icon = (
      <span 
        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold flex-shrink-0"
        style={{
          backgroundColor: iconBg,
          color: iconColor,
        }}
      >
        !
      </span>
    )
  } else if (dueToday) {
    textColor = 'var(--warning-text)'
    fontWeight = '600'
    label = 'Today'
  } else if (daysLeft <= 2) {
    textColor = 'var(--warning-text)'
    fontWeight = '500'
  }

  return (
    <span 
      className="inline-flex items-center gap-1 text-[11.5px]"
      style={{
        color: textColor,
        textDecoration,
        fontWeight,
      }}
    >
      {icon}
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-50 flex-shrink-0">
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
      className="card-interactive flex flex-col"
      style={{
        borderLeft: isOverdue ? '3px solid var(--danger-text)' : undefined,
        padding: '16px',
        gap: '0',
      }}
    >
      {/* ── Row 1: Priority + Team tag ── */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {task.team && (
            <span className="inline-flex items-center gap-1 flex-shrink-0">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: task.team.color || 'var(--brand-500)' }}
              />
              <span
                className="text-[11px] font-semibold truncate max-w-[100px]"
                style={{ color: 'var(--surface-500)' }}
              >
                {task.team.name}
              </span>
            </span>
          )}
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* ── Row 2: Title ── */}
      <h3
        className="text-sm font-semibold leading-snug mb-0"
        style={{
          color: task.status === 'COMPLETED' ? 'var(--surface-400)' : 'var(--surface-900)',
          textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
          /* Critical: prevent overflow into description */
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          wordBreak: 'break-word',
          minHeight: 0,
        }}
      >
        {task.title}
      </h3>

      {/* ── Row 3: Description (separate, below title) ── */}
      {task.description && (
        <p
          className="text-xs leading-relaxed mt-2"
          style={{
            color: 'var(--surface-500)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {task.description}
        </p>
      )}

      {/* ── Spacer ── */}
      <div className="flex-1 min-h-[10px]" />

      {/* ── Row 4: Footer ── */}
      <div
        className="flex items-center justify-between gap-2 pt-3 mt-1"
        style={{ borderTop: '1px solid var(--surface-100)' }}
      >
        <StatusBadge status={task.status} />

        <div className="flex items-center gap-2">
          <DueDateChip date={task.dueDate} status={task.status} />
          {task.assignee && (
            <Avatar name={task.assignee.name} size="xs" title={task.assignee.name} />
          )}
        </div>
      </div>

      {/* ── Quick Actions (hover, only if not completed) ── */}
      {task.status !== 'COMPLETED' && (
        <div
          className="flex gap-1.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-all duration-150"
          style={{ marginTop: '10px' }}
        >
          {task.status === 'PENDING' && (
            <button
              onClick={stop(() => onStatusChange?.(task.id, 'IN_PROGRESS'))}
              className="flex-1 py-1.5 text-[11.5px] font-semibold rounded-lg transition-colors"
              style={{
                background: 'var(--info-bg)',
                color: 'var(--info-text)',
                border: '1px solid var(--info-border)',
              }}
            >
              Start →
            </button>
          )}
          <button
            onClick={stop(() => onStatusChange?.(task.id, 'COMPLETED'))}
            className="flex-1 py-1.5 text-[11.5px] font-semibold rounded-lg transition-colors"
            style={{
              background: 'var(--success-bg)',
              color: 'var(--success-text)',
              border: '1px solid var(--success-border)',
            }}
          >
            ✓ Done
          </button>
        </div>
      )}
    </article>
  )
}
/* ─────────────────────────────────────────────────────────
   Enterprise UI Primitives
   Badges · Spinners · Empty States · Skeletons · Avatars
   ───────────────────────────────────────────────────────── */

/* ── Status config ── */
export const STATUS_CONFIG = {
  PENDING:     { label: 'Pending',     cls: 'status-pending',   dot: 'bg-amber-400' },
  IN_PROGRESS: { label: 'In Progress', cls: 'status-progress',  dot: 'bg-blue-500' },
  COMPLETED:   { label: 'Completed',   cls: 'status-completed', dot: 'bg-emerald-500' },
}

/* ── Priority config ── */
export const PRIORITY_CONFIG = {
  LOW:    { label: 'Low',    cls: 'priority-low',    icon: '↓' },
  MEDIUM: { label: 'Medium', cls: 'priority-medium', icon: '→' },
  HIGH:   { label: 'High',   cls: 'priority-high',   icon: '↑' },
  URGENT: { label: 'Urgent', cls: 'priority-urgent', icon: '⚠' },
}

/* ─── StatusBadge ─── */
export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  return (
    <span className={cfg.cls}>
      <span className={`badge-dot ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

/* ─── PriorityBadge ─── */
export function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM
  return (
    <span className={cfg.cls}>
      <span className="font-mono text-[10px] opacity-70">{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}

/* ─── Spinner ─── */
export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    xs: 'w-3.5 h-3.5 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-6 h-6 border-2',
    xl: 'w-8 h-8 border-2',
  }
  return (
    <div
      className={`
        ${sizes[size]}
        border-surface-200 border-t-brand-600
        rounded-full animate-spin flex-shrink-0
        ${className}
      `}
    />
  )
}

/* ─── LoadingPage ─── */
export function LoadingPage() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="xl" />
        <p className="text-sm text-surface-400 font-medium">Loading…</p>
      </div>
    </div>
  )
}

/* ─── PageSpinner (full screen) ─── */
export function PageSpinner() {
  return (
    <div className="fixed inset-0 bg-surface-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-sm font-bold">TF</span>
        </div>
        <Spinner size="lg" />
      </div>
    </div>
  )
}

/* ─── EmptyState ─── */
export function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div className={`empty-state ${className}`}>
      {icon && (
        <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center text-2xl mb-4 text-surface-400">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-surface-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-surface-400 max-w-xs leading-relaxed mb-5">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}

/* ─── Skeleton primitives ─── */
export function SkeletonLine({ className = 'h-4 w-full' }) {
  return <div className={`skeleton ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <SkeletonLine className="h-4 w-3/4" />
      <SkeletonLine className="h-3 w-full" />
      <SkeletonLine className="h-3 w-2/3" />
      <div className="flex gap-2 pt-1">
        <SkeletonLine className="h-6 w-16 rounded-full" />
        <SkeletonLine className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonTaskRow() {
  return (
    <div className="card px-4 py-3 flex items-center gap-4">
      <SkeletonLine className="h-2 w-2 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <SkeletonLine className="h-3.5 w-1/2" />
        <SkeletonLine className="h-3 w-1/4" />
      </div>
      <SkeletonLine className="h-6 w-16 rounded-full" />
    </div>
  )
}

/* ─── Avatar ───
   IMPORTANT: Avatar background colors are mapped via inline style (not dynamic
   Tailwind classes) so they are never purged in production builds.
*/
const AVATAR_PALETTE = [
  '#7c3aed', // violet
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f97316', // orange
  '#f43f5e', // rose
  '#06b6d4', // cyan
  '#d946ef', // fuchsia
  '#14b8a6', // teal
]

export function Avatar({ name, size = 'md', className = '' }) {
  const bg = name
    ? AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length]
    : '#c4c4d4'

  const sizes = {
    xs:   'w-6 h-6 text-[10px]',
    sm:   'w-7 h-7 text-xs',
    md:   'w-8 h-8 text-sm',
    lg:   'w-9 h-9 text-sm',
    xl:   'w-10 h-10 text-base',
    '2xl':'w-12 h-12 text-lg',
  }

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full flex items-center justify-center
        text-white font-semibold flex-shrink-0 select-none
        ${className}
      `}
      style={{ backgroundColor: bg }}
      title={name}
    >
      {name?.charAt(0).toUpperCase() ?? '?'}
    </div>
  )
}

/* ─── AvatarGroup ─── */
export function AvatarGroup({ users = [], max = 4 }) {
  const visible = users.slice(0, max)
  const overflow = users.length - max
  return (
    <div className="flex -space-x-2">
      {visible.map((u, i) => (
        <div key={u?.id ?? i} className="ring-2 ring-white rounded-full">
          <Avatar name={u?.name ?? u} size="sm" />
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-7 h-7 bg-surface-100 text-surface-600 rounded-full ring-2 ring-white flex items-center justify-center text-xs font-semibold">
          +{overflow}
        </div>
      )}
    </div>
  )
}
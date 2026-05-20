/* ─────────────────────────────────────────────────────────
   Enterprise UI Primitives — Production Safe (Inline Styles)
   Badges · Spinners · Empty States · Skeletons · Avatars
   ───────────────────────────────────────────────────────── */

/* ─── StatusBadge ─── */
export function StatusBadge({ status }) {
  const styles = {
    PENDING: {
      label: 'Pending',
      background: 'var(--warning-bg)',
      color: 'var(--warning-text)',
      border: '1px solid var(--warning-border)',
      dotColor: '#f59e0b',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      background: 'var(--info-bg)',
      color: 'var(--info-text)',
      border: '1px solid var(--info-border)',
      dotColor: '#3b82f6',
    },
    COMPLETED: {
      label: 'Completed',
      background: 'var(--success-bg)',
      color: 'var(--success-text)',
      border: '1px solid var(--success-border)',
      dotColor: '#10b981',
    },
  }
  const cfg = styles[status] || styles.PENDING
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', fontSize: 11.5, fontWeight: 600,
      borderRadius: 99, whiteSpace: 'nowrap',
      background: cfg.background, color: cfg.color, border: cfg.border,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: cfg.dotColor, flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  )
}

/* ─── PriorityBadge ─── */
export function PriorityBadge({ priority }) {
  const styles = {
    LOW: {
      label: 'Low', icon: '↓',
      background: 'var(--surface-100)', color: 'var(--surface-500)',
      border: '1px solid var(--surface-200)',
    },
    MEDIUM: {
      label: 'Medium', icon: '→',
      background: 'var(--info-bg)', color: 'var(--info-text)',
      border: '1px solid var(--info-border)',
    },
    HIGH: {
      label: 'High', icon: '↑',
      background: 'var(--warning-bg)', color: 'var(--warning-text)',
      border: '1px solid var(--warning-border)',
    },
    URGENT: {
      label: 'Urgent', icon: '⚠',
      background: 'var(--danger-bg)', color: 'var(--danger-text)',
      border: '1px solid var(--danger-border)',
    },
  }
  const cfg = styles[priority] || styles.MEDIUM
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', fontSize: 11.5, fontWeight: 600,
      borderRadius: 99, whiteSpace: 'nowrap',
      background: cfg.background, color: cfg.color, border: cfg.border,
    }}>
      <span style={{ fontFamily: 'monospace', fontSize: 10, opacity: 0.7 }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}

/* ─── Spinner ─── */
export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    xs: { width: 14, height: 14, borderWidth: 1.5 },
    sm: { width: 16, height: 16, borderWidth: 2 },
    md: { width: 20, height: 20, borderWidth: 2 },
    lg: { width: 24, height: 24, borderWidth: 2 },
    xl: { width: 32, height: 32, borderWidth: 2 },
  }
  const s = sizes[size] || sizes.md
  return (
    <div
      className={className}
      style={{
        width: s.width, height: s.height,
        borderRadius: '50%',
        border: `${s.borderWidth}px solid var(--surface-200)`,
        borderTopColor: 'var(--brand-600)',
        animation: 'spin 0.8s linear infinite',
        flexShrink: 0,
      }}
    />
  )
}

/* ─── LoadingPage ─── */
export function LoadingPage() {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Spinner size="xl" />
        <p style={{ fontSize: 14, color: 'var(--surface-400)', fontWeight: 500 }}>Loading…</p>
      </div>
    </div>
  )
}

/* ─── PageSpinner ─── */
export function PageSpinner() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--surface-50)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 40, height: 40,
          background: 'var(--brand-600)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>TF</span>
        </div>
        <Spinner size="lg" />
      </div>
    </div>
  )
}

/* ─── EmptyState ─── */
export function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '64px 24px',
    }}>
      {icon && (
        <div style={{
          width: 56, height: 56,
          background: 'var(--surface-100)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, marginBottom: 16,
          color: 'var(--surface-400)',
        }}>
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--surface-700)', marginBottom: 4 }}>
        {title}
      </h3>
      {description && (
        <p style={{
          fontSize: 14, color: 'var(--surface-400)',
          maxWidth: 280, lineHeight: 1.6, marginBottom: 20,
        }}>
          {description}
        </p>
      )}
      {action}
    </div>
  )
}

/* ─── Skeleton ─── */
export function SkeletonLine({ style = {} }) {
  return (
    <div style={{
      height: 16, width: '100%', borderRadius: 6,
      background: 'var(--surface-100)',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  )
}

export function SkeletonCard() {
  return (
    <div style={{
      background: 'white', border: '1px solid var(--surface-150)',
      borderRadius: 16, boxShadow: 'var(--shadow-sm)',
      padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <SkeletonLine style={{ width: '75%' }} />
      <SkeletonLine />
      <SkeletonLine style={{ width: '66%' }} />
    </div>
  )
}

/* ─── Avatar ─── */
const AVATAR_PALETTE = [
  '#7c3aed', '#3b82f6', '#10b981', '#f97316',
  '#f43f5e', '#06b6d4', '#d946ef', '#14b8a6',
]

export function Avatar({ name, size = 'md', className = '', title: titleProp }) {
  const bg = name
    ? AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length]
    : '#c4c4d4'

  const sizes = {
    xs:   { width: 24, height: 24, fontSize: 10 },
    sm:   { width: 28, height: 28, fontSize: 12 },
    md:   { width: 32, height: 32, fontSize: 13 },
    lg:   { width: 36, height: 36, fontSize: 13 },
    xl:   { width: 40, height: 40, fontSize: 15 },
    '2xl':{ width: 48, height: 48, fontSize: 18 },
  }
  const s = sizes[size] || sizes.md

  return (
    <div
      className={className}
      title={titleProp || name}
      style={{
        width: s.width, height: s.height, fontSize: s.fontSize,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: bg, color: 'white',
        fontWeight: 600, flexShrink: 0, userSelect: 'none',
      }}
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
    <div style={{ display: 'flex', marginLeft: 8 }}>
      {visible.map((u, i) => (
        <div key={u?.id ?? i} style={{
          marginLeft: i === 0 ? 0 : -8,
          borderRadius: '50%',
          boxShadow: '0 0 0 2px white',
        }}>
          <Avatar name={u?.name ?? u} size="sm" />
        </div>
      ))}
      {overflow > 0 && (
        <div style={{
          width: 28, height: 28,
          background: 'var(--surface-100)',
          color: 'var(--surface-600)',
          borderRadius: '50%',
          boxShadow: '0 0 0 2px white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600,
          marginLeft: -8,
        }}>
          +{overflow}
        </div>
      )}
    </div>
  )
}

/* ─── STATUS_CONFIG / PRIORITY_CONFIG (for backward compat) ─── */
export const STATUS_CONFIG = {
  PENDING:     { label: 'Pending',     cls: 'status-pending',   dot: 'bg-amber-400' },
  IN_PROGRESS: { label: 'In Progress', cls: 'status-progress',  dot: 'bg-blue-500' },
  COMPLETED:   { label: 'Completed',   cls: 'status-completed', dot: 'bg-emerald-500' },
}
export const PRIORITY_CONFIG = {
  LOW:    { label: 'Low',    cls: 'priority-low',    icon: '↓' },
  MEDIUM: { label: 'Medium', cls: 'priority-medium', icon: '→' },
  HIGH:   { label: 'High',   cls: 'priority-high',   icon: '↑' },
  URGENT: { label: 'Urgent', cls: 'priority-urgent', icon: '⚠' },
}
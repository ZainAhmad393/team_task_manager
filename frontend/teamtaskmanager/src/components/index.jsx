/* ─────────────────────────────────────────────────────────
   Enterprise UI Primitives — Inline Styles Only
   Badges · Spinners · Empty States · Skeletons · Avatars
   ───────────────────────────────────────────────────────── */

// ── Design token values (from index.css) ────────────────────────────────────
const tokens = {
  // surfaces
  surface50:  '#f8f8fc',
  surface100: '#f0f0f8',
  surface150: '#e8e8f2',
  surface200: '#dddde8',
  surface300: '#c8c8d8',
  surface400: '#9898b0',
  surface500: '#6e6e88',
  surface600: '#505068',
  surface700: '#363650',
  surface800: '#22223a',
  surface900: '#14142a',
  // brand
  brand600:   '#5048e5',
  // semantic
  successBg:     '#f0fdf4',
  successBorder: '#bbf7d0',
  successText:   '#16a34a',
  warningBg:     '#fffbeb',
  warningBorder: '#fde68a',
  warningText:   '#d97706',
  dangerBg:      '#fff1f2',
  dangerBorder:  '#fecdd3',
  dangerText:    '#e11d48',
  infoBg:        '#eff6ff',
  infoBorder:    '#bfdbfe',
  infoText:      '#2563eb',
}

// ── Avatar palette ───────────────────────────────────────────────────────────
const AVATAR_PALETTE = [
  '#7c3aed', '#3b82f6', '#10b981', '#f97316',
  '#f43f5e', '#06b6d4', '#d946ef', '#14b8a6',
]

// ── Shared badge base ────────────────────────────────────────────────────────
const badgeBase = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '3px 9px',
  fontSize: 11.5,
  fontWeight: 600,
  borderRadius: 99,
  whiteSpace: 'nowrap',
  fontFamily: "'DM Sans', system-ui, sans-serif",
}

// ── STATUS_CONFIG / PRIORITY_CONFIG (backward compat) ───────────────────────
export const STATUS_CONFIG = {
  PENDING:     { label: 'Pending',     dotColor: '#f59e0b' },
  IN_PROGRESS: { label: 'In Progress', dotColor: '#3b82f6' },
  COMPLETED:   { label: 'Completed',   dotColor: '#10b981' },
}

export const PRIORITY_CONFIG = {
  LOW:    { label: 'Low',    icon: '↓' },
  MEDIUM: { label: 'Medium', icon: '→' },
  HIGH:   { label: 'High',   icon: '↑' },
  URGENT: { label: 'Urgent', icon: '⚠' },
}

// ── StatusBadge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  PENDING: {
    background: tokens.warningBg,
    color: tokens.warningText,
    border: `1px solid ${tokens.warningBorder}`,
    dotColor: '#f59e0b',
    label: 'Pending',
  },
  IN_PROGRESS: {
    background: tokens.infoBg,
    color: tokens.infoText,
    border: `1px solid ${tokens.infoBorder}`,
    dotColor: '#3b82f6',
    label: 'In Progress',
  },
  COMPLETED: {
    background: tokens.successBg,
    color: tokens.successText,
    border: `1px solid ${tokens.successBorder}`,
    dotColor: '#10b981',
    label: 'Completed',
  },
}

export function StatusBadge({ status }) {
  const cfg = STATUS_STYLES[status] || STATUS_STYLES.PENDING
  return (
    <span style={{ ...badgeBase, background: cfg.background, color: cfg.color, border: cfg.border }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dotColor, flexShrink: 0 }} />
      {cfg.label}
    </span>
  )
}

// ── PriorityBadge ────────────────────────────────────────────────────────────
const PRIORITY_STYLES = {
  LOW: {
    background: tokens.surface100,
    color: tokens.surface500,
    border: `1px solid ${tokens.surface200}`,
    icon: '↓', label: 'Low',
  },
  MEDIUM: {
    background: tokens.infoBg,
    color: tokens.infoText,
    border: `1px solid ${tokens.infoBorder}`,
    icon: '→', label: 'Medium',
  },
  HIGH: {
    background: tokens.warningBg,
    color: tokens.warningText,
    border: `1px solid ${tokens.warningBorder}`,
    icon: '↑', label: 'High',
  },
  URGENT: {
    background: tokens.dangerBg,
    color: tokens.dangerText,
    border: `1px solid ${tokens.dangerBorder}`,
    icon: '⚠', label: 'Urgent',
  },
}

export function PriorityBadge({ priority }) {
  const cfg = PRIORITY_STYLES[priority] || PRIORITY_STYLES.MEDIUM
  return (
    <span style={{ ...badgeBase, background: cfg.background, color: cfg.color, border: cfg.border }}>
      <span style={{ fontFamily: 'monospace', fontSize: 10, opacity: 0.7 }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}

// ── Spinner ──────────────────────────────────────────────────────────────────
const SPINNER_SIZES = {
  xs: { width: 14, height: 14, borderWidth: 1.5 },
  sm: { width: 16, height: 16, borderWidth: 2 },
  md: { width: 20, height: 20, borderWidth: 2 },
  lg: { width: 24, height: 24, borderWidth: 2 },
  xl: { width: 32, height: 32, borderWidth: 2 },
}

export function Spinner({ size = 'md', style: extraStyle = {} }) {
  const s = SPINNER_SIZES[size] || SPINNER_SIZES.md
  return (
    <div style={{
      width: s.width,
      height: s.height,
      borderRadius: '50%',
      border: `${s.borderWidth}px solid ${tokens.surface200}`,
      borderTopColor: tokens.brand600,
      animation: 'spin 0.8s linear infinite',
      flexShrink: 0,
      ...extraStyle,
    }} />
  )
}

// ── LoadingPage ──────────────────────────────────────────────────────────────
export function LoadingPage() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Spinner size="xl" />
        <p style={{
          fontSize: 14,
          color: tokens.surface400,
          fontWeight: 500,
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>
          Loading…
        </p>
      </div>
    </div>
  )
}

// ── PageSpinner ──────────────────────────────────────────────────────────────
export function PageSpinner() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: tokens.surface50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 40,
          height: 40,
          background: tokens.brand600,
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(20,20,42,0.10), 0 0 0 1px rgba(20,20,42,0.04)',
        }}>
          <span style={{
            color: 'white',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}>
            TF
          </span>
        </div>
        <Spinner size="lg" />
      </div>
    </div>
  )
}

// ── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '64px 24px',
    }}>
      {icon && (
        <div style={{
          width: 56,
          height: 56,
          background: tokens.surface100,
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          marginBottom: 16,
          color: tokens.surface400,
        }}>
          {icon}
        </div>
      )}
      <h3 style={{
        fontSize: 14,
        fontWeight: 600,
        color: tokens.surface700,
        marginBottom: 4,
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        {title}
      </h3>
      {description && (
        <p style={{
          fontSize: 14,
          color: tokens.surface400,
          maxWidth: 280,
          lineHeight: 1.6,
          marginBottom: 20,
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>
          {description}
        </p>
      )}
      {action}
    </div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
const skeletonBase = {
  background: `linear-gradient(90deg, ${tokens.surface100} 25%, ${tokens.surface50} 50%, ${tokens.surface100} 75%)`,
  backgroundSize: '200% 100%',
  borderRadius: 6,
  animation: 'shimmer 1.5s infinite',
}

export function SkeletonLine({ style: extraStyle = {} }) {
  return (
    <div style={{ height: 16, width: '100%', ...skeletonBase, ...extraStyle }} />
  )
}

export function SkeletonCard() {
  return (
    <div style={{
      background: 'white',
      border: `1px solid ${tokens.surface150}`,
      borderRadius: 16,
      boxShadow: '0 1px 4px rgba(20,20,42,0.06), 0 0 0 1px rgba(20,20,42,0.04)',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <SkeletonLine style={{ width: '75%' }} />
      <SkeletonLine />
      <SkeletonLine style={{ width: '66%' }} />
      <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
        <SkeletonLine style={{ height: 24, width: 64, borderRadius: 99 }} />
        <SkeletonLine style={{ height: 24, width: 80, borderRadius: 99 }} />
      </div>
    </div>
  )
}

export function SkeletonTaskRow() {
  return (
    <div style={{
      background: 'white',
      border: `1px solid ${tokens.surface150}`,
      borderRadius: 16,
      boxShadow: '0 1px 4px rgba(20,20,42,0.06)',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      <SkeletonLine style={{ height: 8, width: 8, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <SkeletonLine style={{ width: '50%', height: 14 }} />
        <SkeletonLine style={{ width: '25%', height: 12 }} />
      </div>
      <SkeletonLine style={{ height: 24, width: 64, borderRadius: 99 }} />
    </div>
  )
}

// ── Avatar ────────────────────────────────────────────────────────────────────
const AVATAR_SIZES = {
  xs:   { width: 24, height: 24, fontSize: 10 },
  sm:   { width: 28, height: 28, fontSize: 12 },
  md:   { width: 32, height: 32, fontSize: 13 },
  lg:   { width: 36, height: 36, fontSize: 13 },
  xl:   { width: 40, height: 40, fontSize: 15 },
  '2xl':{ width: 48, height: 48, fontSize: 18 },
}

export function Avatar({ name, size = 'md', title: titleProp, style: extraStyle = {} }) {
  const bg = name
    ? AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length]
    : '#c4c4d4'
  const s = AVATAR_SIZES[size] || AVATAR_SIZES.md

  return (
    <div
      title={titleProp || name}
      style={{
        width: s.width,
        height: s.height,
        fontSize: s.fontSize,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        color: 'white',
        fontWeight: 600,
        flexShrink: 0,
        userSelect: 'none',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        ...extraStyle,
      }}
    >
      {name?.charAt(0).toUpperCase() ?? '?'}
    </div>
  )
}

// ── AvatarGroup ───────────────────────────────────────────────────────────────
export function AvatarGroup({ users = [], max = 4 }) {
  const visible = users.slice(0, max)
  const overflow = users.length - max
  return (
    <div style={{ display: 'flex' }}>
      {visible.map((u, i) => (
        <div
          key={u?.id ?? i}
          style={{
            marginLeft: i === 0 ? 0 : -8,
            borderRadius: '50%',
            boxShadow: '0 0 0 2px white',
          }}
        >
          <Avatar name={u?.name ?? u} size="sm" />
        </div>
      ))}
      {overflow > 0 && (
        <div style={{
          width: 28,
          height: 28,
          background: tokens.surface100,
          color: tokens.surface600,
          borderRadius: '50%',
          boxShadow: '0 0 0 2px white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 600,
          marginLeft: -8,
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>
          +{overflow}
        </div>
      )}
    </div>
  )
}
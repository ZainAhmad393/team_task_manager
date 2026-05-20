import { useNavigate } from 'react-router-dom'
import { Avatar } from './ui/index.jsx'

export default function TeamCard({ team, onEdit, onDelete, currentUserId }) {
  const navigate = useNavigate()
  const isOwner = team.owner?.id === currentUserId

  return (
    <div
      onClick={() => navigate(`/teams/${team.id}`)}
      style={{
        background: 'white',
        border: '1px solid var(--surface-150)',
        borderRadius: 16,
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        transition: 'all 200ms var(--ease-spring)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        e.currentTarget.style.borderColor = 'var(--brand-200)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        e.currentTarget.style.borderColor = 'var(--surface-150)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Color bar */}
      <div style={{ height: 6, background: team.color || '#6366f1', flexShrink: 0 }} />

      <div style={{ padding: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: team.color || '#6366f1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 12, fontWeight: 700,
            }}>
              {team.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{
                fontSize: 14, fontWeight: 700,
                color: 'var(--surface-900)',
                margin: 0, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {team.name}
              </h3>
              <p style={{ fontSize: 11, color: 'var(--surface-400)', margin: 0, fontWeight: 500 }}>
                {isOwner ? 'Owner' : `by ${team.owner?.name}`}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="team-card-actions" style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit?.(team) }}
                style={{
                  width: 28, height: 28, borderRadius: 8, border: 'none',
                  background: 'transparent', cursor: 'pointer',
                  color: 'var(--surface-400)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-100)'; e.currentTarget.style.color = 'var(--surface-700)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--surface-400)' }}
                title="Edit team"
              >✏</button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete?.(team) }}
                style={{
                  width: 28, height: 28, borderRadius: 8, border: 'none',
                  background: 'transparent', cursor: 'pointer',
                  color: 'var(--surface-400)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger-text)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--surface-400)' }}
                title="Delete team"
              >✕</button>
            </div>
          )}
        </div>

        {/* Description */}
        {team.description && (
          <p style={{
            fontSize: 12, color: 'var(--surface-500)',
            lineHeight: 1.5, marginBottom: 12,
            display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {team.description}
          </p>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            `${team._count?.tasks ?? 0} tasks`,
            `${team._count?.members ?? 0} members`,
          ].map(label => (
            <span key={label} style={{
              fontSize: 12, fontWeight: 600,
              color: 'var(--surface-500)',
              background: 'var(--surface-100)',
              padding: '4px 10px', borderRadius: 99,
            }}>
              {label}
            </span>
          ))}
        </div>

        {/* Member avatars */}
        {team.members && team.members.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              {team.members.slice(0, 5).map((m, i) => (
                <div key={m.id} style={{
                  marginLeft: i === 0 ? 0 : -8,
                  boxShadow: '0 0 0 2px white',
                  borderRadius: '50%',
                }}>
                  <Avatar name={m.user?.name} size="sm" />
                </div>
              ))}
              {team.members.length > 5 && (
                <div style={{
                  width: 28, height: 28, marginLeft: -8,
                  background: 'var(--surface-100)',
                  borderRadius: '50%',
                  boxShadow: '0 0 0 2px white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, color: 'var(--surface-500)',
                }}>
                  +{team.members.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
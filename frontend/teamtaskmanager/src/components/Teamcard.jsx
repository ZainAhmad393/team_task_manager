import { useNavigate } from 'react-router-dom'
import { Avatar } from './ui/index.jsx'

export default function TeamCard({ team, onEdit, onDelete, currentUserId }) {
  const navigate = useNavigate()
  const isOwner = team.owner?.id === currentUserId

  return (
    <div
      className="card p-5 hover:shadow-md hover:border-brand-200 transition-all duration-200 cursor-pointer group"
      onClick={() => navigate(`/teams/${team.id}`)}
    >
      {/* Color bar */}
      <div className="h-1.5 rounded-full mb-4 -mx-5 -mt-5 rounded-t-2xl" style={{ backgroundColor: team.color }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display font-bold text-gray-900 group-hover:text-brand-700 transition-colors">
            {team.name}
          </h3>
          {team.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{team.description}</p>
          )}
        </div>
        {isOwner && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit?.(team) }}
              className="p-1.5 rounded-lg hover:bg-surface-100 text-gray-400 hover:text-gray-700 text-sm"
              title="Edit team"
            >✏</button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete?.(team) }}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 text-sm"
              title="Delete team"
            >✕</button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium text-gray-500 bg-surface-100 px-2.5 py-1 rounded-full">
          {team._count?.tasks ?? 0} tasks
        </span>
        <span className="text-xs font-medium text-gray-500 bg-surface-100 px-2.5 py-1 rounded-full">
          {team._count?.members ?? 0} members
        </span>
      </div>

      {/* Member avatars */}
      {team.members && (
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-2">
            {team.members.slice(0, 5).map((m) => (
              <div key={m.id} title={m.user?.name} className="ring-2 ring-white rounded-full">
                <Avatar name={m.user?.name} size="sm" />
              </div>
            ))}
            {team.members.length > 5 && (
              <div className="w-8 h-8 bg-surface-100 rounded-full ring-2 ring-white flex items-center justify-center text-xs text-gray-500 font-medium">
                +{team.members.length - 5}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400 ml-1">
            {isOwner ? 'You own this' : `by ${team.owner?.name}`}
          </span>
        </div>
      )}
    </div>
  )
}
export const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
}

export const priorityConfig = {
  LOW: { label: 'Low', color: 'bg-gray-50 text-gray-600 border-gray-200' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  HIGH: { label: 'High', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  URGENT: { label: 'Urgent', color: 'bg-red-50 text-red-600 border-red-200' },
}

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.PENDING
  return (
    <span className={`badge border ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM
  return (
    <span className={`badge border ${config.color}`}>
      {config.label}
    </span>
  )
}

export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-5xl mb-4 opacity-40">{icon}</div>
      <h3 className="font-display font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-5 max-w-xs">{description}</p>
      {action}
    </div>
  )
}

export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <div className={`${sizes[size]} border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin`} />
  )
}

export function LoadingPage() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <Spinner size="lg" />
    </div>
  )
}
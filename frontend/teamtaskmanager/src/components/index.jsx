/* ─────────────────────────────────────────────
   Team Components:
   • TeamCard
   • TeamFormModal
   ───────────────────────────────────────────── */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal'
import { AvatarGroup } from './ui/index'
import { teamsApi } from '../services/api'
import toast from 'react-hot-toast'

/* ─── Team color presets ─── */
export const TEAM_COLORS = [
  '#6366f1', '#8b5cf6', '#3b82f6', '#06b6d4',
  '#10b981', '#f59e0b', '#ef4444', '#ec4899',
  '#84cc16', '#f97316',
]

/* ──────────────────────────────────────────────
   TeamCard
   ────────────────────────────────────────────── */
export function TeamCard({ team, onEdit, onDelete, currentUserId }) {
  const navigate  = useNavigate()
  const isOwner   = team.owner?.id === currentUserId
  const memberUsers = team.members?.map((m) => m.user).filter(Boolean) || []

  return (
    <article
      onClick={() => navigate(`/teams/${team.id}`)}
      className="card-interactive group overflow-hidden"
    >
      {/* ── Colour header bar ── */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: team.color || '#6366f1' }}
      />

      <div className="p-5">
        {/* ── Title row ── */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: team.color || '#6366f1' }}
            >
              {team.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-surface-900 truncate group-hover:text-brand-700 transition-colors">
                {team.name}
              </h3>
              <p className="text-xs text-surface-400 font-medium">
                {isOwner ? 'Owner' : `by ${team.owner?.name}`}
              </p>
            </div>
          </div>

          {/* Actions (owner only) */}
          {isOwner && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit?.(team) }}
                className="btn-icon !p-1.5 !text-xs"
                title="Edit team"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete?.(team) }}
                className="btn-icon !p-1.5 !text-xs text-danger-400 hover:!text-danger-600 hover:!bg-danger-50"
                title="Delete team"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 3h10M4 3V2h4v1M5 5.5v3M7 5.5v3M2 3l.667 7A1 1 0 003.663 11h4.674a1 1 0 00.996-.902L10 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        {team.description && (
          <p className="text-xs text-surface-500 line-clamp-2 leading-relaxed mb-3">
            {team.description}
          </p>
        )}

        {/* ── Stats row ── */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-surface-500 bg-surface-100 px-2.5 py-1 rounded-full">
            {team._count?.tasks ?? 0} tasks
          </span>
          <span className="text-xs font-semibold text-surface-500 bg-surface-100 px-2.5 py-1 rounded-full">
            {team._count?.members ?? 0} members
          </span>
        </div>

        {/* ── Member avatars ── */}
        {memberUsers.length > 0 && (
          <AvatarGroup users={memberUsers} max={5} />
        )}
      </div>
    </article>
  )
}

/* ──────────────────────────────────────────────
   TeamFormModal
   ────────────────────────────────────────────── */
const DEFAULT_FORM = { name: '', description: '', color: '#6366f1' }

export function TeamFormModal({ isOpen, onClose, onSuccess, team = null }) {
  const [form, setForm]     = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const isEdit = !!team

  useEffect(() => {
    if (team) {
      setForm({ name: team.name || '', description: team.description || '', color: team.color || '#6366f1' })
    } else {
      setForm(DEFAULT_FORM)
    }
    setErrors({})
  }, [team, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setErrors({ name: 'Team name is required' })
    setLoading(true)
    try {
      if (isEdit) {
        const { data } = await teamsApi.update(team.id, form)
        toast.success('Team updated')
        onSuccess?.(data.team)
      } else {
        const { data } = await teamsApi.create(form)
        toast.success('Team created!')
        onSuccess?.(data.team)
      }
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to save team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Team' : 'Create Team'}
      description={isEdit ? 'Update your team details.' : 'Give your team a name and identity.'}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button form="team-form" type="submit" disabled={loading} className="btn-primary">
            {loading
              ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isEdit ? 'Saving…' : 'Creating…'}</>
              : isEdit ? 'Save Changes' : 'Create Team'
            }
          </button>
        </div>
      }
    >
      <form id="team-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="label label-required">Team Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Design, Engineering, Marketing…"
            className={`input ${errors.name ? 'input-error' : ''}`}
            autoFocus
          />
          {errors.name && <p className="text-xs text-danger-600 mt-1.5 font-medium">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What does this team focus on?"
            rows={3}
            className="input resize-none"
          />
        </div>

        {/* Color */}
        <div>
          <label className="label">Team Color</label>
          <div className="flex flex-wrap gap-2.5">
            {TEAM_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm((f) => ({ ...f, color: c }))}
                className="w-8 h-8 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{
                  backgroundColor: c,
                  boxShadow: form.color === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : undefined,
                  transform: form.color === c ? 'scale(1.15)' : undefined,
                }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl border border-surface-100">
          <div
            className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: form.color }}
          >
            {form.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-900">{form.name || 'Team name preview'}</p>
            <p className="text-xs text-surface-400">{form.description || 'No description'}</p>
          </div>
        </div>
      </form>
    </Modal>
  )
}
import { useState, useEffect } from 'react'
import Modal from './Modal'
import { teamsApi } from '../services/api'
import toast from 'react-hot-toast'

const COLORS = [
  '#6366f1', '#8b5cf6', '#3b82f6', '#06b6d4',
  '#10b981', '#f59e0b', '#ef4444', '#ec4899',
  '#84cc16', '#f97316',
]

const defaultForm = { name: '', description: '', color: '#6366f1' }

export default function TeamFormModal({ isOpen, onClose, onSuccess, team = null }) {
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const isEdit = !!team

  useEffect(() => {
    if (team) {
      setForm({ name: team.name || '', description: team.description || '', color: team.color || '#6366f1' })
    } else {
      setForm(defaultForm)
    }
    setErrors({})
  }, [team, isOpen])

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
    <Modal isOpen={isOpen} onClose={onClose}
      title={isEdit ? 'Edit Team' : 'Create Team'}
      description={isEdit ? 'Update your team details.' : 'Give your team a name and identity.'}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Name */}
        <div>
          <label className="label label-required">Team Name</label>
          <input
            value={form.name}
            onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setErrors({}) }}
            placeholder="Design Team, Engineering..."
            className={`input ${errors.name ? 'input-error' : ''}`}
            autoFocus
          />
          {errors.name && (
            <p style={{ fontSize: 12, color: 'var(--danger-text)', marginTop: 6, fontWeight: 500 }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="label">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="What does this team focus on?"
            rows={3}
            className="input"
            style={{ resize: 'none' }}
          />
        </div>

        {/* Color */}
        <div>
          <label className="label">Team Color</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm(f => ({ ...f, color: c }))}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: c, border: 'none', cursor: 'pointer',
                  transition: 'transform 150ms',
                  transform: form.color === c ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: form.color === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : 'none',
                  outline: 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: 12, background: 'var(--surface-50)',
          borderRadius: 12, border: '1px solid var(--surface-100)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: form.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 12, fontWeight: 700,
          }}>
            {form.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--surface-900)', margin: 0 }}>
              {form.name || 'Team name preview'}
            </p>
            <p style={{ fontSize: 12, color: 'var(--surface-400)', margin: 0 }}>
              {form.description || 'No description'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Team'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

/* Named export for compatibility */
export { TeamFormModal }
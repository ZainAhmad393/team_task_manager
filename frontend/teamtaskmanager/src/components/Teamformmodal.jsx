import { useState, useEffect } from 'react'
import Modal from './Modal'
import { teamsApi } from '../services/api'
import toast from 'react-hot-toast'

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

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
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Team' : 'Create Team'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Team Name *</label>
          <input
            value={form.name}
            onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setErrors({}) }}
            placeholder="Design Team, Engineering..."
            className={`input ${errors.name ? 'border-red-400' : ''}`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="What does this team do?"
            rows={3}
            className="input resize-none"
          />
        </div>

        <div>
          <label className="label">Team Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm(f => ({ ...f, color: c }))}
                className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-2.5 p-3 bg-surface-50 rounded-xl">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: form.color }} />
          <span className="text-sm font-medium text-gray-700">{form.name || 'Team name preview'}</span>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '⟳ Saving…' : isEdit ? 'Save Changes' : 'Create Team'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
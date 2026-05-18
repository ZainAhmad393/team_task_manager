import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import Modal from './Modal'
import { tasksApi, teamsApi } from '../services/api'
import toast from 'react-hot-toast'

const DEFAULT_FORM = {
  title: '',
  description: '',
  status: 'PENDING',
  priority: 'MEDIUM',
  teamId: '',
  assigneeId: '',
  dueDate: '',
}

// ✅ MOVED OUTSIDE — Field is now a stable component, not recreated on every render
function Field({ label, error, children, required }) {
  return (
    <div>
      <label className={`label ${required ? 'label-required' : ''}`}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs mt-1.5 font-medium text-danger-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default function TaskFormModal({
  isOpen,
  onClose,
  onSuccess,
  task = null,
  defaultTeamId = null,
}) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const isEdit = !!task

  const titleRef = useRef(null)
  const hasFocusedRef = useRef(false)

  useEffect(() => {
    if (!isOpen) return
    teamsApi.getAll()
      .then(({ data }) => {
        setTeams(data.teams || [])
        if (!isEdit) {
          setForm((f) => ({
            ...f,
            teamId: defaultTeamId || data.teams?.[0]?.id || '',
          }))
        }
      })
      .catch(() => {})
  }, [isOpen, isEdit, defaultTeamId])

  useEffect(() => {
    if (isOpen && !hasFocusedRef.current) {
      hasFocusedRef.current = true
      const t = setTimeout(() => titleRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
    if (!isOpen) hasFocusedRef.current = false
  }, [isOpen])

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'PENDING',
        priority: task.priority || 'MEDIUM',
        teamId: task.team?.id || task.teamId || '',
        assigneeId: task.assignee?.id || '',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
      })
    } else {
      setForm({ ...DEFAULT_FORM, teamId: defaultTeamId || '' })
    }
    setErrors({})
  }, [task, isOpen, defaultTeamId])

  useEffect(() => {
    if (!form.teamId) { setMembers([]); return }
    teamsApi.getOne(form.teamId)
      .then(({ data }) => {
        const all = [data.team.owner, ...(data.team.members?.map((m) => m.user) || [])]
        const seen = new Set()
        setMembers(all.filter((m) => m && !seen.has(m.id) && seen.add(m.id)))
      })
      .catch(() => setMembers([]))
  }, [form.teamId])

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => ({ ...e, [name]: '' }))
  }

  const handleChange = (e) => set(e.target.name, e.target.value)

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Task title is required'
    if (!form.teamId) errs.teamId = 'Please select a team'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    setLoading(true)
    try {
      const payload = { ...form, assigneeId: form.assigneeId || null, dueDate: form.dueDate || null }
      if (isEdit) {
        const { data } = await tasksApi.update(task.id, payload)
        toast.success('Task updated')
        onSuccess?.(data.task)
      } else {
        const { data } = await tasksApi.create(payload)
        toast.success('Task created')
        onSuccess?.(data.task)
      }
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'New Task'}
      description={isEdit ? 'Update task details below.' : 'Fill in the details to create a new task.'}
      size="lg"
      footer={
        <div className="flex justify-end gap-2.5">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button form="task-form" type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">

        <Field label="Task title" error={errors.title} required>
          <input
            ref={titleRef}
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            className={`input ${errors.title ? 'input-error' : ''}`}
          />
        </Field>

        <Field label="Description">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Add context or acceptance criteria…"
            className="input resize-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Team" error={errors.teamId} required>
            <select name="teamId" value={form.teamId} onChange={handleChange} className="input">
              <option value="">Select team…</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>

          <Field label="Assignee">
            <select name="assigneeId" value={form.assigneeId} onChange={handleChange} className="input">
              <option value="">Unassigned</option>
              {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <select name="status" value={form.status} onChange={handleChange} className="input">
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </Field>

          <Field label="Priority">
            <select name="priority" value={form.priority} onChange={handleChange} className="input">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </Field>
        </div>

        <Field label="Due date">
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="input"
          />
        </Field>

      </form>
    </Modal>
  )
}
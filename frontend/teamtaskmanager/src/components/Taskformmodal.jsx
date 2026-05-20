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

// ── Inline style objects (from index.css) ──────────────────────────────────

const styles = {
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#505068',           // --surface-600
    marginBottom: '6px',
    letterSpacing: '0.01em',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  labelRequired: {              // adds ' *' via a <span> instead of ::after
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#505068',
    marginBottom: '6px',
    letterSpacing: '0.01em',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  errorText: {
    fontSize: '12px',
    marginTop: '6px',
    fontWeight: 500,
    color: '#e11d48',           // --danger-text
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  input: {
    width: '100%',
    padding: '9px 13px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: '13.5px',
    color: '#14142a',           // --surface-900
    background: 'white',
    border: '1.5px solid #dddde8', // --surface-200
    borderRadius: '12px',       // --radius-md
    outline: 'none',
    lineHeight: 1.5,
    transition: 'all 120ms cubic-bezier(0.16,1,0.3,1)',
    boxSizing: 'border-box',
  },
  inputError: {
    width: '100%',
    padding: '9px 13px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: '13.5px',
    color: '#14142a',
    background: 'white',
    border: '1.5px solid #e11d48', // --danger-text
    borderRadius: '12px',
    outline: 'none',
    lineHeight: 1.5,
    transition: 'all 120ms cubic-bezier(0.16,1,0.3,1)',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '9px 13px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: '13.5px',
    color: '#14142a',
    background: 'white',
    border: '1.5px solid #dddde8',
    borderRadius: '12px',
    outline: 'none',
    lineHeight: 1.5,
    resize: 'none',
    transition: 'all 120ms cubic-bezier(0.16,1,0.3,1)',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '9px 13px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: '13.5px',
    color: '#14142a',
    background: 'white',
    border: '1.5px solid #dddde8',
    borderRadius: '12px',
    outline: 'none',
    lineHeight: 1.5,
    transition: 'all 120ms cubic-bezier(0.16,1,0.3,1)',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  selectError: {
    width: '100%',
    padding: '9px 13px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: '13.5px',
    color: '#14142a',
    background: 'white',
    border: '1.5px solid #e11d48',
    borderRadius: '12px',
    outline: 'none',
    lineHeight: 1.5,
    transition: 'all 120ms cubic-bezier(0.16,1,0.3,1)',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontWeight: 600,
    fontSize: '13px',
    letterSpacing: '-0.01em',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 120ms cubic-bezier(0.16,1,0.3,1)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    borderRadius: '12px',
    padding: '0 14px',
    height: '36px',
    background: '#5048e5',      // --brand-600
    color: '#fff',
    boxShadow: '0 4px 16px rgba(101,96,240,0.28), inset 0 1px 0 rgba(255,255,255,0.12)',
  },
  btnPrimaryDisabled: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontWeight: 600,
    fontSize: '13px',
    letterSpacing: '-0.01em',
    border: 'none',
    cursor: 'not-allowed',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    borderRadius: '12px',
    padding: '0 14px',
    height: '36px',
    background: '#5048e5',
    color: '#fff',
    opacity: 0.45,
    pointerEvents: 'none',
    boxShadow: '0 4px 16px rgba(101,96,240,0.28)',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontWeight: 600,
    fontSize: '13px',
    letterSpacing: '-0.01em',
    cursor: 'pointer',
    transition: 'all 120ms cubic-bezier(0.16,1,0.3,1)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    borderRadius: '12px',
    padding: '0 14px',
    height: '36px',
    background: 'white',
    color: '#363650',           // --surface-700
    boxShadow: '0 1px 4px rgba(20,20,42,0.06), 0 0 0 1px rgba(20,20,42,0.04)',
    border: '1px solid #dddde8',
  },
  fieldWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  footerWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
}

// ── Focus handlers (simulate :focus styles inline) ─────────────────────────

function handleInputFocus(e, isError = false) {
  e.target.style.borderColor = isError ? '#e11d48' : '#817dfc' // --brand-400
  e.target.style.boxShadow = isError
    ? '0 0 0 3px rgba(225,29,72,0.10)'
    : '0 0 0 3px rgba(101,96,240,0.10)'
}

function handleInputBlur(e, isError = false) {
  e.target.style.borderColor = isError ? '#e11d48' : '#dddde8'
  e.target.style.boxShadow = 'none'
}

// ── Field component ────────────────────────────────────────────────────────

function Field({ label, error, children, required }) {
  return (
    <div style={styles.fieldWrapper}>
      <label style={required ? styles.labelRequired : styles.label}>
        {label}
        {required && <span style={{ color: '#e11d48' }}> *</span>}
      </label>
      {children}
      {error && (
        <p style={styles.errorText}>{error}</p>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

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
        <div style={styles.footerWrapper}>
          <button
            onClick={onClose}
            style={styles.btnSecondary}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f8f8fc'
              e.currentTarget.style.borderColor = '#c8c8d8'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(20,20,42,0.08), 0 0 0 1px rgba(20,20,42,0.04)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.borderColor = '#dddde8'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(20,20,42,0.06), 0 0 0 1px rgba(20,20,42,0.04)'
            }}
          >
            Cancel
          </button>
          <button
            form="task-form"
            type="submit"
            disabled={loading}
            style={loading ? styles.btnPrimaryDisabled : styles.btnPrimary}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.background = '#4037c8'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(101,96,240,0.35)'
              }
            }}
            onMouseLeave={e => {
              if (!loading) {
                e.currentTarget.style.background = '#5048e5'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(101,96,240,0.28)'
              }
            }}
          >
            {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} style={styles.formWrapper}>

        {/* Task Title */}
        <Field label="Task title" error={errors.title} required>
          <input
            ref={titleRef}
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            style={errors.title ? styles.inputError : styles.input}
            onFocus={e => handleInputFocus(e, !!errors.title)}
            onBlur={e => handleInputBlur(e, !!errors.title)}
          />
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Add context or acceptance criteria…"
            style={styles.textarea}
            onFocus={e => handleInputFocus(e)}
            onBlur={e => handleInputBlur(e)}
          />
        </Field>

        {/* Team + Assignee */}
        <div style={styles.gridTwo}>
          <Field label="Team" error={errors.teamId} required>
            <select
              name="teamId"
              value={form.teamId}
              onChange={handleChange}
              style={errors.teamId ? styles.selectError : styles.select}
              onFocus={e => handleInputFocus(e, !!errors.teamId)}
              onBlur={e => handleInputBlur(e, !!errors.teamId)}
            >
              <option value="">Select team…</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>

          <Field label="Assignee">
            <select
              name="assigneeId"
              value={form.assigneeId}
              onChange={handleChange}
              style={styles.select}
              onFocus={e => handleInputFocus(e)}
              onBlur={e => handleInputBlur(e)}
            >
              <option value="">Unassigned</option>
              {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </Field>
        </div>

        {/* Status + Priority */}
        <div style={styles.gridTwo}>
          <Field label="Status">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={styles.select}
              onFocus={e => handleInputFocus(e)}
              onBlur={e => handleInputBlur(e)}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </Field>

          <Field label="Priority">
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              style={styles.select}
              onFocus={e => handleInputFocus(e)}
              onBlur={e => handleInputBlur(e)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </Field>
        </div>

        {/* Due Date */}
        <Field label="Due date">
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            style={styles.input}
            onFocus={e => handleInputFocus(e)}
            onBlur={e => handleInputBlur(e)}
          />
        </Field>

      </form>
    </Modal>
  )
}
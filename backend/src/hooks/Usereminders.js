import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { differenceInDays, isPast, isToday, isTomorrow } from 'date-fns'

const STORAGE_KEY = 'ttm_reminders_shown'
const RESET_INTERVAL_MS = 8 * 60 * 60 * 1000 // 8 hours

/**
 * useReminders
 * Shows toast notifications for:
 *  - Overdue tasks
 *  - Tasks due today
 *  - Tasks due tomorrow
 *
 * Uses localStorage to avoid repeating notifications within 8 hours.
 */
export function useReminders(tasks = []) {
  const shownRef = useRef(false)

  useEffect(() => {
    if (!tasks.length || shownRef.current) return

    // Check if we already showed reminders recently
    try {
      const last = localStorage.getItem(STORAGE_KEY)
      if (last && Date.now() - parseInt(last, 10) < RESET_INTERVAL_MS) return
    } catch {}

    const incomplete = tasks.filter(t => t.status !== 'COMPLETED' && t.dueDate)

    const overdue   = incomplete.filter(t => isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate)))
    const dueToday  = incomplete.filter(t => isToday(new Date(t.dueDate)))
    const dueTomorrow = incomplete.filter(t => isTomorrow(new Date(t.dueDate)))

    let shown = false

    if (overdue.length > 0) {
      setTimeout(() => {
        toast.error(
          `⚠ ${overdue.length} task${overdue.length > 1 ? 's are' : ' is'} overdue`,
          {
            duration: 6000,
            id: 'reminder-overdue',
            style: {
              background: '#fff',
              border: '1px solid #fee2e2',
              color: '#dc2626',
            },
          }
        )
      }, 1200)
      shown = true
    }

    if (dueToday.length > 0) {
      setTimeout(() => {
        toast(
          `📅 ${dueToday.length} task${dueToday.length > 1 ? 's are' : ' is'} due today`,
          {
            duration: 5000,
            id: 'reminder-today',
            icon: '🔔',
            style: {
              background: '#fff',
              border: '1px solid #fef3c7',
              color: '#d97706',
            },
          }
        )
      }, 2000)
      shown = true
    }

    if (dueTomorrow.length > 0) {
      setTimeout(() => {
        toast(
          `📆 ${dueTomorrow.length} task${dueTomorrow.length > 1 ? 's are' : ' is'} due tomorrow`,
          {
            duration: 4500,
            id: 'reminder-tomorrow',
            icon: '📌',
          }
        )
      }, 2800)
      shown = true
    }

    if (shown) {
      shownRef.current = true
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()))
      } catch {}
    }
  }, [tasks])
}

/**
 * Utility: get urgency level for a task's due date
 */
export function getDueDateUrgency(dueDate, status) {
  if (!dueDate || status === 'COMPLETED') return null
  const d = new Date(dueDate)
  if (isPast(d) && !isToday(d)) return 'overdue'
  if (isToday(d))               return 'today'
  if (isTomorrow(d))            return 'tomorrow'
  if (differenceInDays(d, new Date()) <= 3) return 'soon'
  return null
}
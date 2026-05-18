import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Central Axios instance.
 * All API calls route through here — credentials (session cookie) are
 * included automatically on every request.
 */
// ✅ Ye karo — BASE_URL ko properly use karo
const api = axios.create({
  baseURL        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  withCredentials: true,
  timeout        : 20_000,
  headers        : { 'Content-Type': 'application/json' },
})

/* ─── Response interceptor ─── */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error   ||
      err.response?.data?.message ||
      err.message                 ||
      'Something went wrong'

    // Auto-redirect on 401 (session expired) — skip auth routes
    if (
      err.response?.status === 401 &&
      !err.config?.url?.includes('/auth/')
    ) {
      window.location.replace('/login')
    }

    return Promise.reject(Object.assign(err, { message }))
  }
)

/* ─── Auth ─── */
export const authApi = {
  register    : (data)    => api.post('/auth/register', data),
  login       : (data)    => api.post('/auth/login', data),
  logout      : ()        => api.post('/auth/logout'),
  me          : ()        => api.get('/auth/me'),
  forgotPw    : (email)   => api.post('/auth/forgot-password', { email }),
  resetPw     : (data)    => api.post('/auth/reset-password', data),
  changePassword: (data)  => api.post('/auth/change-password', data),
}

/* ─── Teams ─── */
export const teamsApi = {
  getAll        : ()         => api.get('/teams'),
  getOne        : (id)       => api.get(`/teams/${id}`),
  create        : (data)     => api.post('/teams', data),
  update        : (id, data) => api.put(`/teams/${id}`, data),
  delete        : (id)       => api.delete(`/teams/${id}`),
  manageMembers : (id, data) => api.post(`/teams/${id}/members`, data),
  invite        : (id, data) => api.post(`/teams/${id}/invite`, data),
}

/* ─── Tasks ─── */
export const tasksApi = {
  getAll   : (params)    => api.get('/tasks', { params }),
  getOne   : (id)        => api.get(`/tasks/${id}`),
  getStats : ()          => api.get('/tasks/stats'),
  create   : (data)      => api.post('/tasks', data),
  update   : (id, data)  => api.put(`/tasks/${id}`, data),
  delete   : (id)        => api.delete(`/tasks/${id}`),
  getReminders: ()       => api.get('/tasks/reminders'),
}

export default api
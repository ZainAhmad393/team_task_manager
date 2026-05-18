import { create } from 'zustand'
import { authApi } from '../services/api'

const useAuthStore = create((set) => ({
  user:            null,
  isAuthenticated: false,
  isLoading:       true,

  initialize: async () => {
    try {
      const { data } = await authApi.me()
      set({ user: data.user, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  login: async (credentials) => {
    const { data } = await authApi.login(credentials)
    set({ user: data.user, isAuthenticated: true })
    return data.user
  },

  register: async (userData) => {
    const { data } = await authApi.register(userData)
    set({ user: data.user, isAuthenticated: true })
    return data.user
  },

  logout: async () => {
    await authApi.logout()
    set({ user: null, isAuthenticated: false })
  },

  updateUser: (patch) =>
    set((state) => ({ user: { ...state.user, ...patch } })),
}))

export default useAuthStore
import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  isSetup: boolean
  setIsAuthenticated: (value: boolean) => void
  setIsSetup: (value: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isSetup: true, // Default to true, will check on load
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsSetup: (value) => set({ isSetup: value }),
  logout: () => set({ isAuthenticated: false }),
}))

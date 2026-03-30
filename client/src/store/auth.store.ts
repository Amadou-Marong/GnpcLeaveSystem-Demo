import { create } from 'zustand'
import { type User, users } from '@/data/dummyData'
import { persist } from 'zustand/middleware'


interface AuthState {
  currentUser: User | null
  login: (email: string, password: string) => void
  logout: () => void
}

// export const useAuthStore = create<AuthState>((set) => ({
//   currentUser: null,
//   login: (email: string, password: string) => set({ currentUser: users.find((user) => user.email === email && user.password === password) || null }),
//   logout: () => set({ currentUser: null }),
// }))

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      login: (email: string, password: string) =>
        set({ currentUser: users.find((user) => user.email === email && user.password === password) || null }),
      logout: () => set({ currentUser: null }),
    }),
    {
      name: 'auth', // name of the item in storage
    }
  )
)




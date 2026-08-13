import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import type { User } from '../types/auth'

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authApi.currentUser().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false))
  }, [])

  const value = useMemo<AuthState>(() => ({
    user,
    loading,
    signIn: async (email, password) => setUser(await authApi.login(email, password)),
    signOut: async () => { await authApi.logout(); setUser(null) },
  }), [loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Context and provider stay together so session behavior has one source of truth.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}

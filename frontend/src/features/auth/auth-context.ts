import { createContext } from 'react'
import type { Credentials, Registration, UserProfile } from '../../lib/types'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'error'

export interface AuthContextValue {
  status: AuthStatus
  user: UserProfile | null
  login: (credentials: Credentials) => Promise<void>
  register: (registration: Registration) => Promise<void>
  logout: () => Promise<void>
  retryRestore: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

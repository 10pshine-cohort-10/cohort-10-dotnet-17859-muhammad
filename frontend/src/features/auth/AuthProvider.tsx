import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { authApi, refreshSession, setAccessToken } from '../../lib/api'
import type { Credentials, Registration, UserProfile } from '../../lib/types'
import { AuthContext, type AuthStatus, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    let cancelled = false

    refreshSession()
      .then((session) => {
        if (cancelled) return
        if (session) {
          setAccessToken(session.accessToken)
          setUser(session.user)
          setStatus('authenticated')
        } else {
          setStatus('anonymous')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('anonymous')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (credentials: Credentials) => {
    const session = await authApi.login(credentials)
    setAccessToken(session.accessToken)
    setUser(session.user)
    setStatus('authenticated')
  }, [])

  const register = useCallback(async (registration: Registration) => {
    const session = await authApi.register(registration)
    setAccessToken(session.accessToken)
    setUser(session.user)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setAccessToken(null)
      setUser(null)
      setStatus('anonymous')
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, login, register, logout }),
    [status, user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

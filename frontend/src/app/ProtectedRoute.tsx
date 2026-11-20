import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../features/auth/useAuth'
import { AuthLoading } from './AuthLoading'

export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <AuthLoading />
  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { status } = useAuth()

  if (status === 'loading') return <AuthLoading />
  if (status === 'authenticated') return <Navigate to="/" replace />

  return <Outlet />
}

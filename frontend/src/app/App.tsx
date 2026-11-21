import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, Link, RouterProvider } from 'react-router'
import { AppShell } from './AppShell'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute'
import { Wordmark } from '../components/Wordmark'
import { buttonStyles } from '../components/ui/button-styles'
import { AuthProvider } from '../features/auth/AuthProvider'
import { LoginPage } from '../features/auth/LoginPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { ProfilePage } from '../features/profile/ProfilePage'
import { TaskListPage } from '../features/tasks/TaskListPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
})

function NotFoundPage() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-[420px]">
        <Wordmark />
        <h1 className="mt-10 text-[26px] font-semibold tracking-[-0.02em]">
          This page does not exist.
        </h1>
        <p className="mt-2 text-sm text-muted">
          The link may be old, or the page has moved.
        </p>
        <Link to="/" className={buttonStyles('secondary', 'mt-6')}>
          Back to today
        </Link>
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'tasks', element: <TaskListPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}

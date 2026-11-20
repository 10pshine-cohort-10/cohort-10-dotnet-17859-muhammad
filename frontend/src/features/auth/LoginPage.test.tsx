import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from './AuthProvider'
import { LoginPage } from './LoginPage'
import { ApiError, authApi, refreshSession } from '../../lib/api'
import type { AuthResponse } from '../../lib/types'

vi.mock('../../lib/api', async () => {
  const actual = await vi.importActual<typeof import('../../lib/api')>('../../lib/api')
  return {
    ...actual,
    refreshSession: vi.fn(),
    authApi: {
      ...actual.authApi,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    },
  }
})

const session: AuthResponse = {
  accessToken: 'access-token',
  expiresAtUtc: '2030-01-01T00:00:00Z',
  user: {
    id: 'user-1',
    email: 'ada@example.com',
    displayName: 'Ada Lovelace',
    roles: ['User'],
  },
}

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div>Dashboard</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  const loginMock = vi.mocked(authApi.login)

  beforeEach(() => {
    vi.mocked(refreshSession).mockResolvedValue(null)
    loginMock.mockReset()
  })

  it('shows validation messages instead of calling the API', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText('Enter your email address')).toBeInTheDocument()
    expect(screen.getByText('Enter your password')).toBeInTheDocument()
    expect(loginMock).not.toHaveBeenCalled()
  })

  it('signs in and moves to the dashboard', async () => {
    const user = userEvent.setup()
    loginMock.mockResolvedValue(session)
    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'Str0ng!Passw0rd')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: 'ada@example.com',
        password: 'Str0ng!Passw0rd',
      })
    })
    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
  })

  it('shows the API message for bad credentials', async () => {
    const user = userEvent.setup()
    loginMock.mockRejectedValue(
      new ApiError(401, {
        title: 'The email or password is incorrect.',
        code: 'invalid_credentials',
      }),
    )
    renderLogin()

    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'Wrong!Passw0rd')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The email or password is incorrect.',
    )
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiRequest, getAccessToken, setAccessToken } from './api'
import type { AuthResponse } from './types'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const session: AuthResponse = {
  accessToken: 'new-access-token',
  expiresAtUtc: '2030-01-01T00:00:00Z',
  user: {
    id: 'user-1',
    email: 'ada@example.com',
    displayName: 'Ada Lovelace',
    roles: ['User'],
  },
}

describe('apiRequest', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
    setAccessToken(null)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('attaches the access token and parses JSON', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }))
    setAccessToken('token-1')

    const result = await apiRequest<{ ok: boolean }>('/api/v1/test')

    expect(result).toEqual({ ok: true })
    const [, init] = fetchMock.mock.calls[0]!
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer token-1')
  })

  it('refreshes once and retries after a 401', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ title: 'expired' }, 401))
      .mockResolvedValueOnce(jsonResponse(session))
      .mockResolvedValueOnce(jsonResponse({ ok: true }))

    const result = await apiRequest<{ ok: boolean }>('/api/v1/tasks')

    expect(result).toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(String(fetchMock.mock.calls[1]![0])).toContain('/api/v1/auth/refresh')
    expect(getAccessToken()).toBe('new-access-token')
  })

  it('throws an ApiError carrying code and field errors', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        {
          title: 'An account with this email already exists.',
          code: 'email_taken',
          errors: { email: ['Already registered'] },
        },
        409,
      ),
    )

    try {
      await apiRequest('/api/v1/auth/register', { method: 'POST', body: {} })
      expect.unreachable('expected an ApiError')
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError)
      const apiError = error as ApiError
      expect(apiError.status).toBe(409)
      expect(apiError.code).toBe('email_taken')
      expect(apiError.fieldErrors).toEqual({ email: ['Already registered'] })
    }
  })
})

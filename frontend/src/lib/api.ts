import type {
  AuthResponse,
  Credentials,
  ProblemDetails,
  Registration,
  UserProfile,
} from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5003'

let accessToken: string | null = null
let refreshInFlight: Promise<AuthResponse | null> | null = null

export class ApiError extends Error {
  readonly status: number
  readonly code: string | null
  readonly fieldErrors: Record<string, string[]> | null

  constructor(status: number, problem: ProblemDetails | null) {
    super(problem?.title ?? fallbackMessage(status))
    this.name = 'ApiError'
    this.status = status
    this.code = problem?.code ?? null
    this.fieldErrors = problem?.errors ?? null
  }
}

function fallbackMessage(status: number): string {
  if (status === 401) return 'Your session has expired. Sign in again.'
  if (status === 403) return 'You do not have access to that.'
  if (status === 404) return 'That item could not be found.'
  return 'Something went wrong. Try again.'
}

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

async function readProblem(response: Response): Promise<ProblemDetails | null> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('json')) return null
  try {
    return (await response.json()) as ProblemDetails
  } catch {
    return null
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  return new ApiError(response.status, await readProblem(response))
}

export async function refreshSession(): Promise<AuthResponse | null> {
  refreshInFlight ??= fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
    .then(async (response) => {
      if (response.status === 401 || response.status === 403) return null
      if (!response.ok) throw await toApiError(response)
      return (await response.json()) as AuthResponse
    })
    .finally(() => {
      refreshInFlight = null
    })

  return refreshInFlight
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  skipRefresh?: boolean
}

async function send(path: string, options: RequestOptions): Promise<Response> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipRefresh, ...request } = options
  let response = await send(path, request)

  if (response.status === 401 && !skipRefresh) {
    const refreshed = await refreshSession()
    if (refreshed) {
      setAccessToken(refreshed.accessToken)
      response = await send(path, request)
    }
  }

  if (!response.ok) {
    throw await toApiError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const authApi = {
  login: (credentials: Credentials) =>
    apiRequest<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: credentials,
      skipRefresh: true,
    }),

  register: (registration: Registration) =>
    apiRequest<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: registration,
      skipRefresh: true,
    }),

  logout: () => apiRequest<void>('/api/v1/auth/logout', { method: 'POST', skipRefresh: true }),

  me: () => apiRequest<UserProfile>('/api/v1/auth/me'),
}

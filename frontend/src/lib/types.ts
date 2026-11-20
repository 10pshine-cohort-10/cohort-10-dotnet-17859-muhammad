export type Role = 'Admin' | 'User'

export interface UserProfile {
  id: string
  email: string
  displayName: string
  roles: Role[]
}

export interface AuthResponse {
  accessToken: string
  expiresAtUtc: string
  user: UserProfile
}

export interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  code?: string
  errors?: Record<string, string[]>
}

export interface Credentials {
  email: string
  password: string
}

export interface Registration extends Credentials {
  displayName: string
}

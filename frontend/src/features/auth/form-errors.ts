import { ApiError } from '../../lib/api'

export interface FormError {
  message: string | null
  fields: Record<string, string[]>
}

export function describeAuthError(error: unknown): FormError {
  if (error instanceof ApiError) {
    if (error.code === 'invalid_credentials') {
      return { message: 'The email or password is incorrect.', fields: {} }
    }

    if (error.fieldErrors) {
      return { message: 'Check the highlighted fields.', fields: error.fieldErrors }
    }

    return { message: error.message, fields: {} }
  }

  return {
    message: 'Could not reach the server. Check your connection and try again.',
    fields: {},
  }
}

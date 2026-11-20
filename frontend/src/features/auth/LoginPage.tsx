import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, type UseFormSetError } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { z } from 'zod'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'
import { AuthLayout } from './AuthLayout'
import { describeAuthError } from './form-errors'
import { useAuth } from './useAuth'

const loginSchema = z.object({
  email: z.string().min(1, 'Enter your email address').email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const state = location.state as { from?: string } | null
  const destination = state?.from && state.from !== '/login' ? state.from : '/'

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await login(values)
      navigate(destination, { replace: true })
    } catch (error) {
      const described = describeAuthError(error)
      setFormError(described.message)
      applyFieldErrors(setError, described.fields)
    }
  })

  return (
    <AuthLayout>
      <div>
        <h1 className="text-[30px] leading-tight font-semibold tracking-[-0.03em]">Sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Use the account you registered with.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-5">
        {formError ? <Alert>{formError}</Alert> : null}

        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
        </Field>

        <Button type="submit" disabled={isSubmitting} className="mt-1 w-full">
          {isSubmitting ? 'Signing in' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Need an account?{' '}
        <Link
          to="/register"
          className="font-medium text-accent underline-offset-4 hover:underline"
        >
          Create one
        </Link>
        .
      </p>
    </AuthLayout>
  )
}

function applyFieldErrors(
  setError: UseFormSetError<LoginValues>,
  fields: Record<string, string[]>,
) {
  for (const [name, messages] of Object.entries(fields)) {
    if (name === 'email' || name === 'password') {
      setError(name, { message: messages[0] })
    }
  }
}

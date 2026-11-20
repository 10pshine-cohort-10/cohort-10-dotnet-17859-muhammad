import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'
import { ApiError } from '../../lib/api'
import { AuthLayout } from './AuthLayout'
import { describeAuthError } from './form-errors'
import { useAuth } from './useAuth'

const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, 'Enter your name')
      .max(100, 'Keep your name under 100 characters'),
    email: z.string().min(1, 'Enter your email address').email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Use at least 8 characters')
      .regex(/[A-Z]/, 'Add an uppercase letter')
      .regex(/[a-z]/, 'Add a lowercase letter')
      .regex(/[0-9]/, 'Add a digit')
      .regex(/[^A-Za-z0-9]/, 'Add a symbol'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const { register: registerAccount } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await registerAccount({
        displayName: values.displayName,
        email: values.email,
        password: values.password,
      })
      navigate('/', { replace: true })
    } catch (error) {
      if (error instanceof ApiError && error.code === 'email_taken') {
        setError('email', { message: 'An account with this email already exists.' })
        return
      }

      const described = describeAuthError(error)
      setFormError(described.message)

      for (const [name, messages] of Object.entries(described.fields)) {
        if (name === 'displayName' || name === 'email' || name === 'password') {
          setError(name, { message: messages[0] })
        }
      }
    }
  })

  return (
    <AuthLayout>
      <div>
        <h1 className="text-[30px] leading-tight font-semibold tracking-[-0.03em]">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted">
          Your own task board, in any browser.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-5">
        {formError ? <Alert>{formError}</Alert> : null}

        <Field label="Name" htmlFor="displayName" error={errors.displayName?.message}>
          <Input
            id="displayName"
            autoComplete="name"
            placeholder="Ada Lovelace"
            aria-invalid={Boolean(errors.displayName)}
            {...register('displayName')}
          />
        </Field>

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

        <Field
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          hint="At least 8 characters with an uppercase letter, a lowercase letter, a digit, and a symbol."
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
        </Field>

        <Field
          label="Confirm password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
        </Field>

        <Button type="submit" disabled={isSubmitting} className="mt-1 w-full">
          {isSubmitting ? 'Creating account' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent underline-offset-4 hover:underline">
          Sign in
        </Link>
        .
      </p>
    </AuthLayout>
  )
}

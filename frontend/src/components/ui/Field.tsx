import { clsx } from 'clsx'
import type { ComponentProps, ReactNode } from 'react'

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: ReactNode
}

export function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  const describedBy = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined

  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div aria-describedby={describedBy}>{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} className="text-sm text-urgent">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={clsx(
        'h-10 w-full rounded-sm border border-line bg-surface px-3 text-[15px] text-ink shadow-none transition-colors placeholder:text-muted hover:border-line-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15',
        className,
      )}
      {...props}
    />
  )
}

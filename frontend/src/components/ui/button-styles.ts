import { clsx } from 'clsx'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const base =
  'inline-flex h-10 items-center justify-center gap-2 rounded-sm px-4 text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-surface hover:bg-ink-soft',
  secondary: 'border border-line bg-surface text-ink hover:border-line-strong',
  ghost: 'text-ink-soft hover:bg-surface hover:text-ink',
  danger: 'bg-urgent text-surface hover:bg-urgent/90',
}

export function buttonStyles(variant: ButtonVariant = 'primary', className?: string): string {
  return clsx(base, variants[variant], className)
}

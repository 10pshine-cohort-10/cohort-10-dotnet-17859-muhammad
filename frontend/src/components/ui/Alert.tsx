import { clsx } from 'clsx'
import { CircleAlert, CircleCheck } from 'lucide-react'
import type { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
  tone?: 'error' | 'success'
}

export function Alert({ children, tone = 'error' }: AlertProps) {
  const Icon = tone === 'error' ? CircleAlert : CircleCheck

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={clsx(
        'flex items-start gap-2.5 border px-3 py-2.5 text-sm',
        tone === 'error'
          ? 'border-urgent/25 bg-urgent-soft text-urgent'
          : 'border-success/25 bg-success/5 text-success',
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} />
      <div>{children}</div>
    </div>
  )
}

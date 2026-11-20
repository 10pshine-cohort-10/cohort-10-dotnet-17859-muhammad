import { clsx } from 'clsx'
import { Link } from 'react-router'

interface WordmarkProps {
  tone?: 'default' | 'inverse'
  to?: string
  className?: string
}

export function Wordmark({ tone = 'default', to = '/', className }: WordmarkProps) {
  return (
    <Link
      to={to}
      className={clsx(
        'inline-flex w-fit items-center gap-2.5',
        tone === 'inverse' ? 'text-surface' : 'text-ink',
        className,
      )}
      aria-label="Docket home"
    >
      <span
        aria-hidden="true"
        className={clsx(
          'relative flex size-6 items-center justify-center',
          tone === 'inverse' ? 'bg-surface' : 'bg-ink',
        )}
      >
        <span className={clsx('size-2.5', tone === 'inverse' ? 'bg-ink' : 'bg-surface')} />
        <span className="absolute right-0.5 bottom-0.5 size-1 bg-urgent" />
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.02em]">Docket</span>
    </Link>
  )
}

import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
      <div>
        <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.025em] text-balance">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-[62ch] text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {children}
    </header>
  )
}

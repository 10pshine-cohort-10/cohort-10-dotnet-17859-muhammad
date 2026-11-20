import { ListChecks } from 'lucide-react'
import { Link } from 'react-router'
import { PageHeader } from '../../components/PageHeader'
import { buttonStyles } from '../../components/ui/button-styles'
import { useAuth } from '../auth/useAuth'

const counts = [
  { label: 'To do', value: 0, tone: 'text-ink' },
  { label: 'In progress', value: 0, tone: 'text-accent' },
  { label: 'Done', value: 0, tone: 'text-success' },
] as const

export function DashboardPage() {
  const { user } = useAuth()
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  const firstName = user?.displayName.split(' ')[0] ?? 'there'

  return (
    <>
      <PageHeader
        title={`Today, ${firstName}`}
        description={`${today}. This is where the day stands.`}
      />

      <section aria-label="Task status" className="mt-8 grid border-y border-line sm:grid-cols-3">
        {counts.map((count, index) => (
          <div
            key={count.label}
            className={
              index === 0
                ? 'py-5 sm:px-6'
                : 'border-t border-line py-5 sm:border-t-0 sm:border-l sm:px-6'
            }
          >
            <p className={`text-[38px] leading-none font-semibold tracking-[-0.03em] tabular ${count.tone}`}>
              {count.value}
            </p>
            <p className="mt-2 text-sm text-muted">{count.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-12" aria-labelledby="your-tasks">
        <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
          <h2 id="your-tasks" className="text-xl font-semibold tracking-[-0.02em]">
            Your tasks
          </h2>
          <Link to="/tasks" className="text-sm font-medium text-accent underline-offset-4 hover:underline">
            View all
          </Link>
        </div>

        <div className="grid gap-8 py-12 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <p className="text-lg font-medium">Nothing on the board yet.</p>
            <p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-muted">
              Tasks you create will land here with their priority, category, and due date. Until
              then, this is the quiet version of the day.
            </p>
          </div>

          <svg
            aria-hidden="true"
            viewBox="0 0 120 96"
            className="h-24 w-28 text-line-strong"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20 10h52l24 24v52H20z" />
            <path d="M72 10v24h24" />
            <path d="M34 48h40M34 60h32M34 72h24" />
            <path d="M82 66l6 6 12-14" className="text-accent" strokeWidth="2" />
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <Link to="/tasks" className={buttonStyles('secondary')}>
            <ListChecks aria-hidden="true" className="size-4" strokeWidth={1.8} />
            Open tasks
          </Link>
        </div>
      </section>
    </>
  )
}

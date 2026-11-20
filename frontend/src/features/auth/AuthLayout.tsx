import type { ReactNode } from 'react'
import { Wordmark } from '../../components/Wordmark'

const sampleTasks = [
  { title: 'Review the release checklist', meta: '09:30', state: 'open' },
  { title: "Draft next week's plan", meta: 'In progress', state: 'active' },
  { title: 'Book the venue for Thursday', meta: 'Done', state: 'done' },
] as const

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink px-12 py-10 text-surface lg:flex">
        <Wordmark tone="inverse" to="/login" />

        <div className="max-w-[30rem]">
          <h2 className="text-[42px] leading-[1.05] font-semibold tracking-[-0.035em] text-balance">
            A day you can see.
          </h2>
          <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-surface/70">
            Tasks, priorities, and due dates in one calm list. Nothing to configure before you
            start.
          </p>

          <div className="mt-12 border-y border-surface/15">
            <p className="py-3 text-xs font-medium tracking-[0.08em] text-surface/60 uppercase">
              Today
            </p>
            <ul className="divide-y divide-surface/10">
              {sampleTasks.map((task) => (
                <li key={task.title} className="flex items-center gap-3 py-3.5">
                  <span
                    aria-hidden="true"
                    className={
                      task.state === 'done'
                        ? 'grid size-4 place-items-center border border-surface/40 bg-surface/20'
                        : 'size-4 border border-surface/40'
                    }
                  >
                    {task.state === 'done' ? <span className="size-1.5 bg-surface" /> : null}
                  </span>
                  <span
                    className={
                      task.state === 'done'
                        ? 'text-sm text-surface/60 line-through'
                        : 'text-sm text-surface/90'
                    }
                  >
                    {task.title}
                  </span>
                  <span className="ml-auto text-xs text-surface/60 tabular">{task.meta}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-xs text-surface/60">Two roles. One board.</p>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <div className="lg:hidden">
          <Wordmark to="/login" />
        </div>
        <div className="page-enter mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">
          {children}
        </div>
      </main>
    </div>
  )
}

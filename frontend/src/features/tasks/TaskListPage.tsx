import { PageHeader } from '../../components/PageHeader'

export function TaskListPage() {
  return (
    <>
      <PageHeader
        title="Tasks"
        description="Everything on your board, in one list."
      />

      <div className="mt-8 border-y border-line py-12">
        <p className="text-lg font-medium">No tasks yet.</p>
        <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-muted">
          When you add a task it will appear here with its status, priority, category, and due
          date. Nothing is hidden behind a filter.
        </p>
      </div>
    </>
  )
}

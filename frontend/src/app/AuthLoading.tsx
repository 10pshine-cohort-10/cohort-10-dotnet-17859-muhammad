import { LoaderCircle } from 'lucide-react'

export function AuthLoading() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="flex items-center gap-2.5 text-sm text-muted" role="status" aria-live="polite">
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" strokeWidth={1.8} />
        <span>Restoring your session</span>
      </div>
    </div>
  )
}

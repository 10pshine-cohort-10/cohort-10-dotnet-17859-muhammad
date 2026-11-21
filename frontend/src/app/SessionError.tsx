import { Link } from 'react-router'
import { Wordmark } from '../components/Wordmark'
import { Button } from '../components/ui/Button'
import { buttonStyles } from '../components/ui/button-styles'

export function SessionError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-[420px]">
        <Wordmark />
        <h1 className="mt-10 text-[26px] font-semibold tracking-[-0.02em]">
          We could not check your session.
        </h1>
        <p className="mt-2 text-sm text-muted">
          The server did not respond. Your session is still valid if the connection returns.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={onRetry}>Try again</Button>
          <Link to="/login" className={buttonStyles('secondary')}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

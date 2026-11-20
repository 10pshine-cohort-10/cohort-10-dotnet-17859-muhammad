import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../auth/useAuth'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  if (!user) return null

  async function handleSignOut() {
    setSigningOut(true)
    await logout().catch(() => undefined)
    navigate('/login', { replace: true })
  }

  return (
    <>
      <PageHeader title="Profile" description="The account you use to sign in to Docket." />

      <section className="mt-10 grid gap-10 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
        <div
          aria-hidden="true"
          className="grid size-20 place-items-center bg-ink text-xl font-semibold tracking-wide text-surface"
        >
          {initials(user.displayName)}
        </div>

        <dl className="divide-y divide-line border-y border-line">
          <div className="grid gap-1 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6">
            <dt className="text-sm text-muted">Name</dt>
            <dd className="text-sm font-medium">{user.displayName}</dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6">
            <dt className="text-sm text-muted">Email</dt>
            <dd className="text-sm">{user.email}</dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6">
            <dt className="text-sm text-muted">Role</dt>
            <dd className="text-sm">
              <span className="border border-line bg-surface px-2 py-0.5 text-xs font-medium">
                {user.roles.join(', ')}
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-12 border-t border-line pt-6">
        <h2 className="text-base font-semibold">Session</h2>
        <p className="mt-1 max-w-[56ch] text-sm text-muted">
          Signing out ends this session on this device. Your tasks stay where they are.
        </p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? 'Signing out' : 'Sign out'}
        </Button>
      </section>
    </>
  )
}

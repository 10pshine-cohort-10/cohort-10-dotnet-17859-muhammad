import { clsx } from 'clsx'
import {
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { Wordmark } from '../components/Wordmark'
import { useAuth } from '../features/auth/useAuth'

interface NavItemProps {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  onNavigate?: () => void
}

function NavItem({ to, label, icon: Icon, end, onNavigate }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 border px-3 py-2 text-sm transition-colors duration-150',
          isActive
            ? 'border-line bg-surface font-medium text-ink'
            : 'border-transparent text-ink-soft hover:bg-surface/70 hover:text-ink',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
          <span>{label}</span>
          <span
            aria-hidden="true"
            className={clsx('ml-auto size-1.5', isActive ? 'bg-accent' : 'bg-transparent')}
          />
        </>
      )}
    </NavLink>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await logout().catch(() => undefined)
    navigate('/login', { replace: true })
  }

  return (
    <>
      <Wordmark />

      <nav aria-label="Primary" className="mt-10 grid gap-1">
        <NavItem to="/" label="Today" icon={LayoutDashboard} end onNavigate={onNavigate} />
        <NavItem to="/tasks" label="Tasks" icon={ListTodo} onNavigate={onNavigate} />
        <NavItem to="/profile" label="Profile" icon={UserRound} onNavigate={onNavigate} />
      </nav>

      <div className="mt-auto border-t border-line pt-4">
        <p className="truncate text-sm font-medium text-ink">{user?.displayName}</p>
        <p className="truncate text-xs text-muted">{user?.email}</p>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-3 inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <LogOut aria-hidden="true" className="size-4" strokeWidth={1.8} />
          Sign out
        </button>
      </div>
    </>
  )
}

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (!menuOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="hidden border-r border-line px-5 py-6 lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-canvas px-5 lg:hidden">
          <Wordmark />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="grid size-9 place-items-center border border-line bg-surface text-ink"
          >
            <Menu aria-hidden="true" className="size-4" strokeWidth={1.8} />
          </button>
        </header>

        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div key={location.pathname} className="page-enter mx-auto w-full max-w-[1080px]">
            <Outlet />
          </div>
        </main>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ink/45"
          />
          <div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="relative flex h-full w-[280px] flex-col border-r border-line bg-canvas p-5 shadow-float"
          >
            <div className="mb-6 flex items-center justify-between">
              <Wordmark />
              <button
                type="button"
                autoFocus
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation"
                className="grid size-9 place-items-center border border-line bg-surface text-ink"
              >
                <X aria-hidden="true" className="size-4" strokeWidth={1.8} />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

import type { ReactNode } from 'react'
import { useLogout } from '@/hooks/useAuth'

/**
 * Esce dall'area admin: useLogout toglie l'utente dalla cache,
 * e RequireStaff rimanda al login da solo. L'aspetto lo decide chi lo usa.
 */
export function LogoutButton({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const logout = useLogout()

  return (
    <button
      type="button"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      aria-busy={logout.isPending}
      className={className}
    >
      {children}
    </button>
  )
}

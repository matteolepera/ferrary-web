import { AdminButton } from '@/components/admin/ui/AdminButton'
import { useLogout } from '@/hooks/useAuth'

/**
 * Esce dall'area admin: useLogout toglie l'utente dalla cache,
 * e RequireStaff rimanda al login da solo.
 */
export function LogoutButton() {
  const logout = useLogout()

  return (
    <AdminButton
      variant="outline"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
    >
      {logout.isPending ? 'Uscita in corso…' : 'Esci'}
    </AdminButton>
  )
}

import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { PageLoader } from '@/components/layout/PageLoader'
import { useCurrentUser } from '@/hooks/useAuth'

/**
 * Mostra l'area admin solo allo staff collegato; gli altri vanno al login,
 * con la pagina richiesta nell'indirizzo per tornarci dopo.
 * Protegge l'esperienza: i dati li protegge il backend, a ogni richiesta.
 */
export function RequireStaff({ children }: { children: ReactNode }) {
  const { data: user, isPending, isError, refetch } = useCurrentUser()
  const location = useLocation()

  if (isPending) {
    return <PageLoader />
  }

  // Il server non risponde: non sappiamo chi è collegato, quindi niente login forzato
  if (isError) {
    return (
      <div
        lang="it"
        role="alert"
        className="bg-notte flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center text-neutral-100"
      >
        <p className="max-w-sm text-[0.9375rem] leading-relaxed text-neutral-300">
          Impossibile verificare l'accesso: il server non risponde.
        </p>
        <AdminButton variant="outline" onClick={() => refetch()}>
          Riprova
        </AdminButton>
      </div>
    )
  }

  if (!user) {
    const requested = encodeURIComponent(location.pathname + location.search)

    return <Navigate to={`/admin/login?da=${requested}`} replace />
  }

  return children
}

import { Outlet } from 'react-router'
import { AdminRail } from '@/components/admin/AdminRail'
import { NavigationProgress } from '@/components/layout/NavigationProgress'

/**
 * La cornice dell'area admin, solo in italiano: la barra a pillola e il contenuto.
 */
export function AdminLayout() {
  return (
    <div lang="it" className="bg-notte flex min-h-dvh text-neutral-100">
      <NavigationProgress />

      <a
        href="#contenuto"
        className="focus:text-notte sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold"
      >
        Vai al contenuto
      </a>

      <AdminRail />

      <main
        id="contenuto"
        tabIndex={-1}
        className="min-w-0 flex-1 px-4 pt-6 pb-28 outline-none md:px-8 lg:py-7 lg:pr-8 lg:pl-2"
      >
        <Outlet />
      </main>
    </div>
  )
}

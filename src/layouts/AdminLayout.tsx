import { Outlet } from 'react-router'
import { AdminRail } from '@/components/admin/AdminRail'
import { NavigationProgress } from '@/components/layout/NavigationProgress'
import { SmallScreenNotice } from '@/components/admin/SmallScreenNotice'

/**
 * La cornice dell'area admin, solo in italiano: la barra a pillola e il contenuto.
 */
export function AdminLayout() {
  return (
    <div lang="it">
      <SmallScreenNotice />

      {/* L'area vera: nascosta sul telefono, dai 700 pixel in su */}
      <div className="bg-notte hidden min-h-dvh text-neutral-100 min-[700px]:flex">
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
          className="min-w-0 flex-1 py-6 pr-6 pl-2 outline-none lg:py-7 lg:pr-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

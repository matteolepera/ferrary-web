import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Outlet,
  ScrollRestoration,
  useLocation,
} from 'react-router'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Dock } from '@/components/layout/Dock'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { NavigationProgress } from '@/components/layout/NavigationProgress'

/**
 * Cornice del sito pubblico. L'intestazione è trasparente e sta sopra l'apertura di ogni pagina.
 */
export function PublicLayout() {
  const { t } = useTranslation()

  const location = useLocation()
  const main = useRef<HTMLElement>(null)
  const previousPath = useRef(location.pathname)

  // Cambiando pagina, il focus passa al contenuto: la tastiera riparte da lì,
  // e un lettore di schermo si accorge che la pagina è cambiata
  useEffect(() => {
    if (previousPath.current === location.pathname) {
      return
    }

    previousPath.current = location.pathname
    main.current?.focus({ preventScroll: true })
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <NavigationProgress />
      {/* Invisibile finché non lo si raggiunge con Tab: salta menu e intestazione */}
      <a
        href="#contenuto"
        className="focus:text-notte sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold"
      >
        {t('nav.skip')}
      </a>
      <SiteHeader />

      <main
        ref={main}
        id="contenuto"
        tabIndex={-1}
        className="flex-1 focus:outline-none"
      >
        <Outlet />
      </main>

      <SiteFooter />
      <Dock />
      {/* Scorre fino alle ancore e ricorda la posizione tornando indietro */}
      <ScrollRestoration />
    </div>
  )
}

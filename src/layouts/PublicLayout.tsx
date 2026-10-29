import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Link,
  NavLink,
  Outlet,
  ScrollRestoration,
  useLocation,
} from 'react-router'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Logo } from '@/components/Logo'
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

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'text-xs font-semibold tracking-[0.18em] uppercase transition-colors',
      isActive ? 'text-white' : 'text-neutral-300 hover:text-white',
    ].join(' ')

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
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-5 py-5 md:px-10 md:py-7">
          <Link to="/" aria-label={t('nav.home')}>
            <Logo alt="" className="h-7 w-auto md:h-8" />
          </Link>

          {/* Su mobile e tablet la navigazione è nel dock in basso */}
          <nav aria-label={t('nav.main')} className="hidden gap-10 lg:flex">
            <NavLink to="/modelli" className={linkClass}>
              {t('nav.archive')}
            </NavLink>
            <Link to="/#famiglie" className={linkClass({ isActive: false })}>
              {t('nav.families')}
            </Link>
            <NavLink to="/storia" className={linkClass}>
              {t('nav.story')}
            </NavLink>
          </nav>

          <LanguageSwitcher />
        </div>
      </header>

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

import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet } from 'react-router'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Logo } from '@/components/Logo'

/**
 * Cornice del sito pubblico. L'intestazione è trasparente e sta sopra l'apertura di ogni pagina.
 */
export function PublicLayout() {
  const { t } = useTranslation()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'text-xs font-semibold tracking-[0.18em] uppercase transition-colors',
      isActive ? 'text-white' : 'text-neutral-300 hover:text-white',
    ].join(' ')

  return (
    <div className="flex min-h-screen flex-col">
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
            <Link to="/#ere" className={linkClass({ isActive: false })}>
              {t('nav.eras')}
            </Link>
            <NavLink to="/storia" className={linkClass}>
              {t('nav.story')}
            </NavLink>
          </nav>

          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

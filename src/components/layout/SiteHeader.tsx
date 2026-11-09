import { Search } from 'lucide-react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Logo } from '@/components/Logo'
import { CatalogsMenu } from '@/components/layout/CatalogsMenu'
import { HeaderSearch } from '@/components/layout/HeaderSearch'
import { YBar } from '@/components/layout/YBar'
import { useScrolled } from '@/hooks/useScrolled'

/** Una voce della barra: si accende di bianco, il riflettore e il segno rosso le danno la luce */
const itemClass = (active: boolean) =>
  [
    'relative z-10 h-11 px-5 text-[0.6875rem] font-semibold tracking-[0.18em] uppercase transition-colors duration-300',
    'focus-visible:outline-rosso-acceso focus-visible:outline-2',
    active ? 'text-white' : 'text-neutral-400 hover:text-white',
  ].join(' ')

/**
 * L'intestazione del sito pubblico.
 * Dal desktop: la barra con la forma della Y, il logo, le voci con il riflettore, la ricerca e la lingua.
 * Su mobile e tablet: solo il logo e la lingua, perché le voci stanno nel dock.
 */
export function SiteHeader() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const scrolled = useScrolled()

  // Il riflettore: posizione e larghezza della voce attiva, misurate sulla pagina
  const list = useRef<HTMLUListElement>(null)
  const [spot, setSpot] = useState<{ left: number; width: number } | null>(null)

  // La barra cambia forma: le voci, oppure il campo di ricerca
  const [searching, setSearching] = useState(false)
  const searchButton = useRef<HTMLButtonElement>(null)

  // Chiusa la ricerca, il focus torna sul pulsante "Cerca": chi usa la tastiera non si perde
  const closeSearch = useCallback(() => {
    setSearching(false)
    requestAnimationFrame(() => searchButton.current?.focus())
  }, [])

  useLayoutEffect(() => {
    const active = list.current?.querySelector<HTMLElement>(
      '[aria-current="page"], [data-active]',
    )
    setSpot(
      active ? { left: active.offsetLeft, width: active.offsetWidth } : null,
    )
    // Anche cambiando lingua, e quando le voci tornano dopo la ricerca: vanno rimisurate
  }, [pathname, i18n.language, searching])

  return (
    // Solo dal desktop: su telefono e tablet logo, ricerca e lingua stanno nel dock
    <header className="fixed inset-x-0 top-0 z-30 hidden lg:block">
      {/* Dal desktop, appena si scorre: un velo scuro dietro la barra */}
      <div
        aria-hidden="true"
        className={[
          'from-notte via-notte/70 pointer-events-none absolute inset-x-0 top-0 hidden h-32 bg-linear-to-b to-transparent transition-opacity duration-300 lg:block',
          scrolled ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      {/* La barra della Y al centro, con il logo, le voci e la lingua dentro */}
      <div className="relative mx-auto mt-6 flex h-[3.75rem] w-[50rem] items-center pr-5 pl-7 drop-shadow-[0_14px_30px_rgba(0,0,0,0.55)]">
        <YBar />

        <Link to="/" aria-label={t('nav.home')} className="relative mr-6">
          <Logo className="h-7 w-auto" />
        </Link>

        {/* Dal desktop: le voci, oppure il campo di ricerca. Su mobile le voci stanno nel dock */}
        {searching ? (
          <HeaderSearch onClose={closeSearch} />
        ) : (
          <nav
            aria-label={t('nav.main')}
            className="relative flex items-center"
          >
            <ul ref={list} className="relative flex items-center">
              {/* Il riflettore: un cono di luce dall'alto sulla voce attiva, che scivola da una voce all'altra */}
              <li
                aria-hidden="true"
                className="pointer-events-none absolute -top-2 h-[3.75rem] bg-[radial-gradient(ellipse_60%_75%_at_50%_0%,rgba(255,255,255,0.2),rgba(255,255,255,0.05)_55%,transparent_75%)] transition-[left,width,opacity] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{
                  left: spot?.left ?? 0,
                  width: spot?.width ?? 0,
                  opacity: spot ? 1 : 0,
                }}
              >
                {/* Il segno rosso, obliquo come la gamba della Y */}
                <span className="bg-rosso-acceso absolute bottom-2.5 left-1/2 h-[3px] w-[18px] -translate-x-1/2 -skew-x-[28deg] shadow-[0_0_10px_rgba(255,59,48,0.8)]" />
              </li>
              <li>
                <NavLink
                  to="/modelli"
                  className={({ isActive }) => itemClass(isActive)}
                >
                  {t('nav.archive')}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/storia"
                  className={({ isActive }) => itemClass(isActive)}
                >
                  {t('nav.story')}
                </NavLink>
              </li>
              <li>
                <CatalogsMenu itemClass={itemClass} />
              </li>
            </ul>

            {/* Il separatore, inclinato come la Y */}
            <span
              aria-hidden="true"
              className="relative mx-2 h-6 w-px -skew-x-[20deg] bg-white/12"
            />

            <button
              ref={searchButton}
              type="button"
              onClick={() => setSearching(true)}
              className={`${itemClass(false)} flex items-center gap-2.5`}
            >
              <Search aria-hidden="true" className="size-3.5" />
              {t('nav.search')}
            </button>
          </nav>
        )}

        {/* Durante la ricerca la lingua lascia tutto lo spazio al campo */}
        {!searching && (
          <div className="relative ml-auto">
            <LanguageSwitcher />
          </div>
        )}
      </div>
    </header>
  )
}

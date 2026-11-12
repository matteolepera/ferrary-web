import {
  ClockCounterClockwiseIcon,
  GarageIcon,
  ListIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router'
import monogram from '@/assets/brand/ferrary-y-rosso.svg'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { MobileSearch } from '@/components/layout/MobileSearch'
import { catalogLinks, isCatalogPath } from '@/components/layout/publicNav'

// Su mobile icona sopra e etichetta sotto; dal tablet in su sulla stessa riga
const itemClass = [
  'relative flex h-14 flex-col items-center justify-center gap-1 transition-colors',
  'text-[0.625rem] font-semibold tracking-wide',
  'md:flex-row md:gap-2 md:text-xs md:tracking-[0.14em] md:uppercase',
  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-rosso-acceso',
].join(' ')

/**
 * La voce attiva, come sulla barra del desktop: il riflettore dall'alto e il segno rosso obliquo.
 * Qui il segno sta in alto, sul bordo del dock, perché il dock è in fondo allo schermo.
 */
const stateClass = (active: boolean) =>
  active
    ? [
        'text-white',
        "before:pointer-events-none before:absolute before:inset-x-1 before:-top-1.5 before:bottom-0 before:content-['']",
        'before:bg-[radial-gradient(ellipse_60%_70%_at_50%_0%,rgba(255,255,255,0.2),rgba(255,255,255,0.04)_55%,transparent_75%)]',
        "after:absolute after:-top-1.5 after:left-1/2 after:h-[3px] after:w-4 after:-translate-x-1/2 after:-skew-x-[28deg] after:content-['']",
        'after:bg-rosso-acceso after:shadow-[0_0_10px_rgba(255,59,48,0.8)]',
      ].join(' ')
    : 'text-neutral-400 hover:text-white'

const iconClass = 'relative size-5 md:size-4'

/** Il peso dell'icona: sottile a riposo, piena sulla voce attiva, insieme al riflettore */
const weight = (active: boolean) => (active ? 'fill' : 'light')

const menuLinkClass =
  'border-b border-linea py-3 font-display text-4xl font-extrabold tracking-[-0.035em] focus-visible:outline-2 focus-visible:outline-rosso-acceso'

/**
 * Navigazione di mobile e tablet: un dock fluttuante in basso, con il monogramma al centro,
 * con la stessa forma e la stessa luce della barra del desktop.
 */
export function Dock() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const firstLink = useRef<HTMLAnchorElement>(null)

  // Con il menu o la ricerca aperti: pagina sotto ferma; con il menu, focus sulla prima voce ed Esc per chiudere
  useEffect(() => {
    if (!open && !searching) {
      return
    }

    if (open) firstLink.current?.focus()
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)

    // Pulizia: quando il menu o la ricerca si chiudono, si annulla tutto
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, searching])

  const close = () => setOpen(false)

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.menu')}
          className="bg-notte/95 fixed inset-0 z-40 flex flex-col px-6 pt-8 pb-32 backdrop-blur-md lg:hidden"
        >
          {/* Il menu: quello che nel dock non entra, cioè i cataloghi e la lingua */}
          <nav aria-label={t('catalogs.eyebrow')} className="flex flex-col">
            <p className="text-rosso-acceso mb-3 text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
              {t('catalogs.eyebrow')}
            </p>
            {catalogLinks.map((link, place) => (
              <Link
                key={link.to}
                ref={place === 0 ? firstLink : undefined}
                to={link.to}
                onClick={close}
                aria-current={pathname.startsWith(link.to) ? 'page' : undefined}
                className={`${menuLinkClass} ${pathname.startsWith(link.to) ? 'text-rosso-acceso' : ''}`}
              >
                {t(link.label)}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <LanguageSwitcher />
          </div>
        </div>
      )}

      {searching && <MobileSearch onClose={() => setSearching(false)} />}

      {/* Il dock: icone con etichetta, il monogramma al centro */}
      <nav
        aria-label={t('nav.quick')}
        className={[
          'fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 mx-auto',
          'grid h-[4.25rem] w-[calc(100%-1.75rem)] max-w-sm grid-cols-[1fr_1fr_auto_1fr_1fr] items-center px-2',
          'md:max-w-xl lg:hidden',
        ].join(' ')}
      >
        {/*
          Il fondo, con la forma della Y: un livello a sé, sotto le voci.
          Il taglio in basso a destra ritaglia solo lui, non il monogramma che sporge sopra.
        */}
        <span
          aria-hidden="true"
          className={[
            'absolute inset-0 rounded-[4px] rounded-tl-[22px] backdrop-blur-xl',
            'bg-neutral-900/85 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.022)_0_2px,transparent_2px_6px)]',
            // Il bordo e il filo di luce in alto, come ombre interne: un bordo vero verrebbe tagliato con l'angolo
            'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]',
            '[clip-path:polygon(0_0,100%_0,100%_calc(100%-22px),calc(100%-22px)_100%,0_100%)]',
          ].join(' ')}
        >
          {/* Il bordo del taglio, che le ombre interne non disegnano */}
          <span className="absolute right-0 bottom-0 h-px w-[31px] origin-bottom-right -rotate-45 bg-white/12" />
        </span>

        {/* Archivio e La storia: il contenuto è una funzione, così l'icona sa se la voce è attiva */}
        <NavLink
          to="/modelli"
          className={({ isActive }) => `${itemClass} ${stateClass(isActive)}`}
        >
          {({ isActive }) => (
            <>
              <GarageIcon
                aria-hidden="true"
                weight={weight(isActive)}
                className={iconClass}
              />
              <span className="relative">{t('nav.archive')}</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/storia"
          className={({ isActive }) => `${itemClass} ${stateClass(isActive)}`}
        >
          {({ isActive }) => (
            <>
              <ClockCounterClockwiseIcon
                aria-hidden="true"
                weight={weight(isActive)}
                className={iconClass}
              />
              <span className="relative">{t('nav.story')}</span>
            </>
          )}
        </NavLink>

        {/* Il monogramma: sollevato sopra il dock, con l'angolo della Y, riporta alla home */}
        <Link
          to="/"
          aria-label={t('nav.home')}
          className={[
            'relative mx-1.5 flex size-[3.625rem] -translate-y-3 items-center justify-center rounded-[4px] rounded-tl-[18px]',
            'border-rosso bg-notte border shadow-[0_0_0_4px_rgba(5,5,5,0.6),0_0_24px_rgba(212,0,0,0.35)]',
            'focus-visible:outline-rosso-acceso focus-visible:outline-2 md:size-16',
          ].join(' ')}
        >
          <img src={monogram} alt="" className="h-6 w-auto md:h-7" />
        </Link>

        {/* Cerca: la ricerca a tutto schermo, con il campo in alto e la tastiera aperta */}
        <button
          type="button"
          aria-expanded={searching}
          onClick={() => {
            setOpen(false)
            setSearching(!searching)
          }}
          className={`${itemClass} ${stateClass(searching)}`}
        >
          <MagnifyingGlassIcon
            aria-hidden="true"
            weight={weight(searching)}
            className={iconClass}
          />
          <span className="relative">{t('nav.search')}</span>
        </button>

        <button
          type="button"
          aria-expanded={open}
          onClick={() => {
            setSearching(false)
            setOpen(!open)
          }}
          // Acceso anche sulle pagine dei cataloghi, che stanno nel menu
          className={`${itemClass} ${stateClass(open || isCatalogPath(pathname))}`}
        >
          {/* La X resta sottile: un'icona piena per "chiudi" sarebbe troppo pesante */}
          {open ? (
            <XIcon aria-hidden="true" weight="light" className={iconClass} />
          ) : (
            <ListIcon
              aria-hidden="true"
              weight={weight(isCatalogPath(pathname))}
              className={iconClass}
            />
          )}
          <span className="relative">
            {open ? t('nav.close') : t('nav.menu')}
          </span>
        </button>
      </nav>
    </>
  )
}

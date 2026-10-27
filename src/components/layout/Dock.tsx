import { History, LayoutGrid, Menu, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router'
import monogram from '@/assets/brand/ferrary-y-rosso.svg'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

// Su mobile icona sopra e etichetta sotto; dal tablet in su sulla stessa riga
const itemClass = [
  'flex h-14 flex-col items-center justify-center gap-1 rounded-full transition-colors',
  'text-[0.625rem] font-semibold tracking-wide',
  'md:flex-row md:gap-2 md:text-xs md:tracking-[0.14em] md:uppercase',
  'focus-visible:outline-2 focus-visible:outline-rosso-acceso',
].join(' ')

const idle = 'text-neutral-300 hover:text-white'

const menuLinkClass =
  'border-b border-linea py-3 font-display text-4xl font-extrabold tracking-[-0.035em] focus-visible:outline-2 focus-visible:outline-rosso-acceso'

/**
 * Navigazione di mobile e tablet: un dock fluttuante in basso, con il monogramma al centro.
 */
export function Dock() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const firstLink = useRef<HTMLAnchorElement>(null)

  // Con il menu aperto: focus sulla prima voce, Esc per chiudere, pagina sotto ferma
  useEffect(() => {
    if (!open) {
      return
    }

    firstLink.current?.focus()
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)

    // Pulizia: quando il menu si chiude, si annulla tutto
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

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
          <nav aria-label={t('nav.menu')} className="flex flex-col">
            <Link
              ref={firstLink}
              to="/modelli"
              onClick={close}
              className={menuLinkClass}
            >
              {t('nav.archive')}
            </Link>
            <Link to="/#ere" onClick={close} className={menuLinkClass}>
              {t('nav.eras')}
            </Link>
            <Link to="/storia" onClick={close} className={menuLinkClass}>
              {t('nav.story')}
            </Link>
          </nav>
          <div className="mt-auto">
            <LanguageSwitcher />
          </div>
        </div>
      )}

      <nav
        aria-label={t('nav.quick')}
        className={[
          'fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 mx-auto',
          'grid h-[4.25rem] w-[calc(100%-1.75rem)] max-w-sm grid-cols-[1fr_1fr_auto_1fr_1fr] items-center px-2',
          'rounded-full border border-white/12 bg-neutral-900/70 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl',
          'md:max-w-xl lg:hidden',
        ].join(' ')}
      >
        <NavLink
          to="/modelli"
          className={({ isActive }) =>
            `${itemClass} ${isActive ? 'text-white' : idle}`
          }
        >
          <LayoutGrid aria-hidden="true" className="size-5 md:size-4" />
          {t('nav.archive')}
        </NavLink>

        <Link to="/#ere" className={`${itemClass} ${idle}`}>
          <History aria-hidden="true" className="size-5 md:size-4" />
          {t('nav.eras')}
        </Link>

        {/* Il monogramma: sollevato sopra la barra, riporta alla home */}
        <Link
          to="/"
          aria-label={t('nav.home')}
          className={[
            'mx-1.5 flex size-[3.625rem] -translate-y-3 items-center justify-center rounded-full',
            'border-rosso bg-notte border shadow-[0_0_0_4px_rgba(5,5,5,0.6),0_0_24px_rgba(212,0,0,0.35)]',
            'focus-visible:outline-rosso-acceso focus-visible:outline-2 md:size-16',
          ].join(' ')}
        >
          <img src={monogram} alt="" className="h-6 w-auto md:h-7" />
        </Link>

        {/* La ricerca vera arriva con l'archivio, nella scheda 6.2 */}
        <Link to="/modelli" className={`${itemClass} ${idle}`}>
          <Search aria-hidden="true" className="size-5 md:size-4" />
          {t('nav.search')}
        </Link>

        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={`${itemClass} ${open ? 'text-white' : idle}`}
        >
          {open ? (
            <X aria-hidden="true" className="size-5 md:size-4" />
          ) : (
            <Menu aria-hidden="true" className="size-5 md:size-4" />
          )}
          {open ? t('nav.close') : t('nav.menu')}
        </button>
      </nav>
    </>
  )
}

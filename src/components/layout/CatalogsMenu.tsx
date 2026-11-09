import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import { catalogLinks, isCatalogPath } from '@/components/layout/publicNav'

type CatalogsMenuProps = {
  /** Le classi della voce, le stesse delle altre voci della pillola */
  itemClass: (active: boolean) => string
}

/**
 * La voce "Cataloghi" della pillola: apre un piccolo menu con motori, designer e piloti.
 */
export function CatalogsMenu({ itemClass }: CatalogsMenuProps) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const menuId = useId()

  // Aperto: si chiude con Esc o con un clic fuori dal menu
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    function onPointerDown(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div ref={container} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        data-active={isCatalogPath(pathname) || undefined}
        onClick={() => setOpen(!open)}
        className={`${itemClass(isCatalogPath(pathname))} flex items-center gap-1.5`}
      >
        {t('catalogs.eyebrow')}
        <ChevronDown
          aria-hidden="true"
          className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Il menu resta nella pagina anche chiuso: il pulsante lo cita con aria-controls */}
      <ul
        id={menuId}
        hidden={!open}
        className="absolute top-full left-1/2 mt-4 w-56 -translate-x-1/2 rounded-[3px] rounded-tl-[18px] bg-neutral-900 p-1.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] [clip-path:polygon(0_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%)]"
      >
        {catalogLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              onClick={() => setOpen(false)}
              aria-current={pathname.startsWith(link.to) ? 'page' : undefined}
              className={[
                'flex rounded-[2px] rounded-tl-[10px] px-4 py-3 text-sm transition-colors',
                'focus-visible:outline-rosso-acceso focus-visible:outline-2',
                pathname.startsWith(link.to)
                  ? 'bg-white/10 text-white'
                  : 'text-neutral-300 hover:bg-white/5 hover:text-white',
              ].join(' ')}
            >
              {t(link.label)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

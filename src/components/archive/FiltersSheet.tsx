import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'

type FiltersSheetProps = {
  /** Quanti risultati danno i filtri scelti, per il pulsante in fondo */
  count: number | undefined
  onClose: () => void
  children: ReactNode
}

/**
 * Pannello dei filtri a tutto schermo, per mobile e tablet.
 */
export function FiltersSheet({ count, onClose, children }: FiltersSheetProps) {
  const { t } = useTranslation()
  const closeButton = useRef<HTMLButtonElement>(null)

  // All'apertura: focus sul pulsante di chiusura, Esc per chiudere, pagina sotto ferma
  useEffect(() => {
    closeButton.current?.focus()
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filtri-titolo"
      className="bg-notte fixed inset-0 z-[60] flex flex-col lg:hidden"
    >
      <div className="border-linea flex items-center justify-between border-b px-5 py-4">
        <h2
          id="filtri-titolo"
          className="font-display text-2xl font-extrabold tracking-[-0.035em]"
        >
          {t('archive.filters.title')}
        </h2>
        <button
          ref={closeButton}
          type="button"
          aria-label={t('archive.filters.close')}
          onClick={onClose}
          className="border-linea focus-visible:outline-rosso-acceso flex size-11 items-center justify-center rounded-full border hover:border-neutral-500 focus-visible:outline-2"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">{children}</div>

      <div className="border-linea border-t p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <Button onClick={onClose} className="w-full">
          {count === undefined
            ? t('archive.filters.title')
            : t('archive.filters.show', { count })}
        </Button>
      </div>
    </div>
  )
}

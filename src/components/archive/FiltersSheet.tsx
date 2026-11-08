import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'

type FiltersSheetProps = {
  /** Quanti risultati danno i filtri scelti, per il pulsante in fondo */
  count: number | undefined
  onClose: () => void
  children: ReactNode
  /** Toglie motorizzazione e periodo; se manca, il pulsante non compare */
  onReset?: () => void
}

/**
 * Pannello dei filtri a tutto schermo, per mobile e tablet.
 */
export function FiltersSheet({
  count,
  onClose,
  onReset,
  children,
}: FiltersSheetProps) {
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
    <>
      {/* Dal desktop: lo sfondo scurito, che chiude il pannello al clic */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[59] hidden bg-black/60 lg:block"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filtri-titolo"
        className={[
          'bg-notte fixed inset-0 z-[60] flex flex-col',
          // Dal desktop un cassetto a destra, invece che a tutto schermo
          'lg:border-linea lg:left-auto lg:w-[28rem] lg:border-l',
        ].join(' ')}
      >
        <div className="border-linea flex items-center justify-between border-b px-5 py-4 lg:px-8 lg:py-6">
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

        <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-8 lg:py-8">
          {children}
        </div>

        <div className="border-linea flex items-center gap-4 border-t p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] lg:px-8">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="shrink-0 text-[0.6875rem] font-semibold tracking-[0.16em] text-neutral-300 uppercase hover:text-white"
            >
              {t('archive.filters.reset')}
            </button>
          )}
          <Button onClick={onClose} className="w-full">
            {count === undefined
              ? t('archive.filters.title')
              : t('archive.filters.show', { count })}
          </Button>
        </div>
      </div>
    </>
  )
}

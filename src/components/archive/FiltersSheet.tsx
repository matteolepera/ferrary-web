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
      {/* Lo sfondo scurito: un clic fuori dalla scheda la chiude */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[59] bg-black/60"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filtri-titolo"
        className={[
          'bg-ombra border-linea fixed z-[60] flex max-h-[85dvh] flex-col',
          // Telefono: dal basso, alta quanto il contenuto
          'inset-x-0 bottom-0 border-t',
          // Dal tablet: piccola, al centro dello schermo
          'md:inset-auto md:top-1/2 md:left-1/2 md:w-[28rem] md:-translate-x-1/2 md:-translate-y-1/2 md:border',
        ].join(' ')}
      >
        {/* La maniglia, solo su telefono: dice che la scheda viene dal basso */}
        <span
          aria-hidden="true"
          className="mx-auto mt-2.5 h-1 w-9 rounded-full bg-neutral-700 md:hidden"
        />

        <div className="flex items-center justify-between px-5 pt-4 md:px-6 md:pt-5">
          <h2
            id="filtri-titolo"
            className="font-display text-xl font-extrabold tracking-[-0.035em]"
          >
            {t('archive.filters.title')}
          </h2>
          <button
            ref={closeButton}
            type="button"
            aria-label={t('archive.filters.close')}
            onClick={onClose}
            className="border-linea focus-visible:outline-rosso-acceso flex size-9 items-center justify-center rounded-full border hover:border-neutral-500 focus-visible:outline-2"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-6 md:px-6">{children}</div>

        <div className="border-linea flex items-center justify-between gap-4 border-t px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:px-6 md:pb-4">
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="text-[0.6875rem] font-semibold tracking-[0.16em] text-neutral-300 uppercase hover:text-white"
            >
              {t('archive.filters.reset')}
            </button>
          ) : (
            // Tiene il pulsante rosso sulla destra anche quando non c'è niente da azzerare
            <span />
          )}
          <Button onClick={onClose} className="px-5 py-3">
            {count === undefined
              ? t('archive.filters.title')
              : t('archive.filters.show', { count })}
          </Button>
        </div>
      </div>
    </>
  )
}

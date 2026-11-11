import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'

type FiltersSheetProps = {
  /** Quanti risultati danno i filtri scelti, per il pulsante in fondo */
  count: number | undefined
  onClose: () => void
  children: ReactNode
  /** Toglie motorizzazione e periodo; se manca, il pulsante non compare */
  onReset?: () => void
}

/**
 * La scheda dei filtri, con la forma della Y.
 * Su telefono sale dal basso; dal tablet è piccola, al centro dello schermo.
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
          'fixed z-[60] flex max-h-[85dvh] flex-col',
          // La superficie della Y: la trama di carbonio, il bordo e il filo di luce come ombre interne
          'bg-neutral-900 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.02)_0_2px,transparent_2px_6px)]',
          'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]',
          // Telefono: dal basso, con l'angolo grande in alto a sinistra
          'inset-x-0 bottom-0 rounded-tl-[28px] rounded-tr-[4px]',
          // Dal tablet: piccola, al centro, con la forma completa e il taglio in basso a destra
          'md:inset-auto md:top-1/2 md:left-1/2 md:w-[30rem] md:-translate-x-1/2 md:-translate-y-1/2',
          'md:rounded-[4px] md:rounded-tl-[28px] md:[clip-path:polygon(0_0,100%_0,100%_calc(100%-30px),calc(100%-30px)_100%,0_100%)]',
        ].join(' ')}
      >
        {/* La maniglia, solo su telefono: dice che la scheda viene dal basso */}
        <span
          aria-hidden="true"
          className="mx-auto mt-2.5 h-1 w-9 rounded-full bg-neutral-700 md:hidden"
        />

        <div className="flex items-center justify-between px-6 pt-4 md:px-7 md:pt-6">
          <h2
            id="filtri-titolo"
            className="font-display text-2xl font-extrabold tracking-[-0.035em] md:text-[1.75rem]"
          >
            {t('archive.filters.title')}
          </h2>
          {/* La chiusura: un piccolo riquadro con l'angolo della Y, al posto del cerchio */}
          <button
            ref={closeButton}
            type="button"
            aria-label={t('archive.filters.close')}
            onClick={onClose}
            className={[
              'flex size-10 items-center justify-center rounded-[3px] rounded-tl-[12px] bg-white/[0.04] text-neutral-300 transition',
              'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]',
              'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-2',
            ].join(' ')}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 md:px-7">{children}</div>

        <div className="flex items-center justify-between gap-4 border-t border-white/8 px-6 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:px-7 md:pb-7">
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="text-[0.6875rem] font-semibold tracking-[0.16em] text-neutral-400 uppercase hover:text-white"
            >
              {t('archive.filters.reset')}
            </button>
          ) : (
            // Tiene il pulsante rosso sulla destra anche quando non c'è niente da azzerare
            <span />
          )}

          {/* Il pulsante rosso, con la forma della Y e il numero in Sora */}
          <button
            type="button"
            onClick={onClose}
            className={[
              'flex h-13 items-center rounded-[3px] rounded-tl-[16px] pr-9 pl-7 text-xs font-semibold tracking-[0.18em] text-white uppercase',
              '[clip-path:polygon(0_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%)]',
              'bg-linear-to-b from-[#E00000] to-[#B80000] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:from-[#F01010] hover:to-[#C80000]',
              // Il contorno del focus disegnato dentro: il ritaglio taglierebbe quello di fuori
              'focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white',
            ].join(' ')}
          >
            {count === undefined ? (
              t('archive.filters.title')
            ) : (
              <Trans
                i18nKey="archive.filters.show"
                count={count}
                components={{
                  n: (
                    <span className="font-display mx-1 text-sm font-extrabold tracking-normal" />
                  ),
                }}
              />
            )}
          </button>
        </div>
      </div>
    </>
  )
}

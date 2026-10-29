import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Version } from '@/types/catalog'

type VersionGalleryProps = {
  version: Version | undefined
}

const iconButtonClass = [
  'flex size-12 items-center justify-center rounded-full border border-white/30 transition-colors',
  'hover:border-rosso hover:bg-rosso focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosso-acceso',
].join(' ')

/**
 * Le foto della versione: una griglia nella pagina e un visore a schermo intero.
 */
export function VersionGallery({ version }: VersionGalleryProps) {
  const { t } = useTranslation()
  const dialog = useRef<HTMLDialogElement>(null)
  // La posizione della foto aperta nel visore, o null se il visore è chiuso
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const images = version?.images ?? []

  // Lo stato decide, l'elemento <dialog> segue: si apre e si chiude con i suoi metodi
  useEffect(() => {
    const element = dialog.current

    if (!element) {
      return
    }

    if (openIndex !== null && !element.open) {
      element.showModal()
    }

    if (openIndex === null && element.open) {
      element.close()
    }
  }, [openIndex])

  if (images.length === 0) {
    return null
  }

  const current = openIndex !== null ? images[openIndex] : undefined
  const show = (index: number) =>
    setOpenIndex((index + images.length) % images.length)

  function handleKeyDown(event: KeyboardEvent) {
    if (openIndex === null) {
      return
    }

    if (event.key === 'ArrowRight') {
      show(openIndex + 1)
    }

    if (event.key === 'ArrowLeft') {
      show(openIndex - 1)
    }
  }

  return (
    <section
      aria-labelledby="galleria-titolo"
      className="mx-auto max-w-[1360px] px-5 pb-18 md:px-10 md:pb-24 lg:pb-32"
    >
      <h2
        id="galleria-titolo"
        className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs"
      >
        {t('model.gallery')}
      </h2>

      <ul className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:gap-4 lg:grid-cols-3">
        {images.map((image, index) => (
          <li
            key={image.id}
            className={index === 0 ? 'col-span-2 lg:row-span-2' : ''}
          >
            <button
              type="button"
              aria-label={t('model.enlarge', { alt: image.alt_text })}
              onClick={() => setOpenIndex(index)}
              className="group bg-ombra focus-visible:outline-rosso-acceso block h-full w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <img
                src={image.url}
                alt=""
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
                  index === 0
                    ? 'aspect-[16/10] lg:aspect-auto lg:h-full'
                    : 'aspect-[4/3]'
                }`}
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Il visore: Esc, il focus bloccato dentro e la pagina sotto inerte li gestisce il browser */}
      <dialog
        ref={dialog}
        aria-label={t('model.gallery')}
        onClose={() => setOpenIndex(null)}
        onKeyDown={handleKeyDown}
        className="bg-notte/95 m-0 h-full max-h-none w-full max-w-none p-0 text-neutral-100 backdrop:bg-black/80"
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-4 md:px-10 md:py-6">
              <p className="text-sm text-neutral-400">
                {t('model.counter', {
                  current: (openIndex ?? 0) + 1,
                  total: images.length,
                })}
              </p>
              <button
                type="button"
                aria-label={t('model.closeGallery')}
                onClick={() => setOpenIndex(null)}
                className={iconButtonClass}
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-5 md:px-24">
              <img
                key={current.id}
                src={current.url}
                alt={current.alt_text}
                className="animate-comparsa max-h-full max-w-full object-contain"
              />
              <figcaption className="text-center text-sm text-neutral-300">
                {current.alt_text}
              </figcaption>
            </figure>

            {images.length > 1 && (
              <div className="flex justify-center gap-3 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  aria-label={t('model.previousImage')}
                  onClick={() => show((openIndex ?? 0) - 1)}
                  className={iconButtonClass}
                >
                  <ChevronLeft aria-hidden="true" className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label={t('model.nextImage')}
                  onClick={() => show((openIndex ?? 0) + 1)}
                  className={iconButtonClass}
                >
                  <ChevronRight aria-hidden="true" className="size-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </section>
  )
}

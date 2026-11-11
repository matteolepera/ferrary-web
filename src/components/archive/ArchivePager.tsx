import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { YPanel, YSeparator } from '@/components/ui/YPanel'
import { yFocusMark } from '@/components/ui/yFocus'

type ArchivePagerProps = {
  page: number
  lastPage: number
  onChange: (page: number) => void
}

/**
 * Le pagine da mostrare: la prima, l'ultima e quelle intorno all'attuale.
 * Dove ne mancano alcune c'è null, che diventa "…".
 */
function pageItems(current: number, last: number) {
  const wanted = [1, current - 1, current, current + 1, last].filter(
    (page) => page >= 1 && page <= last,
  )
  const pages = [...new Set(wanted)].sort((a, b) => a - b)

  return pages.flatMap((page, index) =>
    index > 0 && page - pages[index - 1] > 1 ? [null, page] : [page],
  )
}

const arrowClass = [
  'flex w-14 items-center justify-center transition-colors focus-visible:outline-none',
  'text-neutral-200 hover:text-rosso-acceso disabled:cursor-default disabled:text-neutral-700',
].join(' ')

/**
 * Le pagine dell'archivio, in una piccola barra con la forma della Y:
 * le frecce, e i numeri con la pagina attuale sotto il riflettore.
 */
export function ArchivePager({ page, lastPage, onChange }: ArchivePagerProps) {
  const { t } = useTranslation()

  if (lastPage <= 1) {
    return null
  }

  return (
    <nav
      aria-label={t('archive.pagination')}
      className="mt-12 flex justify-center"
    >
      <YPanel className="flex h-14 items-stretch">
        <button
          type="button"
          aria-label={t('archive.previous')}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className={`${yFocusMark} ${arrowClass}`}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </button>

        <YSeparator />

        <ol className="flex">
          {pageItems(page, lastPage).map((item, index) =>
            item === null ? (
              <li
                key={`salto-${index}`}
                aria-hidden="true"
                className="font-display flex w-7 items-center justify-center text-neutral-600"
              >
                …
              </li>
            ) : (
              <li key={item} className="flex">
                <button
                  type="button"
                  aria-label={t('archive.goToPage', { page: item })}
                  aria-current={item === page ? 'page' : undefined}
                  onClick={() => onChange(item)}
                  className={[
                    'font-display relative w-11 text-sm font-bold tabular-nums transition-colors md:w-12',
                    // Il segno rosso qui indica la pagina attuale: il focus ha il suo contorno, disegnato dentro
                    'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:-outline-offset-8',
                    item === page
                      ? [
                          'bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,rgba(255,255,255,0.2),rgba(255,255,255,0.04)_60%,transparent_80%)] text-white',
                          "after:absolute after:bottom-2.5 after:left-1/2 after:h-[3px] after:w-3.5 after:-translate-x-1/2 after:-skew-x-[28deg] after:content-['']",
                          'after:bg-rosso-acceso after:shadow-[0_0_8px_rgba(255,59,48,0.7)]',
                        ].join(' ')
                      : 'text-neutral-500 hover:text-white',
                  ].join(' ')}
                >
                  {/* "01", "02": due cifre, come i numeri di un catalogo */}
                  {String(item).padStart(2, '0')}
                </button>
              </li>
            ),
          )}
        </ol>

        <YSeparator />

        {/* L'ultima freccia lascia spazio al taglio in basso a destra */}
        <button
          type="button"
          aria-label={t('archive.next')}
          disabled={page >= lastPage}
          onClick={() => onChange(page + 1)}
          className={`${yFocusMark} ${arrowClass} pr-3 after:-ml-1.5`}
        >
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      </YPanel>

      {/* La pagina attuale, annunciata ai lettori di schermo quando cambia */}
      <p aria-live="polite" className="sr-only">
        {t('archive.page', { current: page, last: lastPage })}
      </p>
    </nav>
  )
}

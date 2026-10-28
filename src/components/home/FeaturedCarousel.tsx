import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { buttonClass } from '@/components/ui/buttonClass'
import { useHighlights } from '@/hooks/useHighlights'
import { useModels } from '@/hooks/useModels'

/** Quanti modelli mostra il carosello: i più recenti dell'archivio */
const FEATURED_COUNT = 5

const arrowClass = [
  'absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full',
  'border border-white/35 bg-notte/40 transition-colors hover:border-rosso hover:bg-rosso',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosso-acceso md:size-14',
].join(' ')

/**
 * Il carosello della home: un'auto alla volta, a tutta larghezza, con le frecce ai lati.
 */
export function FeaturedCarousel() {
  const { t } = useTranslation()
  const { data, isPending, isError } = useModels({ sort: '-year' })
  const [index, setIndex] = useState(0)

  const models = data?.data.slice(0, FEATURED_COUNT) ?? []
  const count = models.length
  // Il modulo protegge dal caso in cui, cambiando lingua, l'elenco arrivi più corto
  const current = count > 0 ? models[index % count] : undefined
  // Chiamato sempre, anche senza modello: gli hook non possono stare dentro un if
  const stats = useHighlights(current?.highlights)

  const previous = () => setIndex((index - 1 + count) % count)
  const next = () => setIndex((index + 1) % count)

  return (
    <section
      aria-roledescription="carosello"
      aria-label={t('home.featured.label')}
      className="pb-18 md:pb-24 lg:pb-36"
    >
      <div className="mx-auto flex max-w-[1360px] items-end justify-between px-5 md:px-10">
        <div>
          <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
            {t('home.featured.eyebrow')}
          </p>
          <h2 className="font-display mt-2.5 text-[2.125rem] leading-none font-extrabold tracking-[-0.035em] md:mt-3 md:text-[2.75rem] lg:text-[3.5rem]">
            {t('home.featured.title')}
          </h2>
        </div>
        <Link
          to="/modelli"
          className="py-2 text-[0.6875rem] font-semibold tracking-[0.16em] text-neutral-300 uppercase hover:text-white md:text-xs"
        >
          {t('home.featured.all')} →
        </Link>
      </div>

      {isPending && (
        <div className="bg-ombra mt-6 h-[19rem] animate-pulse md:mt-8 md:h-[37.5rem] lg:mt-10 lg:h-[clamp(32rem,48vw,47.5rem)]" />
      )}

      {isError && (
        <p
          role="alert"
          className="text-errore mx-auto mt-8 max-w-[1360px] px-5 md:px-10"
        >
          {t('home.featured.error')}
        </p>
      )}

      {current && (
        <div className="relative mt-6 md:mt-8 lg:mt-10">
          <div className="bg-notte riflettore relative h-[19rem] overflow-hidden md:h-[37.5rem] lg:h-[clamp(32rem,48vw,47.5rem)]">
            {/* Il contenuto cambia con il modello: la chiave fa ripartire l'animazione */}
            <div key={current.id} className="animate-comparsa absolute inset-0">
              <p
                aria-hidden="true"
                className="font-display absolute inset-x-0 top-1/2 -translate-y-[60%] text-center text-[6.5rem] leading-none font-extrabold tracking-[-0.035em] whitespace-nowrap text-neutral-900 md:text-[10.5rem] lg:text-[clamp(7.5rem,17vw,17.5rem)]"
              >
                {current.name}
              </p>

              {current.cover ? (
                <img
                  src={current.cover.url}
                  alt={current.cover.alt_text}
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <p className="absolute inset-x-0 top-[66%] text-center text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-500 uppercase md:top-[52%] md:text-xs">
                  {t('model.noPhoto')}
                </p>
              )}
            </div>

            {/* Sfuma verso il nero in basso; dal tablet sotto le informazioni sovrapposte */}
            <div
              aria-hidden="true"
              className="from-notte md:via-notte/80 absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t md:h-2/3"
            />

            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label={t('home.featured.previous')}
                  onClick={previous}
                  className={`${arrowClass} left-3 md:left-6 lg:left-10`}
                >
                  <ChevronLeft aria-hidden="true" className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label={t('home.featured.next')}
                  onClick={next}
                  className={`${arrowClass} right-3 md:right-6 lg:right-10`}
                >
                  <ChevronRight aria-hidden="true" className="size-5" />
                </button>
              </>
            )}
          </div>

          {/* Le informazioni: sotto la foto su mobile, sovrapposte in basso dal tablet in su */}
          <div
            aria-live="polite"
            className="md:absolute md:inset-x-0 md:bottom-0"
          >
            <div
              key={current.id}
              className="animate-comparsa mx-auto max-w-[1360px] px-5 pt-1 md:px-10 md:pb-8 lg:flex lg:items-end lg:justify-between lg:gap-7 lg:pb-9"
            >
              <div className="lg:max-w-lg">
                <div className="flex justify-between gap-4 text-[0.625rem] font-semibold tracking-[0.2em] uppercase md:justify-start md:text-[0.6875rem]">
                  <span className="text-neutral-300">
                    {current.category?.name}
                  </span>
                  <span className="text-rosso-acceso">
                    {current.first_year}
                  </span>
                </div>
                <h3 className="font-display mt-2 text-[2.5rem] leading-none font-extrabold tracking-[-0.035em] md:mt-2.5 md:text-6xl lg:text-[clamp(2.75rem,5vw,4.75rem)] lg:leading-[0.95]">
                  {current.name}
                </h3>
                <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-neutral-300 md:mt-3 md:max-w-[50ch] md:text-[0.9375rem]">
                  {current.description}
                </p>
              </div>

              <div className="mt-5 md:mt-6 md:flex md:items-end md:justify-between md:gap-6 lg:mt-0 lg:gap-9">
                <dl className="border-linea grid grid-cols-3 border-y md:flex md:gap-8 md:border-0 lg:gap-11">
                  {stats.map((stat, position) => (
                    <div
                      key={stat.key}
                      className={
                        position === 0
                          ? 'py-3.5 pr-2 md:p-0'
                          : 'border-linea border-l px-2 py-3.5 md:border-0 md:p-0'
                      }
                    >
                      <dt className="text-[0.625rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
                        {stat.label}
                      </dt>
                      <dd className="font-display mt-1.5 text-xl font-extrabold tracking-[-0.02em] md:text-2xl">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <Link
                  to={`/modelli/${current.slug}`}
                  className={buttonClass(
                    'primary',
                    'mt-5 w-full md:mt-0 md:w-auto',
                  )}
                >
                  {t('home.featured.discover')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

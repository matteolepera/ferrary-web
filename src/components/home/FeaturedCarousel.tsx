import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, type TouchEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useHighlights } from '@/hooks/useHighlights'
import { useModels } from '@/hooks/useModels'

/** Quanti modelli mostra il carosello: i più recenti dell'archivio */
const FEATURED_COUNT = 5

/** Quanti pixel di trascinamento servono per cambiare auto con il dito */
const SWIPE_THRESHOLD = 50

const arrowClass = [
  'absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full',
  'border border-white/35 bg-notte/40 backdrop-blur-sm transition-colors hover:border-rosso hover:bg-rosso',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosso-acceso md:size-14',
].join(' ')

/**
 * Il carosello della home: un'auto alla volta, a tutta larghezza, come un'opera in una sala buia.
 * Tutta la slide è un link alla scheda del modello.
 */
export function FeaturedCarousel() {
  const { t } = useTranslation()
  const { data, isPending, isError } = useModels({ sort: '-year' })
  const [index, setIndex] = useState(0)
  // Dove è iniziato il tocco: serve a capire se il dito ha trascinato
  const touchStart = useRef<number | null>(null)

  const models = data?.data.slice(0, FEATURED_COUNT) ?? []
  const count = models.length
  // Il modulo protegge dal caso in cui, cambiando lingua, l'elenco arrivi più corto
  const position = count > 0 ? index % count : 0
  const current = count > 0 ? models[position] : undefined
  // Chiamato sempre, anche senza modello: gli hook non possono stare dentro un if
  const stats = useHighlights(current?.highlights)

  const previous = () => setIndex((position - 1 + count) % count)
  const next = () => setIndex((position + 1) % count)

  function handleTouchEnd(event: TouchEvent) {
    const start = touchStart.current
    touchStart.current = null
    if (start === null || count < 2) return

    const distance = event.changedTouches[0].clientX - start
    // Verso sinistra si va avanti, verso destra indietro: come sfogliare
    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      if (distance < 0) next()
      else previous()
    }
  }

  return (
    <section
      aria-roledescription="carosello"
      aria-label={t('home.featured.label')}
      className="pb-18 md:pb-24 lg:pb-32"
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
        <div className="bg-ombra mt-6 h-[19rem] animate-pulse md:mt-8 md:h-[32rem] lg:mt-10 lg:h-[clamp(30rem,40vw,40rem)]" />
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
        // La slide intera è il link: il nome del modello lo estende su tutta la superficie
        <div
          className="group relative mt-6 md:mt-8 lg:mt-10"
          onTouchStart={(event) =>
            (touchStart.current = event.touches[0].clientX)
          }
          onTouchEnd={handleTouchEnd}
        >
          <div className="bg-notte riflettore relative h-[19rem] overflow-hidden md:h-[32rem] lg:h-[clamp(30rem,40vw,40rem)]">
            {/* Il contenuto cambia con il modello: la chiave fa ripartire l'animazione */}
            <div key={current.id} className="animate-comparsa absolute inset-0">
              {current.cover ? (
                <img
                  src={current.cover.url}
                  alt={current.cover.alt_text}
                  className="absolute inset-0 size-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <p className="absolute inset-x-0 top-[40%] text-center text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-500 uppercase md:text-xs">
                  {t('model.noPhoto')}
                </p>
              )}
            </div>

            {/* Le sfumature verso il nero: dal basso sempre, da sinistra dal desktop, sotto il testo */}
            <div
              aria-hidden="true"
              className="from-notte md:via-notte/70 absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t md:h-2/3"
            />
            <div
              aria-hidden="true"
              className="from-notte/85 via-notte/35 absolute inset-y-0 left-0 hidden w-3/5 bg-linear-to-r to-transparent lg:block"
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
          <div className="md:absolute md:inset-x-0 md:bottom-0">
            <div className="mx-auto max-w-[1360px] px-5 pt-1 md:px-10 md:pb-8 lg:pb-10">
              {/* Annunciato a ogni cambio di modello; la chiave è sul figlio, la zona resta */}
              <div aria-live="polite">
                <div
                  key={current.id}
                  className="animate-comparsa lg:flex lg:items-end lg:justify-between lg:gap-10"
                >
                  <div className="lg:max-w-xl">
                    {/* La targhetta, come la didascalia di un'opera: la famiglia e l'anno */}
                    <p className="flex items-center gap-3 text-[0.625rem] font-semibold tracking-[0.2em] uppercase md:text-[0.6875rem]">
                      <span className="text-neutral-300">
                        {current.category?.name}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-px w-6 bg-white/30"
                      />
                      <span className="text-rosso-acceso">
                        {current.first_year}
                      </span>
                    </p>

                    <h3 className="font-display mt-3 text-[2.5rem] leading-none font-extrabold tracking-[-0.035em] md:text-6xl lg:text-[clamp(2.75rem,4.6vw,4.5rem)] lg:leading-[0.95]">
                      <Link
                        to={`/modelli/${current.slug}`}
                        className={[
                          // Il link esteso: un livello invisibile che copre tutta la slide
                          "after:absolute after:inset-0 after:content-['']",
                          // Il contorno del focus attorno alla slide intera, non solo al nome
                          'focus-visible:after:outline-rosso-acceso focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2',
                        ].join(' ')}
                      >
                        {current.name}
                      </Link>
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-300 md:max-w-[50ch] md:text-[0.9375rem]">
                      {current.description}
                    </p>
                  </div>

                  {stats.length > 0 && (
                    <div className="mt-5 md:mt-6 lg:mt-0">
                      <dl className="border-linea grid grid-cols-3 border-y md:flex md:gap-8 md:border-0 lg:gap-10">
                        {stats.map((stat, place) => (
                          <div
                            key={stat.key}
                            className={
                              place === 0
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
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-6 md:mt-7">
                {/* Un trattino per modello: quello attuale è rosso, e ognuno porta al suo */}
                {count > 1 && (
                  <div className="relative z-10 flex items-center gap-1.5">
                    {models.map((model, place) => (
                      <button
                        key={model.id}
                        type="button"
                        aria-label={t('home.featured.goTo', {
                          name: model.name,
                        })}
                        aria-current={place === position ? 'true' : undefined}
                        onClick={() => setIndex(place)}
                        // Il pulsante è alto per essere facile da toccare; il trattino dentro è sottile
                        className="group/dot focus-visible:outline-rosso-acceso flex h-6 items-center focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        <span
                          className={[
                            'block h-0.5 transition-all duration-500',
                            place === position
                              ? 'bg-rosso w-10'
                              : 'w-5 bg-white/30 group-hover/dot:bg-white/70',
                          ].join(' ')}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Solo un segnale visivo: il link è già la slide intera */}
                <span
                  aria-hidden="true"
                  className="group-hover:text-rosso-acceso ml-auto flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.18em] text-white uppercase transition-colors md:text-xs"
                >
                  {t('home.featured.discover')}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

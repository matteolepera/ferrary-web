import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRef, useState, type TouchEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { yFocusMark } from '@/components/ui/yFocus'
import { YPanel, YSeparator } from '@/components/ui/YPanel'
import { useModels } from '@/hooks/useModels'

/** Quanti modelli mostra il carosello: i più recenti dell'archivio */
const FEATURED_COUNT = 5

/** Quanti pixel di trascinamento servono per cambiare auto con il dito */
const SWIPE_THRESHOLD = 50

/** La forma della Y per la slide: l'angolo grande in alto a sinistra, il taglio in basso a destra */
const slideShape =
  'rounded-[4px] rounded-tl-[32px] [clip-path:polygon(0_0,100%_0,100%_calc(100%-36px),calc(100%-36px)_100%,0_100%)]'

const arrowClass = [
  yFocusMark,
  'flex w-14 items-center justify-center text-neutral-200 transition-colors hover:text-rosso-acceso focus-visible:outline-none',
].join(' ')

/**
 * Il carosello della home: un'auto alla volta, in una slide con la forma della Y,
 * come un'opera in una sala buia. Tutta la slide è un link alla scheda del modello.
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
      className="mx-auto max-w-[1360px] px-5 pb-18 md:px-10 md:pb-24 lg:pb-32"
    >
      <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
        {t('home.featured.eyebrow')}
      </p>
      <h2 className="font-display mt-2.5 text-[2.125rem] leading-none font-extrabold tracking-[-0.035em] md:mt-3 md:text-[2.75rem] lg:text-[3.5rem]">
        {t('home.featured.title')}
      </h2>

      {isPending && (
        <div
          className={`bg-ombra mt-6 h-[28rem] animate-pulse md:mt-8 md:h-[32rem] lg:mt-10 lg:h-[clamp(32rem,40vw,38rem)] ${slideShape}`}
        />
      )}

      {isError && (
        <p role="alert" className="text-errore mt-8">
          {t('home.featured.error')}
        </p>
      )}

      {current && (
        <>
          {/*
            La slide, con la forma della Y. "isolate" crea un livello a sé:
            la foto e le sfumature stanno sotto il testo, e il link esteso copre tutta la slide
          */}
          <div
            className={[
              'group bg-notte riflettore relative isolate mt-6 flex h-[24rem] flex-col justify-end overflow-hidden p-6 md:mt-8 md:h-[28rem] md:p-10 lg:mt-10 lg:h-[clamp(26rem,32vw,31rem)] lg:p-12',
              slideShape,
              // Il bordo sottile, sopra tutto: un'ombra interna, che il ritaglio non taglia
              "after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] after:content-['']",
            ].join(' ')}
            onTouchStart={(event) =>
              (touchStart.current = event.touches[0].clientX)
            }
            onTouchEnd={handleTouchEnd}
          >
            {/* Lo sfondo: la foto, o il nome in filigrana. Cambia con il modello: la chiave fa ripartire l'animazione */}
            <div
              key={current.id}
              aria-hidden="true"
              className="animate-comparsa absolute inset-0 -z-10"
            >
              {current.cover ? (
                <img
                  src={current.cover.url}
                  alt=""
                  className="absolute inset-0 size-full object-cover brightness-[.92] contrast-[1.05] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <span className="font-display absolute inset-x-0 top-[18%] text-center text-[8rem] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap text-neutral-900 md:text-[13rem] lg:text-[clamp(14rem,22vw,20rem)]">
                  {current.name}
                </span>
              )}
              {/* La sfumatura verso il nero, dove stanno i testi */}
              <div className="from-notte via-notte/40 absolute inset-0 bg-linear-to-t from-[2%] via-30% to-transparent to-60%" />
            </div>

            {/* I testi e il pulsante: annunciati a ogni cambio di modello */}
            <div aria-live="polite">
              <div
                key={current.id}
                className="animate-comparsa lg:flex lg:items-end lg:justify-between lg:gap-10"
              >
                <div className="lg:max-w-xl">
                  {/* La targhetta: il segno rosso, la famiglia e l'anno */}
                  <p className="flex items-center gap-3 text-[0.625rem] font-semibold tracking-[0.22em] text-neutral-200 uppercase md:text-[0.6875rem]">
                    <span
                      aria-hidden="true"
                      className="bg-rosso-acceso h-[3px] w-3.5 -skew-x-[28deg] shadow-[0_0_8px_rgba(255,59,48,0.6)]"
                    />
                    {current.category?.name}
                    <span className="text-rosso-acceso">
                      {current.first_year}
                    </span>
                  </p>

                  <h3 className="font-display mt-3 text-[2.75rem] leading-[0.92] font-extrabold tracking-[-0.04em] md:text-6xl lg:text-[clamp(3rem,6vw,5.5rem)]">
                    <Link
                      to={`/modelli/${current.slug}`}
                      className={[
                        // Il link esteso: un livello invisibile che copre tutta la slide
                        "after:absolute after:inset-0 after:z-10 after:content-['']",
                        // Il contorno del focus attorno alla slide intera, disegnato dentro: il ritaglio taglierebbe quello di fuori
                        'focus-visible:after:outline-rosso-acceso focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-4',
                      ].join(' ')}
                    >
                      {current.name}
                    </Link>
                  </h3>

                  {current.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-300 md:mt-4 md:max-w-[52ch] md:text-base">
                      {current.description}
                    </p>
                  )}
                </div>

                {/* "Scopri il modello": solo un segnale visivo, il link è già la slide intera */}
                <span
                  aria-hidden="true"
                  className={[
                    'mt-6 inline-flex h-12 shrink-0 items-center gap-3.5 rounded-[3px] rounded-tl-[16px] pr-9 pl-6 lg:mt-0 lg:h-13',
                    '[clip-path:polygon(0_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%)]',
                    'bg-neutral-900/75 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] backdrop-blur-md transition-colors duration-300',
                    'text-[0.6875rem] font-semibold tracking-[0.2em] text-white uppercase',
                    // Passando sulla slide si accende di rosso
                    'group-hover:bg-rosso/90',
                  ].join(' ')}
                >
                  {t('home.featured.discover')}
                  <span className="text-rosso-acceso text-[0.9375rem] transition duration-300 group-hover:translate-x-1 group-hover:text-white">
                    →
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Sotto la slide: i segni a sinistra, le frecce a destra */}
          {count > 1 && (
            <div className="mt-5 flex items-center justify-between gap-6 md:mt-6">
              {/* Un segno per modello: quello attuale è rosso e più lungo, e ognuno porta al suo */}
              <div className="flex items-center gap-2">
                {models.map((model, place) => (
                  <button
                    key={model.id}
                    type="button"
                    aria-label={t('home.featured.goTo', { name: model.name })}
                    aria-current={place === position ? 'true' : undefined}
                    onClick={() => setIndex(place)}
                    // Il pulsante è alto per essere facile da toccare; il segno dentro è sottile
                    className="group/mark focus-visible:outline-rosso-acceso flex h-7 items-center focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <span
                      className={[
                        'block h-1 -skew-x-[28deg] transition-all duration-500',
                        place === position
                          ? 'bg-rosso-acceso w-11 shadow-[0_0_10px_rgba(255,59,48,0.6)]'
                          : 'w-5 bg-neutral-700 group-hover/mark:bg-neutral-500',
                      ].join(' ')}
                    />
                  </button>
                ))}
              </div>

              {/* Le frecce, in una piccola barra della Y */}
              <YPanel className="flex h-12 shrink-0 items-stretch md:h-13">
                <button
                  type="button"
                  aria-label={t('home.featured.previous')}
                  onClick={previous}
                  className={arrowClass}
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                </button>
                <YSeparator />
                {/* L'ultima freccia lascia spazio al taglio in basso a destra */}
                <button
                  type="button"
                  aria-label={t('home.featured.next')}
                  onClick={next}
                  className={`${arrowClass} pr-3 after:-ml-1.5`}
                >
                  <ArrowRight aria-hidden="true" className="size-4" />
                </button>
              </YPanel>
            </div>
          )}
        </>
      )}
    </section>
  )
}

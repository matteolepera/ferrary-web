import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useModels } from '@/hooks/useModels'
import { Eyebrow } from '@/components/ui/Eyebrow'

/** Quanti modelli mostra la sezione: i più recenti dell'archivio */
const FEATURED_COUNT = 3

/** La forma della Y per i pannelli: l'angolo grande in alto a sinistra, il taglio in basso a destra */
const panelShape =
  'rounded-[4px] rounded-tl-[30px] [clip-path:polygon(0_0,100%_0,100%_calc(100%-30px),calc(100%-30px)_100%,0_100%)]'

/**
 * Le ultime arrivate della home: il testo a sinistra e tre pannelli inclinati come il segno della Y.
 * Dal desktop il pannello sotto il mouse (o con il focus) si allarga; sul telefono scorrono di lato.
 * Ogni pannello è un link alla scheda del modello.
 */
export function FeaturedPanels() {
  const { t } = useTranslation()
  const { data, isPending, isError } = useModels({ sort: '-year' })
  // Il pannello aperto: all'inizio il primo, poi quello sotto il mouse o con il focus
  const [active, setActive] = useState(0)

  const models = data?.data.slice(0, FEATURED_COUNT) ?? []

  return (
    <section
      aria-labelledby="ultime-titolo"
      className="mx-auto max-w-[1360px] px-5 pb-18 md:px-10 md:pb-24 lg:pb-32"
    >
      <div className="lg:grid lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-center lg:gap-12">
        {/* Il testo: l'etichetta, il titolo su due righe con la seconda rossa, la frase e il link all'archivio */}
        <div>
          <Eyebrow>{t('home.featured.eyebrow')}</Eyebrow>
          <h2
            id="ultime-titolo"
            className="font-display mt-4 text-[2.625rem] leading-[0.98] font-extrabold tracking-[-0.04em] md:text-6xl lg:mt-5"
          >
            <span className="block">{t('home.featured.titleStart')}</span>
            <span className="block text-neutral-600">
              {t('home.featured.titleEnd')}
            </span>
          </h2>
          <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-relaxed text-neutral-400 md:mt-5">
            {t('home.featured.text')}
          </p>
          {/*
            Il link all'archivio: la linea sotto si colora di rosso da sinistra,
            e la freccia sta in un quadratino con l'angolo della Y, come quella dei pannelli
          */}
          <Link
            to="/modelli"
            className="group focus-visible:outline-rosso-acceso mt-6 inline-flex items-center gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 md:mt-8"
          >
            <span className="relative pb-2 text-[0.6875rem] font-semibold tracking-[0.2em] text-white uppercase">
              {t('home.featured.all')}
              {/* La linea grigia, sempre visibile */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-white/18"
              />
              {/* La linea rossa, che si allunga passando il mouse */}
              <span
                aria-hidden="true"
                className="bg-rosso-acceso absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-x-100"
              />
            </span>
            <span
              aria-hidden="true"
              className="text-rosso-acceso group-hover:bg-rosso flex size-9 items-center justify-center rounded-[3px] rounded-tl-[11px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] transition-colors duration-300 group-hover:text-white group-hover:shadow-none"
            >
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        </div>

        {isPending && (
          <div
            aria-hidden="true"
            className={`bg-ombra/40 mt-8 h-[25rem] animate-pulse lg:mt-0 lg:h-[34rem] ${panelShape}`}
          />
        )}

        {isError && (
          <p role="alert" className="text-errore mt-8 lg:mt-0">
            {t('home.featured.error')}
          </p>
        )}

        {models.length > 0 && (
          // Telefono e tablet: una fila che scorre di lato e si aggancia a ogni pannello.
          // Dal desktop: i pannelli si dividono lo spazio, e quello aperto ne prende di più
          <ul className="senza-barra -mx-5 mt-8 flex snap-x snap-mandatory scroll-pl-7 gap-3 overflow-x-auto px-7 md:-mx-10 md:px-12 lg:mx-0 lg:mt-0 lg:h-[34rem] lg:gap-3.5 lg:overflow-visible lg:pr-8 lg:pl-11">
            {models.map((model, index) => {
              const isActive = index === active

              return (
                <li
                  key={model.id}
                  className={[
                    'h-[25rem] w-[16rem] shrink-0 snap-start md:w-[18rem]',
                    // Dal desktop la larghezza la decide la crescita: 1 per gli altri, 1,75 per quello aperto
                    'lg:h-full lg:w-auto lg:min-w-0 lg:shrink lg:basis-0 lg:transition-[flex-grow] lg:duration-700 lg:ease-[cubic-bezier(0.2,0.8,0.2,1)]',
                    isActive ? 'lg:grow-[1.75]' : 'lg:grow',
                  ].join(' ')}
                >
                  <Link
                    to={`/modelli/${model.slug}`}
                    data-active={isActive || undefined}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    className={[
                      // Inclinato come il segno rosso della Y: meno sul telefono, di più dal desktop
                      'group bg-ombra relative block size-full -skew-x-6 overflow-hidden lg:-skew-x-[9deg]',
                      panelShape,
                      // Il bordo è un'ombra interna sul livello ::after: un bordo vero verrebbe tagliato con l'angolo
                      "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']",
                      'after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] after:transition-shadow data-active:after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.26)]',
                      // Il contorno del focus disegnato dentro: il ritaglio taglierebbe quello di fuori
                      'focus-visible:outline-none focus-visible:after:shadow-[inset_0_0_0_2px_var(--color-rosso-acceso)]',
                    ].join(' ')}
                  >
                    {model.cover ? (
                      // Decorativa: il nome è già nel testo del link.
                      // Raddrizzata dentro il pannello, e più larga per non lasciare angoli vuoti
                      <img
                        src={model.cover.url}
                        alt=""
                        loading="lazy"
                        className="absolute top-0 -left-[30%] h-full w-[160%] max-w-none skew-x-6 object-cover object-[50%_58%] brightness-[.82] saturate-[.92] transition-[filter] duration-500 group-data-active:brightness-[.98] group-data-active:saturate-100 lg:skew-x-[9deg]"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="riflettore absolute inset-0"
                      />
                    )}

                    {/* Il nero in alto per i testi, e un velo leggero in basso per la freccia */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.88)_0%,rgba(5,5,5,0.25)_38%,transparent_55%,rgba(5,5,5,0.55)_100%)]"
                    />

                    {/*
                      I testi, raddrizzati. Il bordo è inclinato: in alto sta più a destra, in basso più a sinistra.
                      Per questo i testi in alto rientrano di più, e la freccia in basso quasi per niente
                    */}
                    <div className="absolute inset-0 skew-x-6 pt-7 pr-6 pb-7 pl-12 lg:skew-x-[9deg] lg:pl-16">
                      <p className="flex items-center gap-2.5 text-[0.625rem] font-semibold tracking-[0.24em] text-neutral-300 uppercase">
                        <span
                          aria-hidden="true"
                          className="bg-rosso-acceso h-[3px] w-3 shrink-0 -skew-x-[28deg] shadow-[0_0_8px_rgba(255,59,48,0.6)]"
                        />
                        {model.category?.name}
                      </p>
                      <h3 className="font-display mt-3.5 text-[1.875rem] leading-[0.95] font-extrabold tracking-[-0.035em] lg:text-[2.125rem]">
                        {model.name}
                      </h3>
                      {model.first_year && (
                        <p className="text-rosso-acceso mt-2 text-xs font-semibold tracking-[0.12em] tabular-nums">
                          {model.first_year}
                        </p>
                      )}

                      {/* La freccia, in un quadrato con l'angolo della Y: rossa sul pannello aperto */}
                      <span
                        aria-hidden="true"
                        className="group-data-active:bg-rosso absolute bottom-7 left-3 flex size-11.5 items-center justify-center rounded-[3px] rounded-tl-[14px] bg-neutral-900/70 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] backdrop-blur-md transition-colors group-data-active:shadow-none lg:left-1"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}

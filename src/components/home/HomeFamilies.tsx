import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useCategories } from '@/hooks/useCategories'

/**
 * Le famiglie: l'ingresso all'archivio dal tipo di Ferrari.
 * Dal desktop, la foto della famiglia scelta fa da sfondo alla sezione, con i nomi sopra.
 * Su mobile e tablet, ogni famiglia è una fascia con la sua foto.
 */
export function HomeFamilies() {
  const { t } = useTranslation()
  const { data: families, isPending, isError } = useCategories()
  // La famiglia sullo sfondo: quella sotto il mouse o raggiunta con Tab, all'inizio la prima
  const [activeId, setActiveId] = useState<number | null>(null)

  // Senza famiglie non c'è niente da proporre: la sezione non compare
  if (!isPending && !isError && families.length === 0) {
    return null
  }

  const active =
    families?.find((family) => family.id === activeId) ?? families?.[0]

  return (
    <section
      id="famiglie"
      aria-labelledby="famiglie-titolo"
      className="relative overflow-hidden pb-18 md:pb-24 lg:mb-36 lg:pb-0"
    >
      {/* Lo sfondo, solo dal desktop: tutte le foto una sopra l'altra, per una dissolvenza al cambio */}
      <div
        aria-hidden="true"
        className="riflettore bg-notte absolute inset-0 hidden lg:block"
      >
        {families?.map((family) =>
          family.cover ? (
            <img
              key={family.id}
              src={family.cover.url}
              alt=""
              loading="lazy"
              className={[
                'absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out',
                family.id === active?.id ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
            />
          ) : null,
        )}
        {/* Il buio a sinistra, sotto i nomi, e in basso, verso la sezione successiva */}
        <div className="from-notte via-notte/85 absolute inset-0 bg-linear-to-r via-35% to-transparent to-75%" />
        <div className="from-notte absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1360px] px-5 md:px-10 lg:flex lg:min-h-[44rem] lg:flex-col lg:justify-center lg:py-20">
        <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
          {t('home.families.eyebrow')}
        </p>
        <h2
          id="famiglie-titolo"
          className="font-display mt-2.5 text-[2.125rem] leading-[1.05] font-extrabold tracking-[-0.035em] md:mt-3 md:text-5xl lg:text-[2.75rem]"
        >
          {t('home.families.title')}
        </h2>

        {isError && (
          <p role="alert" className="text-errore mt-8">
            {t('home.families.error')}
          </p>
        )}

        {/* Su mobile e tablet le fasce arrivano ai bordi dello schermo; dal desktop restano nella colonna */}
        <ul className="border-linea -mx-5 mt-8 border-t md:-mx-10 lg:mx-0 lg:mt-7 lg:border-0">
          {isPending &&
            [1, 2, 3].map((placeholder) => (
              <li
                key={placeholder}
                className="border-linea bg-ombra/60 h-28 animate-pulse border-b lg:h-14 lg:border-0"
              />
            ))}

          {families?.map((family) => {
            const isActive = family.id === active?.id

            return (
              <li key={family.id}>
                <Link
                  to={`/modelli?category=${family.slug}`}
                  onMouseEnter={() => setActiveId(family.id)}
                  onFocus={() => setActiveId(family.id)}
                  className={[
                    'group border-linea relative flex h-28 items-center justify-between gap-4 overflow-hidden border-b px-5 md:h-32 md:px-10',
                    'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:-outline-offset-2',
                    // Dal desktop: niente fascia, solo il nome sopra lo sfondo
                    'lg:h-auto lg:justify-start lg:overflow-visible lg:border-0 lg:px-0 lg:py-1.5 lg:focus-visible:outline-offset-4',
                  ].join(' ')}
                >
                  {/* La fascia con la foto, solo su mobile e tablet */}
                  <span
                    aria-hidden="true"
                    className="riflettore bg-notte absolute inset-0 lg:hidden"
                  >
                    {family.cover && (
                      <img
                        src={family.cover.url}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <span className="from-notte via-notte/70 to-notte/20 absolute inset-0 bg-linear-to-r via-45%" />
                  </span>

                  {/* La barra rossa della famiglia sullo sfondo, solo dal desktop */}
                  <span
                    aria-hidden="true"
                    className={[
                      'bg-rosso hidden h-[3px] shrink-0 self-center transition-[width] duration-500 lg:block',
                      isActive ? 'w-9' : 'w-0',
                    ].join(' ')}
                  />

                  <span className="relative min-w-0 lg:flex lg:items-baseline lg:gap-4">
                    <span
                      className={[
                        'font-display block text-[1.75rem] leading-none font-extrabold tracking-[-0.035em] transition-colors md:text-4xl lg:text-[3rem] lg:leading-[1.05]',
                        isActive
                          ? 'lg:text-white'
                          : 'lg:text-white/30 lg:group-hover:text-white/70',
                      ].join(' ')}
                    >
                      {family.name}
                    </span>
                    {family.models_count !== undefined && (
                      <span
                        className={[
                          'mt-1.5 block text-[0.8125rem] text-neutral-300 transition-colors md:text-sm lg:mt-0',
                          isActive ? '' : 'lg:text-white/30',
                        ].join(' ')}
                      >
                        {t('home.families.models', {
                          count: family.models_count,
                        })}
                      </span>
                    )}
                  </span>

                  <span
                    aria-hidden="true"
                    className="group-hover:text-rosso-acceso relative text-xl text-neutral-300 transition group-hover:translate-x-1 md:text-2xl lg:hidden"
                  >
                    →
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Quale auto si vede: la descrizione della foto, come la didascalia di un'opera */}
      {active?.cover && (
        <p
          aria-hidden="true"
          className="absolute right-10 bottom-11 hidden max-w-xs text-right lg:block xl:right-[max(2.5rem,calc((100vw-1360px)/2+2.5rem))]"
        >
          <span className="block text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
            {t('home.families.showing')}
          </span>
          <span
            key={active.id}
            className="font-display animate-comparsa mt-2 block text-xl font-extrabold tracking-[-0.02em]"
          >
            {active.cover.alt_text}
          </span>
        </p>
      )}
    </section>
  )
}

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { CarModel, Version } from '@/types/catalog'
import { isShortStory } from '@/components/model/story'
import { ArrowLeft } from 'lucide-react'

type ModelHeroProps = {
  model: CarModel
  /** Il dettaglio della versione scelta, quando è arrivato */
  version: Version | undefined
  selectedSlug: string | undefined
  onSelect: (slug: string) => void
}

/**
 * L'apertura della pagina del modello: foto, famiglia, anni, nome gigante e schede delle versioni.
 */
export function ModelHero({
  model,
  version,
  selectedSlug,
  onSelect,
}: ModelHeroProps) {
  const { t } = useTranslation()
  const versions = model.versions ?? []
  const current = versions.find((item) => item.slug === selectedSlug)
  const cover = version?.cover ?? model.cover
  const title = current?.name ?? model.name
  // Senza foto l'apertura è più bassa: niente grande vuoto, il nome arriva subito
  const heightClass = cover
    ? 'min-h-[34rem] md:min-h-[44rem] lg:min-h-[50rem]'
    : ''

  // "Dal 2019" se è ancora in produzione, "1987–1992" se ha una fine, altrimenti l'anno
  const yearsLabel = (years: Version['years']) => {
    if (years.in_production) {
      return t('model.since', { start: years.start })
    }

    if (years.end !== null && years.end !== years.start) {
      return t('model.range', { start: years.start, end: years.end })
    }

    return String(years.start)
  }

  // "SF90 Spider" diventa "Spider" sotto il titolo "SF90"
  const versionLabel = (item: Version) =>
    item.name.startsWith(`${model.name} `)
      ? item.name.slice(model.name.length + 1)
      : item.name

  return (
    <section
      aria-labelledby="modello-titolo"
      className={`relative flex flex-col overflow-hidden ${heightClass}`}
    >
      {cover ? (
        <img
          src={cover.url}
          alt={cover.alt_text}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover brightness-[.62] contrast-[1.12] saturate-[1.05]"
        />
      ) : (
        // Senza foto: il riflettore e il nome del modello in filigrana, come una targa sul muro della sala
        <div aria-hidden="true" className="riflettore absolute inset-0">
          <p className="font-display absolute inset-x-0 top-[40%] -translate-y-1/2 text-center text-[7rem] leading-none font-extrabold tracking-[-0.045em] whitespace-nowrap text-neutral-900 md:text-[12rem] lg:text-[clamp(12rem,20vw,20rem)]">
            {model.name}
          </p>
        </div>
      )}
      <div
        aria-hidden="true"
        className="from-notte via-notte/40 to-notte/60 absolute inset-0 bg-linear-to-t"
      />

      {/* Il percorso: l'archivio e la famiglia, in una targhetta con l'angolo della Y */}
      <nav
        aria-label={t('model.breadcrumb')}
        className="relative mx-auto w-full max-w-[1360px] px-5 pt-8 md:px-10 md:pt-10 lg:pt-28"
      >
        <ol className="inline-flex h-9 items-center rounded-[3px] rounded-tl-[12px] border border-white/12 bg-neutral-900/60 pr-4 pl-3 text-[0.625rem] font-semibold tracking-[0.18em] uppercase backdrop-blur-md md:text-[0.6875rem]">
          <li>
            <Link
              to="/modelli"
              className="group focus-visible:outline-rosso-acceso flex items-center gap-2 text-neutral-200 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <ArrowLeft
                aria-hidden="true"
                className="text-rosso-acceso size-3.5 transition-transform group-hover:-translate-x-0.5"
              />
              {t('nav.archive')}
            </Link>
          </li>
          {model.category && (
            <li className="flex items-center">
              {/* Il separatore inclinato, come nella barra della Y */}
              <span
                aria-hidden="true"
                className="mx-3 h-3.5 w-px -skew-x-[20deg] bg-white/20"
              />
              <Link
                to={`/modelli?category=${model.category.slug}`}
                className="focus-visible:outline-rosso-acceso text-neutral-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {model.category.name}
              </Link>
            </li>
          )}
        </ol>
      </nav>
      <div
        className={`relative mx-auto w-full max-w-[1360px] px-5 pb-6 md:px-10 md:pb-8 ${cover ? 'mt-auto' : 'mt-14 md:mt-20 lg:mt-24'}`}
      >
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
          {model.category && (
            <span className="text-rosso-acceso">{model.category.name}</span>
          )}
          {current && (
            <span className="text-neutral-300">
              {yearsLabel(current.years)}
            </span>
          )}
        </div>

        {/* La chiave fa ripartire l'animazione quando cambia la versione */}
        <h1
          id="modello-titolo"
          key={title}
          className="animate-comparsa font-display mt-3 text-[3.25rem] leading-[0.92] font-extrabold tracking-[-0.035em] md:text-[6rem] lg:text-[clamp(4.5rem,9.4vw,9.25rem)]"
        >
          {title}
        </h1>

        {model.description && (
          <p className="mt-4 line-clamp-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-neutral-300 md:text-[1.0625rem]">
            {model.description}
          </p>
        )}

        {/* La descrizione della versione, se è breve: cambia con le schede, senza toccare quella del modello */}
        {version?.description && isShortStory(version.description) && (
          <p
            key={version.slug}
            className="animate-comparsa mt-2 max-w-[52ch] text-sm leading-relaxed text-neutral-400 md:text-[0.9375rem]"
          >
            {version.description}
          </p>
        )}

        {versions.length > 1 && (
          <div
            role="group"
            aria-label={t('model.versions')}
            className="senza-barra -mx-5 mt-7 flex gap-7 overflow-x-auto border-b border-white/15 px-5 md:mx-0 md:mt-8 md:px-0"
          >
            {versions.map((item) => {
              const active = item.slug === selectedSlug

              return (
                <button
                  key={item.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(item.slug)}
                  className={[
                    '-mb-px shrink-0 border-b-2 py-3 text-xs font-semibold tracking-[0.18em] uppercase transition-colors',
                    'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-2',
                    active
                      ? 'border-rosso text-white'
                      : 'border-transparent text-neutral-400 hover:text-white',
                  ].join(' ')}
                >
                  {versionLabel(item)}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

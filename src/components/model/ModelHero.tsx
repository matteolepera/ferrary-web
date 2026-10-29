import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { CarModel, Version } from '@/types/catalog'

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
      className="relative flex min-h-[34rem] flex-col overflow-hidden md:min-h-[44rem] lg:min-h-[50rem]"
    >
      {cover ? (
        <img
          src={cover.url}
          alt={cover.alt_text}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover brightness-[.62] contrast-[1.12] saturate-[1.05]"
        />
      ) : (
        <div className="riflettore absolute inset-0">
          <p className="mt-48 text-center text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-500 uppercase md:mt-64">
            {t('model.noPhoto')}
          </p>
        </div>
      )}
      <div
        aria-hidden="true"
        className="from-notte via-notte/40 to-notte/60 absolute inset-0 bg-linear-to-t"
      />

      <div className="relative mx-auto w-full max-w-[1360px] px-5 pt-24 md:px-10 md:pt-28">
        <Link
          to="/modelli"
          className="text-[0.6875rem] font-semibold tracking-[0.18em] text-neutral-300 uppercase hover:text-white md:text-xs"
        >
          ← {t('nav.archive')}
        </Link>
      </div>

      <div className="relative mx-auto mt-auto w-full max-w-[1360px] px-5 pb-6 md:px-10 md:pb-8">
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

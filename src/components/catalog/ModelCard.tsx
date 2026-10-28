import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useHighlights } from '@/hooks/useHighlights'
import type { CarModel } from '@/types/catalog'

type ModelCardProps = {
  model: CarModel
}

/**
 * La card di un modello: tutta la card è un link alla sua pagina.
 */
export function ModelCard({ model }: ModelCardProps) {
  const { t } = useTranslation()
  const stats = useHighlights(model.highlights)

  return (
    <Link
      to={`/modelli/${model.slug}`}
      className={[
        'group bg-ombra relative flex min-h-[22rem] flex-col justify-end overflow-hidden md:min-h-[24rem]',
        'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-2',
      ].join(' ')}
    >
      {model.cover ? (
        // Decorativa: il nome del modello è già nel testo del link
        <img
          src={model.cover.url}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="riflettore absolute inset-0">
          <p className="mt-24 text-center text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-500 uppercase">
            {t('model.noPhoto')}
          </p>
        </div>
      )}

      {/* Sfumatura verso il nero, dove stanno i testi */}
      <div
        aria-hidden="true"
        className="from-notte via-notte/30 to-notte/40 absolute inset-0 bg-linear-to-t"
      />

      <div className="absolute inset-x-5 top-5 flex justify-between text-[0.625rem] font-semibold tracking-[0.2em] uppercase md:inset-x-6 md:top-6 md:text-[0.6875rem]">
        <span className="text-neutral-300">{model.category?.name}</span>
        <span className="text-rosso-acceso">{model.first_year}</span>
      </div>

      <div className="relative p-5 md:p-6">
        <h3 className="font-display text-[2rem] leading-none font-extrabold tracking-[-0.035em] transition-colors group-hover:text-white md:text-[2.5rem]">
          {model.name}
        </h3>
        {model.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-300">
            {model.description}
          </p>
        )}

        <dl className="mt-5 grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.key}>
              <dt className="text-[0.5625rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
                {stat.label}
              </dt>
              <dd className="mt-1 text-[0.9375rem] font-semibold">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Link>
  )
}

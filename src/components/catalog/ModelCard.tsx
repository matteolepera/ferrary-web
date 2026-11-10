import { Link } from 'react-router'
import { useHighlights } from '@/hooks/useHighlights'
import type { CarModel } from '@/types/catalog'

type ModelCardProps = {
  model: CarModel
}

/**
 * La carta di un modello, con la forma della Y: tutta la carta è un link alla sua pagina.
 * Passando il mouse sale appena, il riflettore si accende e la freccia diventa rossa.
 */
export function ModelCard({ model }: ModelCardProps) {
  const stats = useHighlights(model.highlights)

  return (
    <Link
      to={`/modelli/${model.slug}`}
      className={[
        'group bg-ombra relative flex min-h-[22rem] flex-col justify-end overflow-hidden md:min-h-[24rem]',
        // La forma della Y: l'angolo grande in alto a sinistra, gli altri quasi vivi, il taglio in basso a destra
        'rounded-[4px] rounded-tl-[28px] [clip-path:polygon(0_0,100%_0,100%_calc(100%-28px),calc(100%-28px)_100%,0_100%)]',
        'transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1',
        // Il bordo è un'ombra interna sul livello ::after: un bordo vero verrebbe tagliato con l'angolo
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']",
        'after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] after:transition-shadow hover:after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]',
        // Il contorno del focus disegnato dentro: il ritaglio taglierebbe quello di fuori
        'focus-visible:outline-none focus-visible:after:shadow-[inset_0_0_0_2px_var(--color-rosso-acceso)]',
      ].join(' ')}
    >
      {model.cover ? (
        // Decorativa: il nome del modello è già nel testo del link
        <img
          src={model.cover.url}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
        />
      ) : (
        // Senza foto: il riflettore e il nome in filigrana, come nell'apertura della scheda
        <div aria-hidden="true" className="riflettore absolute inset-0">
          <span className="font-display absolute inset-x-0 top-[34%] text-center text-[7rem] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap text-neutral-900 md:text-[8.5rem]">
            {model.name}
          </span>
        </div>
      )}

      {/* La sfumatura verso il nero, dove stanno i testi */}
      <div
        aria-hidden="true"
        className="from-notte via-notte/35 to-notte/45 absolute inset-0 bg-linear-to-t from-[8%] via-55%"
      />

      {/* Il riflettore, che si accende passando il mouse */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(255,255,255,0.16),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="absolute inset-x-6 top-5 flex items-center justify-between text-[0.625rem] font-semibold tracking-[0.2em] uppercase md:top-6">
        <span className="flex items-center gap-2.5 text-neutral-300">
          {/* Il segno rosso obliquo, come nella barra della Y */}
          <span
            aria-hidden="true"
            className="bg-rosso-acceso h-[3px] w-3 -skew-x-[28deg] shadow-[0_0_8px_rgba(255,59,48,0.6)]"
          />
          {model.category?.name}
        </span>
        <span className="text-rosso-acceso tabular-nums">
          {model.first_year}
        </span>
      </div>

      <div className="relative py-6 pr-10 pl-6">
        <h3 className="font-display text-[2rem] leading-[0.95] font-extrabold tracking-[-0.035em] md:text-[2.375rem]">
          {model.name}
        </h3>
        {model.description && (
          <p className="mt-2.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-neutral-400">
            {model.description}
          </p>
        )}

        {stats.length > 0 && (
          <dl className="mt-4 flex gap-5 border-t border-white/10 pt-3.5">
            {stats.map((stat) => (
              <div key={stat.key} className="flex flex-col-reverse">
                <dt className="mt-1 text-[0.5625rem] font-semibold tracking-[0.18em] text-neutral-500 uppercase">
                  {stat.label}
                </dt>
                <dd className="font-display text-lg font-extrabold tracking-[-0.02em]">
                  {stat.figure}
                  <span className="font-sans text-[0.6875rem] font-semibold text-neutral-400">
                    {' '}
                    {stat.unit}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* La freccia accanto al taglio, che si accende di rosso */}
      <span
        aria-hidden="true"
        className="group-hover:text-rosso-acceso absolute right-7 bottom-7 text-base text-neutral-500 transition duration-300 group-hover:translate-x-0.5"
      >
        →
      </span>

      {/* Il bordo del taglio, che le ombre interne non disegnano */}
      <span
        aria-hidden="true"
        className="absolute right-0 bottom-0 h-px w-10 origin-bottom-right -rotate-45 bg-white/12"
      />
    </Link>
  )
}

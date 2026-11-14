import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { Version } from '@/types/catalog'

type VersionCardProps = {
  version: Version
  /** Un dettaglio in alto a sinistra, come il ruolo del designer; senza, il tipo di auto */
  meta?: string
}

/**
 * La carta di una versione, con la forma della Y come quella dei modelli:
 * porta alla pagina del suo modello, con la versione già scelta.
 */
export function VersionCard({ version, meta }: VersionCardProps) {
  const { t } = useTranslation()

  // Senza il modello non sapremmo dove portare: la carta resta, ma non è un link
  const to = version.model
    ? `/modelli/${version.model.slug}?versione=${version.slug}`
    : undefined

  // Il modello sotto il nome, solo se dice qualcosa in più: "312 B2" sta nel modello "312 B"
  const modelName =
    version.model && version.model.name !== version.name
      ? version.model.name
      : null

  const content = (
    <>
      {version.cover ? (
        // Decorativa: il nome della versione è già nel testo della carta
        <img
          src={version.cover.url}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
        />
      ) : (
        // Senza foto: il riflettore e il nome in filigrana, come nelle carte dei modelli
        <div aria-hidden="true" className="riflettore absolute inset-0">
          <span className="font-display absolute inset-x-0 top-[30%] text-center text-[5.5rem] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap text-neutral-900 md:text-[6.5rem]">
            {version.name}
          </span>
        </div>
      )}

      {/* La sfumatura verso il nero, dove stanno i testi */}
      <div
        aria-hidden="true"
        className="from-notte via-notte/35 to-notte/45 absolute inset-0 bg-linear-to-t from-[8%] via-55%"
      />

      {/* Il riflettore, che si accende passando il mouse (solo sulle carte che sono link) */}
      {to && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(255,255,255,0.16),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}

      <div className="absolute inset-x-6 top-5 flex items-center justify-between gap-4 text-[0.625rem] font-semibold tracking-[0.2em] uppercase md:top-6">
        <span className="flex min-w-0 items-center gap-2.5 text-neutral-300">
          {/* Il segno rosso obliquo, come nella barra della Y */}
          <span
            aria-hidden="true"
            className="bg-rosso-acceso h-[3px] w-3 shrink-0 -skew-x-[28deg] shadow-[0_0_8px_rgba(255,59,48,0.6)]"
          />
          <span className="truncate">
            {meta ?? t(`model.sheet.vehicleTypes.${version.vehicle_type}`)}
          </span>
        </span>
        <span className="text-rosso-acceso shrink-0 tabular-nums">
          {version.years.start}
        </span>
      </div>

      <div className="relative py-6 pr-11 pl-6">
        <h3 className="font-display text-[1.75rem] leading-[0.95] font-extrabold tracking-[-0.035em] md:text-[2rem]">
          {version.name}
        </h3>
        {modelName && (
          <p className="mt-2 text-[0.8125rem] text-neutral-400">{modelName}</p>
        )}
      </div>

      {to && (
        // La freccia accanto al taglio, che si accende di rosso
        <span
          aria-hidden="true"
          className="group-hover:text-rosso-acceso absolute right-7 bottom-7 text-base text-neutral-500 transition duration-300 group-hover:translate-x-0.5"
        >
          →
        </span>
      )}

      {/* Il bordo del taglio, che le ombre interne non disegnano */}
      <span
        aria-hidden="true"
        className="absolute right-0 bottom-0 h-px w-10 origin-bottom-right -rotate-45 bg-white/12"
      />
    </>
  )

  const className = [
    'group bg-ombra relative flex min-h-[17rem] flex-col justify-end overflow-hidden md:min-h-[19rem]',
    // La forma della Y: l'angolo grande in alto a sinistra, gli altri quasi vivi, il taglio in basso a destra
    'rounded-[4px] rounded-tl-[28px] [clip-path:polygon(0_0,100%_0,100%_calc(100%-28px),calc(100%-28px)_100%,0_100%)]',
    // Il bordo è un'ombra interna sul livello ::after: un bordo vero verrebbe tagliato con l'angolo
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']",
    'after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] after:transition-shadow',
  ].join(' ')

  return to ? (
    <Link
      to={to}
      className={[
        className,
        'transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1',
        'hover:after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]',
        // Il contorno del focus disegnato dentro: il ritaglio taglierebbe quello di fuori
        'focus-visible:outline-none focus-visible:after:shadow-[inset_0_0_0_2px_var(--color-rosso-acceso)]',
      ].join(' ')}
    >
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  )
}

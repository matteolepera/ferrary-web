import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { Version } from '@/types/catalog'

type VersionCardProps = {
  version: Version
  /** Un dettaglio in alto a sinistra, come il ruolo del designer */
  meta?: string
}

/**
 * La card di una versione: porta alla pagina del suo modello, con la versione già scelta.
 */
export function VersionCard({ version, meta }: VersionCardProps) {
  const { t } = useTranslation()

  // Senza il modello non sapremmo dove portare: la card resta, ma non è un link
  const to = version.model
    ? `/modelli/${version.model.slug}?versione=${version.slug}`
    : undefined

  const content = (
    <>
      {version.cover ? (
        <img
          src={version.cover.url}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="riflettore absolute inset-0">
          <p className="mt-20 text-center text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-500 uppercase">
            {t('model.noPhoto')}
          </p>
        </div>
      )}

      <div
        aria-hidden="true"
        className="from-notte via-notte/30 to-notte/40 absolute inset-0 bg-linear-to-t"
      />

      <div className="absolute inset-x-5 top-5 flex justify-between gap-4 text-[0.625rem] font-semibold tracking-[0.2em] uppercase">
        <span className="text-neutral-300">{meta}</span>
        <span className="text-rosso-acceso">{version.years.start}</span>
      </div>

      <h3 className="font-display relative p-5 text-[1.75rem] leading-none font-extrabold tracking-[-0.035em] md:text-[2rem]">
        {version.name}
      </h3>
    </>
  )

  const className =
    'group relative flex min-h-[16rem] flex-col justify-end overflow-hidden bg-ombra md:min-h-[18rem]'

  return to ? (
    <Link
      to={to}
      className={`${className} focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-2`}
    >
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  )
}

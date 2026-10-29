import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { VersionCard } from '@/components/catalog/VersionCard'
import type { Version } from '@/types/catalog'

type CatalogDetailProps = {
  /** Il link di ritorno all'elenco del catalogo */
  back: { to: string; label: string }
  eyebrow?: string
  name: string
  /** Dettagli sotto il nome, come la data di nascita di un pilota */
  children?: ReactNode
  versions: Version[]
  /** Il dettaglio in alto a sinistra di ogni card, come il ruolo del designer */
  metaFor?: (version: Version) => string | undefined
}

/**
 * La pagina di una voce di catalogo: il nome in grande e le Ferrari collegate.
 */
export function CatalogDetail({
  back,
  eyebrow,
  name,
  children,
  versions,
  metaFor,
}: CatalogDetailProps) {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-[1360px] px-5 pt-28 pb-18 md:px-10 md:pt-36 md:pb-24 lg:pt-40">
      <title>{`${name} – Ferrary`}</title>

      <Link
        to={back.to}
        className="text-[0.6875rem] font-semibold tracking-[0.18em] text-neutral-300 uppercase hover:text-white md:text-xs"
      >
        ← {back.label}
      </Link>

      {eyebrow && (
        <p className="text-rosso-acceso mt-8 text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display mt-3 text-[3rem] leading-[0.95] font-extrabold tracking-[-0.035em] md:text-7xl lg:text-[clamp(4rem,7vw,6.5rem)]">
        {name}
      </h1>
      {children}

      <section aria-labelledby="opere-titolo" className="mt-14 md:mt-18">
        <h2
          id="opere-titolo"
          className="font-display text-2xl font-extrabold tracking-[-0.02em] md:text-3xl"
        >
          {t('catalogs.works')}{' '}
          <span className="text-neutral-500">{versions.length}</span>
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {versions.map((version) => (
            <li key={version.id}>
              <VersionCard version={version} meta={metaFor?.(version)} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

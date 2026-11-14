import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { VersionCard } from '@/components/catalog/VersionCard'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { type Fact, FactStrip } from '@/components/ui/FactStrip'
import type { Version } from '@/types/catalog'
import { FactLine } from '@/components/catalog/FactLine'

type CatalogDetailProps = {
  /** Il link di ritorno all'elenco del catalogo */
  back: { to: string; label: string }
  /** Che cos'è, nell'etichetta rossa: "Motore", "Pilota", "Studio" */
  kind: string
  /** Il dettaglio accanto, in grigio: il nome del motore, il Paese */
  detail?: string | null
  name: string
  /** Il testo sotto il nome, come la storia di un motore */
  description?: string | null
  /** La fascia grande dei dati, per il motore che ne ha tanti */
  facts?: { stars: Fact[]; caption: Fact[] }
  /** I pochi dati brevi in riga sotto il nome, per designer e piloti */
  highlights?: Fact[]
  versions: Version[]
  /** Il dettaglio in alto a sinistra di ogni carta, come il ruolo del designer */
  metaFor?: (version: Version) => string | undefined
}

/**
 * La pagina di una voce di catalogo: il percorso nella targhetta della Y,
 * il nome in grande sotto il riflettore e le Ferrari collegate.
 */
export function CatalogDetail({
  back,
  kind,
  detail,
  name,
  description,
  facts,
  highlights,
  versions,
  metaFor,
}: CatalogDetailProps) {
  const { t } = useTranslation()

  return (
    <>
      <title>{`${name} – Ferrary`}</title>

      <section aria-labelledby="catalogo-titolo" className="relative">
        {/* Il riflettore dall'alto, come nella scheda di un modello senza foto */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_85%_at_50%_0%,rgba(255,255,255,0.085),transparent_72%)]"
        />

        {/* Da telefono non c'è l'intestazione sopra: la targhetta può stare in alto */}
        <div className="relative mx-auto max-w-[1360px] px-5 pt-8 pb-10 md:px-10 md:pt-10 md:pb-12 lg:pt-28">
          {/* Il percorso: il ritorno all'elenco, in una targhetta con l'angolo della Y */}
          <nav aria-label={t('model.breadcrumb')}>
            <Link
              to={back.to}
              className="group focus-visible:outline-rosso-acceso inline-flex h-9 items-center gap-2 rounded-[3px] rounded-tl-[12px] border border-white/12 bg-neutral-900/60 pr-4 pl-3 text-[0.625rem] font-semibold tracking-[0.18em] text-neutral-200 uppercase backdrop-blur-md transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 md:text-[0.6875rem]"
            >
              <ArrowLeft
                aria-hidden="true"
                className="text-rosso-acceso size-3.5 transition-transform group-hover:-translate-x-0.5"
              />
              {back.label}
            </Link>
          </nav>

          <Eyebrow className="mt-10 flex-wrap gap-y-1 md:mt-14">
            {kind}
            {detail && <span className="text-neutral-300">· {detail}</span>}
          </Eyebrow>
          <h1
            id="catalogo-titolo"
            className="font-display mt-3 text-[3rem] leading-[0.95] font-extrabold tracking-[-0.035em] md:text-7xl lg:text-[clamp(4rem,7vw,6.5rem)]"
          >
            {name}
          </h1>
          {description && (
            <p className="mt-5 max-w-[60ch] text-[0.9375rem] leading-relaxed text-neutral-300 md:mt-6 md:text-[1.0625rem] md:leading-[1.7]">
              {description}
            </p>
          )}
          {highlights && <FactLine facts={highlights} />}
        </div>
      </section>

      {facts && (
        <FactStrip
          label={t('catalogs.factsLabel')}
          stars={facts.stars}
          caption={facts.caption}
        />
      )}

      <section
        aria-labelledby="opere-titolo"
        className="mx-auto max-w-[1360px] px-5 pt-12 pb-18 md:px-10 md:pt-16 md:pb-24"
      >
        <div className="border-linea flex items-end justify-between gap-4 border-b pb-4 md:pb-5">
          <h2
            id="opere-titolo"
            className="font-display text-[1.75rem] leading-none font-extrabold tracking-[-0.03em] md:text-4xl"
          >
            {t('catalogs.works')}{' '}
            <span className="text-neutral-600">{versions.length}</span>
          </h2>
          <p className="text-[0.8125rem] text-neutral-500">
            {t('catalogs.byYear')}
          </p>
        </div>

        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {versions.map((version) => (
            <li key={version.id}>
              <VersionCard version={version} meta={metaFor?.(version)} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

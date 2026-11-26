import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { GalleryCard } from '@/components/admin/images/GalleryCard'
import { RacingCard } from '@/components/admin/racing/RacingCard'
import {
  SectionIndex,
  type SectionIndexItem,
} from '@/components/admin/ui/SectionIndex'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { TrashCard } from '@/components/admin/ui/TrashCard'
import { CreditsCard } from '@/components/admin/versions/CreditsCard'
import { VersionPublication } from '@/components/admin/versions/VersionPublication'
import { VersionSectionCard } from '@/components/admin/versions/VersionSectionCard'
import { VersionSectionModal } from '@/components/admin/versions/VersionSectionModal'
import {
  versionSections,
  type VersionSection,
} from '@/components/admin/versions/versionSections'
import {
  sectionSummary,
  summaryStatus,
} from '@/components/admin/versions/versionSummary'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useAdminEngines } from '@/hooks/useAdminEngines'
import { useCurrentUser } from '@/hooks/useAuth'
import { useTrashActions } from '@/hooks/useTrash'
import { useVersionImages } from '@/hooks/useVersionImages'
import { useVersionRacing } from '@/hooks/useVersionRacing'
import type { AdminVersion } from '@/types/admin'

const dateFormat = new Intl.DateTimeFormat('it', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

type VersionPageProps = {
  modelId: number
  modelName: string
  version: AdminVersion
}

/**
 * La pagina di una versione: si legge, non si compila. Le sezioni stanno in una colonna,
 * tutte larghe uguali; «Modifica» apre la sezione in una finestra, che salva solo quella.
 * A destra una colonna resta ferma mentre si scorre: la pubblicazione e l'indice.
 */
export function VersionPage({ modelId, modelName, version }: VersionPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useCurrentUser()
  // I motori del catalogo: la motorizzazione scrive il nome del suo motore
  const { data: engines } = useAdminEngines()
  // Le stesse richieste della galleria e dei risultati: la cache le fa una volta sola
  const { data: images } = useVersionImages(version.id)
  const { data: records } = useVersionRacing(version.id)
  const { trashVersion } = useTrashActions()
  // La sezione aperta in una finestra, o nessuna
  const [editing, setEditing] = useState<VersionSection | null>(null)

  const justCreated =
    (location.state as { created?: boolean } | null)?.created === true

  /** I dati da leggere di una sezione: servono al blocco e al suo pallino nell'indice */
  const summary = (section: VersionSection) =>
    sectionSummary(section, version, engines)

  const credits =
    (version.designers?.length ?? 0) + (version.drivers?.length ?? 0)

  // L'indice, nell'ordine della pagina; foto, persone e risultati sono pieni o vuoti
  const index: SectionIndexItem[] = [
    {
      id: 'versione-identita',
      label: 'Identità',
      status: summaryStatus(summary('identita')),
    },
    {
      id: 'versione-foto',
      label: 'Foto',
      status: images?.length ? 'complete' : 'empty',
    },
    {
      id: 'versione-produzione',
      label: 'Anni e produzione',
      status: summaryStatus(summary('produzione')),
    },
    {
      id: 'versione-descrizione',
      label: 'Descrizione',
      status: summaryStatus(summary('descrizione')),
    },
    {
      id: 'versione-crediti',
      label: 'Designer e piloti',
      status: credits > 0 ? 'complete' : 'empty',
    },
    {
      id: 'versione-risultati',
      label: 'Risultati sportivi',
      status: records?.length ? 'complete' : 'empty',
    },
    {
      id: 'versione-motorizzazione',
      label: 'Motorizzazione',
      status: summaryStatus(summary('motorizzazione')),
    },
    {
      id: 'versione-scheda',
      label: 'Scheda tecnica',
      status: summaryStatus(summary('scheda')),
    },
  ]
  const active = useActiveSection(index.map((item) => item.id))

  /** Il blocco da leggere di una sezione, con il suo «Modifica» */
  function sectionCard(section: VersionSection, delay: number, empty?: string) {
    return (
      <VersionSectionCard
        id={`versione-${section}`}
        title={versionSections[section].title}
        items={summary(section)}
        empty={empty}
        onEdit={() => setEditing(section)}
        delay={delay}
      />
    )
  }

  return (
    <div>
      <title>{`${version.name} – Ferrary`}</title>

      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <Link
            to={`/admin/modelli/${modelId}`}
            className="text-xs font-semibold text-neutral-400 transition-colors hover:text-white"
          >
            <span aria-hidden="true">← </span>
            {modelName}
          </Link>
          <h1 className="font-display mt-3 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
            {version.name}
          </h1>
          <div className="mt-3">
            <StatusBadge
              status={version.status}
              publishedAt={version.published_at}
            />
          </div>
        </div>

        <p role="status" className="text-sm text-neutral-300">
          {justCreated && 'Versione creata: è una bozza.'}
        </p>
      </header>

      {/* Due colonne: le sezioni a sinistra, a destra la colonna che resta ferma */}
      <div className="mt-7 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-4">
          {sectionCard('identita', 0)}
          <GalleryCard
            versionId={version.id}
            versionName={version.name}
            delay={60}
          />
          {sectionCard('produzione', 120)}
          {sectionCard('descrizione', 160, 'Ancora nessun testo.')}
          <CreditsCard version={version} delay={200} />
          <RacingCard versionId={version.id} delay={240} />
          {sectionCard(
            'motorizzazione',
            280,
            'Nessuna motorizzazione indicata.',
          )}
          {sectionCard('scheda', 320)}

          {user?.role !== 'moderator' && (
            <TrashCard
              description="La versione sparirà dal sito e dall'admin. Si può ripristinare dal cestino."
              question={`Spostare ${version.name} nel cestino?`}
              isPending={trashVersion.isPending}
              error={trashVersion.error}
              onConfirm={() =>
                trashVersion.mutate(version.id, {
                  onSuccess: () =>
                    navigate(`/admin/modelli/${modelId}`, { replace: true }),
                })
              }
              delay={360}
            />
          )}
        </div>

        {/* Sotto i 1024 pixel va in cima, prima delle sezioni: la pubblicazione resta a portata */}
        <aside className="order-first flex flex-col gap-4 lg:sticky lg:top-7 lg:order-none">
          <VersionPublication
            version={version}
            canPublish={user?.role !== 'moderator'}
            // Ogni finestra salva da sola: nella pagina non restano modifiche in sospeso
            hasUnsavedChanges={false}
            delay={60}
          />
          <SectionIndex items={index} active={active} className="max-lg:hidden">
            Creata il {dateFormat.format(new Date(version.created_at))}
            <br />
            Modificata il {dateFormat.format(new Date(version.updated_at))}
          </SectionIndex>
        </aside>
      </div>

      {/* Montata solo quando serve, con la sezione come chiave: ogni volta parte dai dati salvati */}
      {editing && (
        <VersionSectionModal
          key={editing}
          modelId={modelId}
          version={version}
          section={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { GalleryCard } from '@/components/admin/images/GalleryCard'
import { RacingCard } from '@/components/admin/racing/RacingCard'
import { AdminCard } from '@/components/admin/ui/AdminCard'
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
import { sectionSummary } from '@/components/admin/versions/versionSummary'
import { useAdminEngines } from '@/hooks/useAdminEngines'
import { useCurrentUser } from '@/hooks/useAuth'
import { useTrashActions } from '@/hooks/useTrash'
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
 * La pagina di una versione: si legge, non si compila. Ogni sezione mostra i suoi dati
 * e «Modifica» la apre in una finestra, che salva solo quella sezione.
 * Foto, persone e risultati si salvano già da soli, e restano come sono.
 */
export function VersionPage({ modelId, modelName, version }: VersionPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useCurrentUser()
  // I motori del catalogo: la motorizzazione scrive il nome del suo motore
  const { data: engines } = useAdminEngines()
  const { trashVersion } = useTrashActions()
  // La sezione aperta in una finestra, o nessuna
  const [editing, setEditing] = useState<VersionSection | null>(null)

  const justCreated =
    (location.state as { created?: boolean } | null)?.created === true

  /** Il blocco da leggere di una sezione, con il suo «Modifica» */
  function sectionCard(
    section: VersionSection,
    delay: number,
    className = 'col-span-6 lg:col-span-12',
    empty?: string,
  ) {
    return (
      <VersionSectionCard
        id={`versione-${section}`}
        title={versionSections[section].title}
        items={sectionSummary(section, version, engines)}
        empty={empty}
        onEdit={() => setEditing(section)}
        delay={delay}
        className={className}
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

      <div className="mt-7 grid grid-cols-6 gap-4 lg:grid-cols-12">
        {sectionCard('identita', 0, 'col-span-6 lg:col-span-8')}

        {/* La colonna di destra: la pubblicazione sopra il riepilogo */}
        <div className="col-span-6 flex flex-col gap-4 lg:col-span-4">
          <VersionPublication
            version={version}
            canPublish={user?.role !== 'moderator'}
            // Ogni finestra salva da sola: nella pagina non restano modifiche in sospeso
            hasUnsavedChanges={false}
            delay={60}
          />
          <AdminCard
            aria-labelledby="versione-riepilogo"
            delay={120}
            className="p-6"
          >
            <h2
              id="versione-riepilogo"
              className="font-display text-xl font-extrabold tracking-[-0.03em]"
            >
              Riepilogo
            </h2>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <dt className="text-neutral-400">Modello</dt>
              <dd className="text-right">
                <Link
                  to={`/admin/modelli/${modelId}`}
                  className="hover:text-rosso-acceso font-semibold"
                >
                  {modelName}
                </Link>
              </dd>
              <dt className="text-neutral-400">Creata il</dt>
              <dd className="text-right">
                {dateFormat.format(new Date(version.created_at))}
              </dd>
              <dt className="text-neutral-400">Ultima modifica</dt>
              <dd className="text-right">
                {dateFormat.format(new Date(version.updated_at))}
              </dd>
            </dl>
          </AdminCard>
        </div>

        <GalleryCard
          versionId={version.id}
          versionName={version.name}
          delay={150}
          className="col-span-6 lg:col-span-12"
        />

        {sectionCard('produzione', 180)}
        {sectionCard('descrizione', 240, undefined, 'Ancora nessun testo.')}

        <CreditsCard
          version={version}
          delay={270}
          className="col-span-6 lg:col-span-12"
        />
        <RacingCard
          versionId={version.id}
          delay={285}
          className="col-span-6 lg:col-span-12"
        />

        {sectionCard(
          'motorizzazione',
          300,
          undefined,
          'Nessuna motorizzazione indicata.',
        )}
        {sectionCard('scheda', 360)}

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
            delay={420}
            className="col-span-6 lg:col-span-12"
          />
        )}
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

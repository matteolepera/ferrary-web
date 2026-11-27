import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ModelPublication } from '@/components/admin/models/ModelPublication'
import { ModelSectionModal } from '@/components/admin/models/ModelSectionModal'
import {
  modelSections,
  type ModelSection,
} from '@/components/admin/models/modelSections'
import { modelSectionSummary } from '@/components/admin/models/modelSummary'
import { BackLink } from '@/components/admin/ui/BackLink'
import {
  SectionIndex,
  type SectionIndexItem,
} from '@/components/admin/ui/SectionIndex'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { TrashCard } from '@/components/admin/ui/TrashCard'
import { VersionSectionCard } from '@/components/admin/versions/VersionSectionCard'
import { VersionsCard } from '@/components/admin/versions/VersionsCard'
import { summaryStatus } from '@/components/admin/versions/versionSummary'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useAdminCategories } from '@/hooks/useAdminModels'
import { useCurrentUser } from '@/hooks/useAuth'
import { useTrashActions } from '@/hooks/useTrash'
import type { AdminCarModel } from '@/types/admin'

const dateFormat = new Intl.DateTimeFormat('it', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/**
 * La pagina di un modello, come quella delle versioni: si legge, e «Modifica» apre
 * la sezione in una finestra. A destra, ferma, la pubblicazione con l'indice.
 */
export function ModelPage({ model }: { model: AdminCarModel }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useCurrentUser()
  const { data: categories } = useAdminCategories()
  const { trashModel } = useTrashActions()
  // La sezione aperta in una finestra, o nessuna
  const [editing, setEditing] = useState<ModelSection | null>(null)

  // Arrivati qui subito dopo la creazione: la pagina precedente ce lo dice nello stato della navigazione
  const justCreated =
    (location.state as { created?: boolean } | null)?.created === true

  const summary = (section: ModelSection) =>
    modelSectionSummary(section, model, categories)

  const index: SectionIndexItem[] = [
    {
      id: 'modello-dati',
      label: 'Dati principali',
      status: summaryStatus(summary('dati')),
    },
    {
      id: 'modello-descrizione',
      label: 'Descrizione',
      status: summaryStatus(summary('descrizione')),
    },
    {
      id: 'modello-versioni',
      label: 'Versioni',
      status: model.versions_count ? 'complete' : 'empty',
    },
  ]
  const active = useActiveSection(index.map((item) => item.id))

  /** Il blocco da leggere di una sezione, con il suo «Modifica» */
  function sectionCard(section: ModelSection, delay: number, empty?: string) {
    return (
      <VersionSectionCard
        id={`modello-${section}`}
        title={modelSections[section].title}
        items={summary(section)}
        empty={empty}
        onEdit={() => setEditing(section)}
        delay={delay}
      />
    )
  }

  return (
    <div>
      <title>{`${model.name} – Ferrary`}</title>

      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <BackLink to="/admin/modelli" label="Modelli" />
          <h1 className="font-display mt-4 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
            {model.name}
          </h1>
          <div className="mt-3">
            <StatusBadge
              status={model.status}
              publishedAt={model.published_at}
            />
          </div>
        </div>

        <p role="status" className="text-sm text-neutral-300">
          {justCreated && 'Modello creato: è una bozza.'}
        </p>
      </header>

      {/* Due colonne: le sezioni a sinistra, a destra la colonna che resta ferma */}
      <div className="mt-7 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-4">
          {sectionCard('dati', 0)}
          {sectionCard('descrizione', 60, 'Ancora nessun testo.')}
          <VersionsCard model={model} delay={120} />

          {user?.role !== 'moderator' && (
            <TrashCard
              description="Il modello sparirà dal sito e dall'admin, insieme a tutte le sue versioni. Si può ripristinare dal cestino."
              question={`Spostare ${model.name} nel cestino?`}
              isPending={trashModel.isPending}
              error={trashModel.error}
              onConfirm={() =>
                trashModel.mutate(model.id, {
                  onSuccess: () =>
                    navigate('/admin/modelli', { replace: true }),
                })
              }
              delay={180}
            />
          )}
        </div>

        {/* Sotto i 1024 pixel va in cima, prima delle sezioni: la pubblicazione resta a portata */}
        <aside className="order-first flex flex-col gap-4 lg:sticky lg:top-7 lg:order-none">
          <ModelPublication
            model={model}
            canPublish={user?.role !== 'moderator'}
            // Ogni finestra salva da sola: nella pagina non restano modifiche in sospeso
            hasUnsavedChanges={false}
            delay={60}
          />
          <SectionIndex items={index} active={active} className="max-lg:hidden">
            {model.versions_count === 1
              ? '1 versione'
              : `${model.versions_count ?? 0} versioni`}
            <br />
            Creato il {dateFormat.format(new Date(model.created_at))}
            <br />
            Modificato il {dateFormat.format(new Date(model.updated_at))}
          </SectionIndex>
        </aside>
      </div>

      {/* Montata solo quando serve, con la sezione come chiave: ogni volta parte dai dati salvati */}
      {editing && (
        <ModelSectionModal
          key={editing}
          model={model}
          section={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

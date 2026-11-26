import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { DescriptionFields } from '@/components/admin/versions/DescriptionFields'
import { IdentityFields } from '@/components/admin/versions/IdentityFields'
import { PowertrainFields } from '@/components/admin/versions/PowertrainFields'
import type { PowertrainField } from '@/components/admin/versions/powertrain'
import { ProductionFields } from '@/components/admin/versions/ProductionFields'
import { SpecsFields } from '@/components/admin/versions/SpecsFields'
import type { SpecsField } from '@/components/admin/versions/specs'
import type { VersionValues } from '@/components/admin/versions/versionValues'
import { VersionPublication } from '@/components/admin/versions/VersionPublication'
import { useCurrentUser } from '@/hooks/useAuth'
import { useVersionDraft } from '@/hooks/useVersionDraft'
import type { AdminVersion } from '@/types/admin'
import { GalleryCard } from '@/components/admin/images/GalleryCard'
import { CreditsCard } from '@/components/admin/versions/CreditsCard'
import { RacingCard } from '@/components/admin/racing/RacingCard'
import { TrashCard } from '@/components/admin/ui/TrashCard'
import { useTrashActions } from '@/hooks/useTrash'

const dateFormat = new Intl.DateTimeFormat('it', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const cardTitle = 'font-display text-xl font-extrabold tracking-[-0.03em]'

type VersionFormProps = {
  modelId: number
  modelName: string
  version?: AdminVersion
}

/**
 * Il form della versione: identità, anni, produzione, descrizione,
 * motorizzazione e scheda tecnica, salvati insieme in un'unica richiesta.
 */
export function VersionForm({ modelId, modelName, version }: VersionFormProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useCurrentUser()
  // Lo stato della versione e il suo salvataggio vivono in useVersionDraft
  const draft = useVersionDraft(modelId, version)
  const { values, powertrain, specs, save, errors } = draft
  const { trashVersion } = useTrashActions()

  const [saved, setSaved] = useState(false)
  // Ci sono modifiche non ancora salvate: la pubblicazione deve dirlo
  const [dirty, setDirty] = useState(false)

  const justCreated =
    (location.state as { created?: boolean } | null)?.created === true

  /** Dopo ogni modifica: il messaggio "salvate" sparisce, e le modifiche risultano in sospeso */
  function touched() {
    setSaved(false)
    setDirty(true)
  }

  function update<K extends keyof VersionValues>(
    field: K,
    value: VersionValues[K],
  ) {
    draft.update(field, value)
    touched()
  }

  function updatePowertrain(field: PowertrainField, value: string) {
    draft.updatePowertrain(field, value)
    touched()
  }

  function updateSpecs(field: SpecsField, value: string) {
    draft.updateSpecs(field, value)
    touched()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    draft.submit((result) => {
      if (version) {
        setSaved(true)
        setDirty(false)
      } else {
        navigate(`/admin/modelli/${modelId}/versioni/${result.id}`, {
          replace: true,
          state: { created: true },
        })
      }
    })
  }

  /** Il riepilogo: il modello a cui appartiene e le date */
  const summary = (
    <AdminCard aria-labelledby="versione-riepilogo" delay={120} className="p-6">
      <h2 id="versione-riepilogo" className={cardTitle}>
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
        {version && (
          <>
            <dt className="text-neutral-400">Creata il</dt>
            <dd className="text-right">
              {dateFormat.format(new Date(version.created_at))}
            </dd>
            <dt className="text-neutral-400">Ultima modifica</dt>
            <dd className="text-right">
              {dateFormat.format(new Date(version.updated_at))}
            </dd>
          </>
        )}
      </dl>
      {!version && (
        <p className="mt-4 text-sm leading-relaxed text-neutral-400">
          La versione nasce come bozza: non comparirà sul sito finché non verrà
          pubblicata.
        </p>
      )}
    </AdminCard>
  )

  return (
    <form onSubmit={handleSubmit} noValidate>
      <title>{`${version?.name ?? 'Nuova versione'} – Ferrary`}</title>

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
            {version?.name ?? 'Nuova versione'}
          </h1>
          {version && (
            <div className="mt-3">
              <StatusBadge
                status={version.status}
                publishedAt={version.published_at}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <p role="status" className="text-sm text-neutral-300">
            {saved && 'Modifiche salvate.'}
            {justCreated &&
              !saved &&
              !save.isPending &&
              'Versione creata: è una bozza.'}
          </p>
          <button
            type="submit"
            disabled={save.isPending}
            className={adminButtonClass('primary')}
          >
            {save.isPending
              ? 'Salvataggio…'
              : version
                ? 'Salva modifiche'
                : 'Crea versione'}
          </button>
        </div>
      </header>

      {save.isError && !errors && (
        <p
          role="alert"
          className="border-errore/40 bg-errore/10 text-errore mt-5 rounded-2xl border px-4 py-3 text-[0.8125rem]"
        >
          Impossibile salvare in questo momento. Riprova.
        </p>
      )}

      <div className="mt-7 grid grid-cols-6 gap-4 lg:grid-cols-12">
        <AdminCard
          aria-labelledby="versione-identita"
          className="col-span-6 p-6 lg:col-span-8"
        >
          <h2 id="versione-identita" className={cardTitle}>
            Identità
          </h2>
          <div className="mt-5">
            <IdentityFields values={values} onChange={update} errors={errors} />
          </div>
        </AdminCard>

        {/* La colonna di destra: la pubblicazione sopra il riepilogo, per una versione esistente */}
        <div className="col-span-6 flex flex-col gap-4 lg:col-span-4">
          {version && (
            <VersionPublication
              version={version}
              canPublish={user?.role !== 'moderator'}
              hasUnsavedChanges={dirty}
              delay={60}
            />
          )}
          {summary}
        </div>

        {/* Le foto si caricano in una versione: prima la versione deve esistere */}
        {version && (
          <GalleryCard
            versionId={version.id}
            versionName={version.name}
            delay={150}
            className="col-span-6 lg:col-span-12"
          />
        )}

        <AdminCard
          aria-labelledby="versione-produzione"
          delay={180}
          className="col-span-6 p-6 lg:col-span-12"
        >
          <h2 id="versione-produzione" className={cardTitle}>
            Anni e produzione
          </h2>
          <div className="mt-5">
            <ProductionFields
              values={values}
              onChange={update}
              errors={errors}
            />
          </div>
        </AdminCard>

        <AdminCard
          aria-labelledby="versione-descrizione"
          delay={240}
          className="col-span-6 p-6 lg:col-span-12"
        >
          <h2 id="versione-descrizione" className={cardTitle}>
            Descrizione
          </h2>
          <div className="mt-5">
            <DescriptionFields
              values={values}
              onChange={update}
              errors={errors}
            />
          </div>
        </AdminCard>

        {version && (
          <CreditsCard
            version={version}
            delay={270}
            className="col-span-6 lg:col-span-12"
          />
        )}

        {version && (
          <RacingCard
            versionId={version.id}
            delay={285}
            className="col-span-6 lg:col-span-12"
          />
        )}

        {/* Per ora i campi stanno in una card: nei prossimi commit si sposteranno in una finestra */}
        <AdminCard
          aria-labelledby="versione-motorizzazione"
          delay={300}
          className="col-span-6 p-6 lg:col-span-12"
        >
          <h2 id="versione-motorizzazione" className={cardTitle}>
            Motorizzazione
          </h2>
          <div className="mt-5">
            <PowertrainFields
              values={powertrain}
              onChange={updatePowertrain}
              errors={errors}
            />
          </div>
        </AdminCard>

        <AdminCard
          aria-labelledby="versione-scheda"
          delay={360}
          className="col-span-6 p-6 lg:col-span-12"
        >
          <h2 id="versione-scheda" className={cardTitle}>
            Scheda tecnica
          </h2>
          <div className="mt-5">
            <SpecsFields
              values={specs}
              onChange={updateSpecs}
              errors={errors}
            />
          </div>
        </AdminCard>
        {version && user?.role !== 'moderator' && (
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
    </form>
  )
}

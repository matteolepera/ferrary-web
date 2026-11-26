import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { AdminSwitch } from '@/components/admin/ui/AdminSwitch'
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import {
  bodyTypes,
  productionTypes,
  vehicleTypes,
} from '@/components/admin/versions/options'
import { PowertrainCard } from '@/components/admin/versions/PowertrainCard'
import type { PowertrainField } from '@/components/admin/versions/powertrain'
import { SpecsCard } from '@/components/admin/versions/SpecsCard'
import type { SpecsField } from '@/components/admin/versions/specs'
import type { VersionValues } from '@/components/admin/versions/versionValues'
import { VersionPublication } from '@/components/admin/versions/VersionPublication'
import { useCurrentUser } from '@/hooks/useAuth'
import { useVersionDraft } from '@/hooks/useVersionDraft'
import { slugify } from '@/lib/slugify'
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
  const isF1 = values.vehicle_type === 'f1'

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
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <AdminField
              label="Nome"
              value={values.name}
              onChange={(event) => update('name', event.target.value)}
              error={errors?.name?.[0]}
            />
            <AdminField
              label="Slug"
              value={values.slug}
              placeholder={slugify(values.name)}
              onChange={(event) => update('slug', event.target.value)}
              hint="Vuoto: lo generiamo dal nome."
              error={errors?.slug?.[0]}
            />
            <AdminSelect
              label="Tipo di veicolo"
              value={values.vehicle_type}
              onChange={(event) => {
                const vehicleType = event.target
                  .value as VersionValues['vehicle_type']
                update('vehicle_type', vehicleType)
                // Una Formula 1 è sempre una monoposto
                if (vehicleType === 'f1') update('body_type', 'monoposto')
              }}
              error={errors?.vehicle_type?.[0]}
            >
              <option value="">Scegli un tipo</option>
              {vehicleTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdminSelect>
            <AdminSelect
              label="Carrozzeria"
              value={values.body_type}
              onChange={(event) =>
                update(
                  'body_type',
                  event.target.value as VersionValues['body_type'],
                )
              }
              hint={isF1 ? 'Una Formula 1 è sempre una monoposto.' : undefined}
              error={errors?.body_type?.[0]}
            >
              <option value="">Non indicata</option>
              {bodyTypes
                .filter((option) => !isF1 || option.value === 'monoposto')
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </AdminSelect>
            <AdminField
              label="Codice di progetto"
              value={values.project_code}
              placeholder="F173"
              onChange={(event) => update('project_code', event.target.value)}
              error={errors?.project_code?.[0]}
            />
            <AdminField
              label="Posti"
              type="number"
              inputMode="numeric"
              min={1}
              max={9}
              value={values.seats}
              onChange={(event) => update('seats', event.target.value)}
              error={errors?.seats?.[0]}
            />
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
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <AdminField
              label="Anno di inizio"
              type="number"
              inputMode="numeric"
              min={1947}
              value={values.year_start}
              onChange={(event) => update('year_start', event.target.value)}
              error={errors?.year_start?.[0]}
            />
            <AdminField
              label="Anno di fine"
              type="number"
              inputMode="numeric"
              min={1947}
              value={values.in_production ? '' : values.year_end}
              disabled={values.in_production}
              onChange={(event) => update('year_end', event.target.value)}
              hint={
                values.in_production
                  ? 'In produzione: nessun anno di fine.'
                  : undefined
              }
              error={errors?.year_end?.[0]}
            />
            <AdminSwitch
              label="In produzione"
              hint="Ancora costruita oggi."
              checked={values.in_production}
              onChange={(event) =>
                update('in_production', event.target.checked)
              }
              className="self-center"
            />
            <AdminSelect
              label="Tipo di produzione"
              value={values.production_type}
              onChange={(event) =>
                update(
                  'production_type',
                  event.target.value as VersionValues['production_type'],
                )
              }
              error={errors?.production_type?.[0]}
            >
              <option value="">Non indicato</option>
              {productionTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdminSelect>
            <AdminField
              label="Esemplari prodotti"
              type="number"
              inputMode="numeric"
              min={1}
              value={values.units_produced}
              onChange={(event) => update('units_produced', event.target.value)}
              hint={
                values.production_type === 'one_off'
                  ? 'Un one-off è un esemplare unico.'
                  : undefined
              }
              error={errors?.units_produced?.[0]}
            />
            <AdminField
              label="Posizione"
              type="number"
              inputMode="numeric"
              min={0}
              value={values.sort_order}
              onChange={(event) => update('sort_order', event.target.value)}
              hint="L'ordine tra le versioni del modello."
              error={errors?.sort_order?.[0]}
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
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <AdminTextarea
              label="In italiano"
              value={values.description_it}
              onChange={(event) => update('description_it', event.target.value)}
              error={errors?.['description.it']?.[0]}
            />
            <AdminTextarea
              label="In inglese"
              value={values.description_en}
              onChange={(event) => update('description_en', event.target.value)}
              error={errors?.['description.en']?.[0]}
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

        <PowertrainCard
          values={powertrain}
          onChange={updatePowertrain}
          errors={errors}
          delay={300}
        />

        <SpecsCard
          values={specs}
          onChange={updateSpecs}
          errors={errors}
          delay={360}
        />
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

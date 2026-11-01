import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { validationErrors } from '@/api/errors'
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
import { useSaveVersion } from '@/hooks/useAdminVersion'
import { slugify } from '@/lib/slugify'
import type {
  AdminVersion,
  BodyType,
  ProductionType,
  VehicleType,
} from '@/types/admin'

const dateFormat = new Intl.DateTimeFormat('it', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const cardTitle = 'font-display text-xl font-extrabold tracking-[-0.03em]'

/** I campi numerici sono testo nel form: vuoto diventa null, il resto un numero */
function toNumber(value: string) {
  return value.trim() === '' ? null : Number(value)
}

/** Un numero o null, come testo per un campo */
function toText(value: number | null | undefined) {
  return value === null || value === undefined ? '' : String(value)
}

type FormValues = {
  name: string
  slug: string
  vehicle_type: VehicleType | ''
  body_type: BodyType | ''
  project_code: string
  seats: string
  year_start: string
  year_end: string
  in_production: boolean
  production_type: ProductionType | ''
  units_produced: string
  sort_order: string
  description_it: string
  description_en: string
}

type VersionFormProps = {
  modelId: number
  modelName: string
  version?: AdminVersion
}

/**
 * Il form della versione: dati di base, anni, produzione e descrizione.
 * Motorizzazione e scheda tecnica arrivano come blocchi successivi.
 */
export function VersionForm({ modelId, modelName, version }: VersionFormProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const save = useSaveVersion(modelId, version?.id)

  const [values, setValues] = useState<FormValues>({
    name: version?.name ?? '',
    slug: version?.slug ?? '',
    vehicle_type: version?.vehicle_type ?? '',
    body_type: version?.body_type ?? '',
    project_code: version?.project_code ?? '',
    seats: toText(version?.seats),
    year_start: toText(version?.year_start),
    year_end: toText(version?.year_end),
    in_production: version?.in_production ?? false,
    production_type: version?.production_type ?? '',
    units_produced: toText(version?.units_produced),
    sort_order: toText(version?.sort_order ?? 1),
    description_it: version?.description.it ?? '',
    description_en: version?.description.en ?? '',
  })
  const [saved, setSaved] = useState(false)

  const justCreated =
    (location.state as { created?: boolean } | null)?.created === true
  const errors = validationErrors(save.error)
  const isF1 = values.vehicle_type === 'f1'

  function update<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    save.mutate(
      {
        name: values.name.trim(),
        slug: values.slug.trim() || undefined,
        // Il campo vuoto arriva al backend come null, e lui risponde "obbligatorio"
        vehicle_type: (values.vehicle_type || null) as VehicleType,
        body_type: values.body_type || null,
        project_code: values.project_code.trim() || null,
        seats: toNumber(values.seats),
        year_start: toNumber(values.year_start) as number,
        // In produzione non c'è un anno di fine
        year_end: values.in_production ? null : toNumber(values.year_end),
        in_production: values.in_production,
        production_type: values.production_type || null,
        units_produced: toNumber(values.units_produced),
        sort_order: toNumber(values.sort_order) ?? 1,
        description: { it: values.description_it, en: values.description_en },
        // specs e powertrain non ci sono: il backend lascia le sezioni come sono
      },
      {
        onSuccess: (result) => {
          if (version) {
            setSaved(true)
          } else {
            navigate(`/admin/modelli/${modelId}/versioni/${result.id}`, {
              replace: true,
              state: { created: true },
            })
          }
        },
      },
    )
  }

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
                  .value as FormValues['vehicle_type']
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
                  event.target.value as FormValues['body_type'],
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

        <AdminCard
          aria-labelledby="versione-riepilogo"
          delay={60}
          className="col-span-6 p-6 lg:col-span-4"
        >
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
              La versione nasce come bozza: non comparirà sul sito finché non
              verrà pubblicata.
            </p>
          )}
        </AdminCard>

        <AdminCard
          aria-labelledby="versione-produzione"
          delay={120}
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
                  event.target.value as FormValues['production_type'],
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
          delay={180}
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
      </div>
    </form>
  )
}

import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { backendMessage, validationErrors } from '@/api/errors'
import {
  aspirations,
  architectures,
  displacement,
  engineSummary,
} from '@/components/admin/engines/options'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { useEngineActions } from '@/hooks/useAdminEngines'
import type { AdminEngine, Aspiration, EngineArchitecture } from '@/types/admin'

const cardTitle = 'font-display text-xl font-extrabold tracking-[-0.03em]'

function toNumber(value: string) {
  return value.trim() === '' ? null : Number(value)
}

function toText(value: number | null | undefined) {
  return value === null || value === undefined ? '' : String(value)
}

/**
 * Il form di un motore: senza engine ne crea uno nuovo.
 */
export function EngineForm({ engine }: { engine?: AdminEngine }) {
  const navigate = useNavigate()
  const { save, remove } = useEngineActions()
  const [confirming, setConfirming] = useState(false)
  const [saved, setSaved] = useState(false)

  const [values, setValues] = useState({
    code: engine?.code ?? '',
    name: engine?.name ?? '',
    architecture: (engine?.architecture ?? '') as EngineArchitecture | '',
    v_angle_deg: toText(engine?.v_angle_deg),
    cylinders: toText(engine?.cylinders),
    displacement_cc: toText(engine?.displacement_cc),
    bore_mm: toText(engine?.bore_mm),
    stroke_mm: toText(engine?.stroke_mm),
    valves_per_cylinder: toText(engine?.valves_per_cylinder),
    aspiration: (engine?.aspiration ?? '') as Aspiration | '',
    description_it: engine?.description.it ?? '',
    description_en: engine?.description.en ?? '',
  })

  const errors = validationErrors(save.error)
  const isV = values.architecture === 'V'

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    save.mutate(
      {
        id: engine?.id,
        payload: {
          code: values.code.trim(),
          name: values.name.trim() || null,
          architecture: values.architecture || null,
          // L'angolo esiste solo per i motori a V
          v_angle_deg: isV ? toNumber(values.v_angle_deg) : null,
          cylinders: toNumber(values.cylinders),
          displacement_cc: toNumber(values.displacement_cc),
          bore_mm: toNumber(values.bore_mm),
          stroke_mm: toNumber(values.stroke_mm),
          valves_per_cylinder: toNumber(values.valves_per_cylinder),
          aspiration: values.aspiration || null,
          description: { it: values.description_it, en: values.description_en },
        },
      },
      {
        onSuccess: (result) => {
          if (engine) {
            setSaved(true)
          } else {
            navigate(`/admin/motori/${result.id}`, { replace: true })
          }
        },
      },
    )
  }

  // Il riassunto si aggiorna mentre si compila: "V12 a 65°, 6.496 cm³"
  const cylinders = Number(values.cylinders)
  const preview =
    values.architecture && cylinders > 0
      ? engineSummary({
          architecture: values.architecture,
          cylinders,
          v_angle_deg: isV ? toNumber(values.v_angle_deg) : null,
        }) +
        (Number(values.displacement_cc) > 0
          ? `, ${displacement(Number(values.displacement_cc))}`
          : '')
      : null

  const numberField = (
    field: keyof typeof values,
    label: string,
    decimal = false,
  ) => (
    <AdminField
      label={label}
      type="number"
      inputMode={decimal ? 'decimal' : 'numeric'}
      step={decimal ? '0.01' : '1'}
      min={0}
      value={values[field]}
      onChange={(event) => update(field, event.target.value)}
      error={errors?.[field]?.[0]}
    />
  )

  return (
    <form onSubmit={handleSubmit} noValidate>
      <title>{`${engine?.code ?? 'Nuovo motore'} – Ferrary`}</title>

      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <Link
            to="/admin/motori"
            className="text-xs font-semibold text-neutral-400 transition-colors hover:text-white"
          >
            <span aria-hidden="true">← </span>Motori
          </Link>
          <h1 className="font-display mt-3 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
            {engine?.code ?? 'Nuovo motore'}
          </h1>
          <p
            aria-live="polite"
            className="mt-3 min-h-5 text-sm text-neutral-400"
          >
            {preview}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <p role="status" className="text-sm text-neutral-300">
            {saved && 'Modifiche salvate.'}
          </p>
          <button
            type="submit"
            disabled={save.isPending}
            className={adminButtonClass('primary')}
          >
            {save.isPending
              ? 'Salvataggio…'
              : engine
                ? 'Salva modifiche'
                : 'Crea motore'}
          </button>
        </div>
      </header>

      <div className="mt-7 grid grid-cols-6 gap-4 lg:grid-cols-12">
        <AdminCard
          aria-labelledby="motore-dati"
          className="col-span-6 p-6 lg:col-span-8"
        >
          <h2 id="motore-dati" className={cardTitle}>
            Dati tecnici
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <AdminField
              label="Codice"
              value={values.code}
              placeholder="F140"
              onChange={(event) => update('code', event.target.value)}
              error={errors?.code?.[0]}
            />
            <AdminField
              label="Nome"
              value={values.name}
              placeholder="V12 aspirato"
              onChange={(event) => update('name', event.target.value)}
              hint="Facoltativo: il codice basta a identificarlo."
              error={errors?.name?.[0]}
            />
            <AdminSelect
              label="Architettura"
              value={values.architecture}
              onChange={(event) => update('architecture', event.target.value)}
              error={errors?.architecture?.[0]}
            >
              <option value="">Scegli un'architettura</option>
              {architectures.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdminSelect>
            <AdminField
              label="Angolo della V (°)"
              type="number"
              inputMode="numeric"
              min={1}
              max={180}
              value={isV ? values.v_angle_deg : ''}
              disabled={!isV}
              onChange={(event) => update('v_angle_deg', event.target.value)}
              hint={isV ? undefined : 'Solo per i motori a V.'}
              error={errors?.v_angle_deg?.[0]}
            />
            {numberField('cylinders', 'Cilindri')}
            {numberField('displacement_cc', 'Cilindrata (cm³)')}
            {numberField('bore_mm', 'Alesaggio (mm)', true)}
            {numberField('stroke_mm', 'Corsa (mm)', true)}
            {numberField('valves_per_cylinder', 'Valvole per cilindro')}
            <AdminSelect
              label="Aspirazione"
              value={values.aspiration}
              onChange={(event) => update('aspiration', event.target.value)}
              error={errors?.aspiration?.[0]}
            >
              <option value="">Scegli un'aspirazione</option>
              {aspirations.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdminSelect>
          </div>
        </AdminCard>

        {engine && (
          <AdminCard
            aria-labelledby="motore-elimina"
            delay={60}
            className="col-span-6 self-start p-6 lg:col-span-4"
          >
            <h2 id="motore-elimina" className={cardTitle}>
              Utilizzo
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {engine.versions_count
                ? `Lo usano ${engine.versions_count} ${engine.versions_count === 1 ? 'versione' : 'versioni'}.`
                : 'Nessuna versione lo usa.'}
            </p>

            {confirming ? (
              <div
                role="alertdialog"
                aria-labelledby="motore-domanda"
                className="mt-5 flex flex-col gap-3"
              >
                <p id="motore-domanda" className="text-sm text-neutral-200">
                  Eliminare il motore {engine.code}?
                </p>
                <div className="flex gap-2.5">
                  <AdminButton
                    disabled={remove.isPending}
                    onClick={() =>
                      remove.mutate(engine.id, {
                        onSuccess: () =>
                          navigate('/admin/motori', { replace: true }),
                      })
                    }
                  >
                    Sì, elimina
                  </AdminButton>
                  <AdminButton
                    variant="outline"
                    onClick={() => setConfirming(false)}
                  >
                    Annulla
                  </AdminButton>
                </div>
              </div>
            ) : (
              <AdminButton
                variant="outline"
                onClick={() => {
                  remove.reset()
                  setConfirming(true)
                }}
                className="mt-5"
              >
                Elimina motore
              </AdminButton>
            )}

            {remove.isError && (
              <p role="alert" className="text-errore mt-4 text-[0.8125rem]">
                {backendMessage(remove.error) ??
                  'Impossibile eliminare il motore. Riprova.'}
              </p>
            )}
          </AdminCard>
        )}

        <AdminCard
          aria-labelledby="motore-descrizione"
          delay={120}
          className="col-span-6 p-6 lg:col-span-8"
        >
          <h2 id="motore-descrizione" className={cardTitle}>
            Descrizione
          </h2>
          <div className="mt-5 flex flex-col gap-5">
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

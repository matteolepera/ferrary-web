import {
  aspirations,
  architectures,
  displacement,
  engineSummary,
} from '@/components/admin/engines/options'
import type {
  EngineFieldsProps,
  EngineValues,
} from '@/components/admin/engines/engineValues'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea'

/** I campi numerici: l'unità sta dentro il campo, l'etichetta resta corta */
const numbers: {
  field: keyof EngineValues
  label: string
  unit?: string
  decimal?: boolean
  required?: boolean
}[] = [
  { field: 'cylinders', label: 'Cilindri', required: true },
  {
    field: 'displacement_cc',
    label: 'Cilindrata',
    unit: 'cm³',
    required: true,
  },
  { field: 'bore_mm', label: 'Alesaggio', unit: 'mm', decimal: true },
  { field: 'stroke_mm', label: 'Corsa', unit: 'mm', decimal: true },
  { field: 'valves_per_cylinder', label: 'Valvole per cilindro' },
]

/** Il motore in poche parole mentre si compila: "V12 a 65°, 6496 cm³" */
function preview(values: EngineValues) {
  const cylinders = Number(values.cylinders)
  if (!values.architecture || cylinders <= 0) return null

  const isV = values.architecture === 'V'
  const angle = Number(values.v_angle_deg)
  const cc = Number(values.displacement_cc)

  return (
    engineSummary({
      architecture: values.architecture,
      cylinders,
      v_angle_deg: isV && angle > 0 ? angle : null,
    }) + (cc > 0 ? `, ${displacement(cc)}` : '')
  )
}

/**
 * I dati tecnici del motore. In cima, il motore in poche parole, che si aggiorna mentre si compila;
 * l'angolo si compila solo per i motori a V.
 */
export function EngineTechFields({
  values,
  onChange,
  errors,
}: EngineFieldsProps) {
  const isV = values.architecture === 'V'
  const summary = preview(values)

  return (
    <div className="flex flex-col gap-5">
      {/* Annunciato senza interrompere: chi usa il lettore di schermo sente il risultato */}
      <p aria-live="polite" className="min-h-5 text-sm text-neutral-400">
        {summary ??
          'Scegli architettura e cilindri per vedere il motore in breve.'}
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField
          label="Codice"
          required
          value={values.code}
          placeholder="F140"
          onChange={(event) => onChange('code', event.target.value)}
          error={errors?.code?.[0]}
        />
        <AdminField
          label="Nome"
          optional
          value={values.name}
          placeholder="V12 aspirato"
          onChange={(event) => onChange('name', event.target.value)}
          hint="Il codice basta a identificarlo."
          error={errors?.name?.[0]}
        />
        <AdminSelect
          label="Architettura"
          required
          value={values.architecture}
          onChange={(event) =>
            onChange(
              'architecture',
              event.target.value as EngineValues['architecture'],
            )
          }
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
          label="Angolo della V"
          unit="°"
          type="number"
          inputMode="numeric"
          min={1}
          max={180}
          value={isV ? values.v_angle_deg : ''}
          disabled={!isV}
          onChange={(event) => onChange('v_angle_deg', event.target.value)}
          hint={isV ? undefined : 'Solo per i motori a V.'}
          error={errors?.v_angle_deg?.[0]}
        />
        {numbers.map(({ field, label, unit, decimal, required }) => (
          <AdminField
            key={field}
            label={label}
            unit={unit}
            required={required}
            type="number"
            inputMode={decimal ? 'decimal' : 'numeric'}
            step={decimal ? '0.01' : '1'}
            min={0}
            value={values[field]}
            onChange={(event) => onChange(field, event.target.value)}
            error={errors?.[field]?.[0]}
          />
        ))}
        <AdminSelect
          label="Aspirazione"
          required
          value={values.aspiration}
          onChange={(event) =>
            onChange(
              'aspiration',
              event.target.value as EngineValues['aspiration'],
            )
          }
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
    </div>
  )
}

/** La descrizione del motore: facoltativa in entrambe le lingue */
export function EngineDescriptionFields({
  values,
  onChange,
  errors,
}: EngineFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <AdminTextarea
        label="In italiano"
        optional
        value={values.description_it}
        onChange={(event) => onChange('description_it', event.target.value)}
        error={errors?.['description.it']?.[0]}
      />
      <AdminTextarea
        label="In inglese"
        optional
        value={values.description_en}
        onChange={(event) => onChange('description_en', event.target.value)}
        error={errors?.['description.en']?.[0]}
      />
    </div>
  )
}

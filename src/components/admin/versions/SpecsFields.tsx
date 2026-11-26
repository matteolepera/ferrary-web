import { useId } from 'react'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import {
  brakeTypes,
  chassisMaterials,
} from '@/components/admin/versions/options'
import type { SpecsField, SpecsValues } from '@/components/admin/versions/specs'
import { formatLap } from '@/lib/format'

type SpecsFieldsProps = {
  values: SpecsValues
  onChange: (field: SpecsField, value: string) => void
  /** Gli errori del backend, con le chiavi complete come "specs.length_mm" */
  errors: Record<string, string[]> | null
}

/** I campi numerici: l'unità sta dentro il campo, l'etichetta resta corta */
const numberFields: Record<
  string,
  { label: string; unit?: string; decimal?: boolean; max?: number }
> = {
  length_mm: { label: 'Lunghezza', unit: 'mm' },
  width_mm: { label: 'Larghezza', unit: 'mm' },
  height_mm: { label: 'Altezza', unit: 'mm' },
  wheelbase_mm: { label: 'Passo', unit: 'mm' },
  dry_weight_kg: { label: 'Peso a secco', unit: 'kg' },
  weight_front_pct: { label: 'Peso all’anteriore', unit: '%', max: 100 },
  top_speed_kmh: { label: 'Velocità massima', unit: 'km/h' },
  zero_to_100_sec: { label: '0-100 km/h', unit: 's', decimal: true },
  zero_to_200_sec: { label: '0-200 km/h', unit: 's', decimal: true },
  fiorano_lap_sec: { label: 'Giro di Fiorano', unit: 's', decimal: true },
}

const subtitle =
  'mb-4 text-[0.6875rem] font-semibold tracking-[0.2em] text-rosso-acceso uppercase'

/**
 * I campi della scheda tecnica, senza la card intorno: così entrano in una finestra.
 * Dimensioni, telaio e prestazioni una sotto l'altra, ognuna su due colonne.
 */
export function SpecsFields({ values, onChange, errors }: SpecsFieldsProps) {
  // Id unici per i sottotitoli: i campi potrebbero comparire in più punti della pagina
  const id = useId()

  function numberField(field: SpecsField, hint?: string) {
    const { label, unit, decimal, max } = numberFields[field]

    return (
      <AdminField
        key={field}
        label={label}
        unit={unit}
        type="number"
        inputMode={decimal ? 'decimal' : 'numeric'}
        step={decimal ? '0.01' : '1'}
        min={0}
        max={max}
        value={values[field]}
        onChange={(event) => onChange(field, event.target.value)}
        hint={hint}
        error={errors?.[`specs.${field}`]?.[0]}
      />
    )
  }

  // Il tempo sul giro come lo si legge: 79 secondi diventano "1:19"
  const lap = Number(values.fiorano_lap_sec)
  const lapHint =
    values.fiorano_lap_sec.trim() !== '' && lap > 0
      ? `Si legge ${formatLap(lap, 'it')}.`
      : undefined

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby={`${id}-dimensioni`}>
        <h3 id={`${id}-dimensioni`} className={subtitle}>
          Dimensioni e peso
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              'length_mm',
              'width_mm',
              'height_mm',
              'wheelbase_mm',
              'dry_weight_kg',
              'weight_front_pct',
            ] as const
          ).map((field) => numberField(field))}
        </div>
      </section>

      <section aria-labelledby={`${id}-telaio`}>
        <h3 id={`${id}-telaio`} className={subtitle}>
          Telaio e freni
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminSelect
            label="Materiale del telaio"
            value={values.chassis_material}
            onChange={(event) =>
              onChange('chassis_material', event.target.value)
            }
            error={errors?.['specs.chassis_material']?.[0]}
          >
            <option value="">Non indicato</option>
            {chassisMaterials.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </AdminSelect>
          <AdminSelect
            label="Freni"
            value={values.brakes}
            onChange={(event) => onChange('brakes', event.target.value)}
            error={errors?.['specs.brakes']?.[0]}
          >
            <option value="">Non indicati</option>
            {brakeTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </AdminSelect>
        </div>
      </section>

      <section aria-labelledby={`${id}-prestazioni`}>
        <h3 id={`${id}-prestazioni`} className={subtitle}>
          Prestazioni
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {numberField('top_speed_kmh')}
          {numberField('zero_to_100_sec')}
          {numberField('zero_to_200_sec', 'Deve essere maggiore dello 0-100.')}
          {numberField('fiorano_lap_sec', lapHint)}
        </div>
      </section>
    </div>
  )
}

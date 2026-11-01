import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import {
  brakeTypes,
  chassisMaterials,
} from '@/components/admin/versions/options'
import type { SpecsField, SpecsValues } from '@/components/admin/versions/specs'
import { formatLap } from '@/lib/format'

type SpecsCardProps = {
  values: SpecsValues
  onChange: (field: SpecsField, value: string) => void
  errors: Record<string, string[]> | null
  delay?: number
}

/** I campi numerici, con l'unità nell'etichetta */
const numberFields: Record<
  string,
  { label: string; decimal?: boolean; max?: number }
> = {
  length_mm: { label: 'Lunghezza (mm)' },
  width_mm: { label: 'Larghezza (mm)' },
  height_mm: { label: 'Altezza (mm)' },
  wheelbase_mm: { label: 'Passo (mm)' },
  dry_weight_kg: { label: 'Peso a secco (kg)' },
  weight_front_pct: { label: 'Peso all’anteriore (%)', max: 100 },
  top_speed_kmh: { label: 'Velocità massima (km/h)' },
  zero_to_100_sec: { label: '0-100 km/h (s)', decimal: true },
  zero_to_200_sec: { label: '0-200 km/h (s)', decimal: true },
  fiorano_lap_sec: { label: 'Giro di Fiorano (s)', decimal: true },
}

const subtitle =
  'mb-4 text-[0.6875rem] font-semibold tracking-[0.2em] text-rosso-acceso uppercase'

/**
 * La scheda tecnica della versione: dimensioni, telaio e prestazioni.
 */
export function SpecsCard({ values, onChange, errors, delay }: SpecsCardProps) {
  function numberField(field: SpecsField, hint?: string) {
    const { label, decimal, max } = numberFields[field]

    return (
      <AdminField
        key={field}
        label={label}
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
    <AdminCard
      aria-labelledby="versione-scheda"
      delay={delay}
      className="col-span-6 p-6 lg:col-span-12"
    >
      <h2
        id="versione-scheda"
        className="font-display text-xl font-extrabold tracking-[-0.03em]"
      >
        Scheda tecnica
      </h2>

      <div className="mt-6 grid gap-8 xl:grid-cols-3">
        <section aria-labelledby="scheda-dimensioni">
          <h3 id="scheda-dimensioni" className={subtitle}>
            Dimensioni e peso
          </h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
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

        <section aria-labelledby="scheda-telaio">
          <h3 id="scheda-telaio" className={subtitle}>
            Telaio e freni
          </h3>
          <div className="flex flex-col gap-4">
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

        <section aria-labelledby="scheda-prestazioni">
          <h3 id="scheda-prestazioni" className={subtitle}>
            Prestazioni
          </h3>
          <div className="flex flex-col gap-4">
            {numberField('top_speed_kmh')}
            {numberField('zero_to_100_sec')}
            {numberField(
              'zero_to_200_sec',
              'Deve essere maggiore dello 0-100.',
            )}
            {numberField('fiorano_lap_sec', lapHint)}
          </div>
        </section>
      </div>
    </AdminCard>
  )
}

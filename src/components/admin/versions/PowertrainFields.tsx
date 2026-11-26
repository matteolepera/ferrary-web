import { useId } from 'react'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { drivetrains, gearboxTypes } from '@/components/admin/versions/options'
import {
  isFieldDisabled,
  powertrainKind,
  type PowertrainField,
  type PowertrainValues,
} from '@/components/admin/versions/powertrain'
import { useAdminEngines } from '@/hooks/useAdminEngines'

type PowertrainFieldsProps = {
  values: PowertrainValues
  onChange: (field: PowertrainField, value: string) => void
  /** Gli errori del backend, con le chiavi complete come "powertrain.engine_id" */
  errors: Record<string, string[]> | null
}

/** I campi numerici: l'unità sta dentro il campo, l'etichetta resta corta */
const numberFields: Record<
  string,
  { label: string; unit?: string; decimal?: boolean }
> = {
  ice_power_cv: { label: 'Potenza', unit: 'CV' },
  ice_torque_nm: { label: 'Coppia', unit: 'Nm' },
  ice_max_rpm: { label: 'Regime massimo', unit: 'giri/min' },
  fuel_consumption_l100: { label: 'Consumo', unit: 'l/100 km', decimal: true },
  electric_power_cv: { label: 'Potenza elettrica', unit: 'CV' },
  electric_motors_count: { label: 'Motori elettrici' },
  battery_kwh: { label: 'Batteria', unit: 'kWh', decimal: true },
  electric_range_km: { label: 'Autonomia elettrica', unit: 'km' },
  system_power_cv: { label: 'Potenza complessiva', unit: 'CV' },
  system_torque_nm: { label: 'Coppia complessiva', unit: 'Nm' },
  gears: { label: 'Marce' },
}

const subtitle =
  'mb-4 text-[0.6875rem] font-semibold tracking-[0.2em] text-rosso-acceso uppercase'

/**
 * I campi della motorizzazione, senza la card intorno: così entrano in una finestra.
 * Termica, elettrica e complessiva una sotto l'altra, ognuna su due colonne.
 * I campi che non hanno senso con le scelte attuali si disattivano, e il tipo si aggiorna mentre si compila.
 */
export function PowertrainFields({
  values,
  onChange,
  errors,
}: PowertrainFieldsProps) {
  const { data: engines } = useAdminEngines()
  const kind = powertrainKind(values)
  // Id unici per i sottotitoli: i campi potrebbero comparire in più punti della pagina
  const id = useId()

  function numberField(field: PowertrainField) {
    const { label, unit, decimal } = numberFields[field]
    const disabled = isFieldDisabled(field, values)

    return (
      <AdminField
        key={field}
        label={label}
        unit={unit}
        type="number"
        inputMode={decimal ? 'decimal' : 'numeric'}
        step={decimal ? '0.1' : '1'}
        min={0}
        value={disabled ? '' : values[field]}
        disabled={disabled}
        onChange={(event) => onChange(field, event.target.value)}
        error={errors?.[`powertrain.${field}`]?.[0]}
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Il tipo cambia mentre si compila: annunciato senza interrompere */}
      <p aria-live="polite" className="text-sm text-neutral-400">
        {kind ? (
          <>
            Tipo: <strong className="font-semibold text-white">{kind}</strong>
          </>
        ) : (
          'Nessuna motorizzazione indicata'
        )}
      </p>

      <section aria-labelledby={`${id}-termica`}>
        <h3 id={`${id}-termica`} className={subtitle}>
          Termica
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Il motore apre la sezione su tutta la riga: dalla sua scelta dipendono gli altri campi */}
          <AdminSelect
            label="Motore"
            value={values.engine_id}
            onChange={(event) => onChange('engine_id', event.target.value)}
            hint={
              values.engine_id
                ? undefined
                : 'Senza motore, i dati termici non si compilano.'
            }
            error={errors?.['powertrain.engine_id']?.[0]}
            className="sm:col-span-2"
          >
            <option value="">Nessun motore termico</option>
            {engines?.map((engine) => (
              <option key={engine.id} value={engine.id}>
                {engine.name ? `${engine.code} · ${engine.name}` : engine.code}
              </option>
            ))}
          </AdminSelect>
          {(
            [
              'ice_power_cv',
              'ice_torque_nm',
              'ice_max_rpm',
              'fuel_consumption_l100',
            ] as const
          ).map(numberField)}
        </div>
      </section>

      <section aria-labelledby={`${id}-elettrica`}>
        <h3 id={`${id}-elettrica`} className={subtitle}>
          Elettrica
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              'electric_power_cv',
              'electric_motors_count',
              'battery_kwh',
              'electric_range_km',
            ] as const
          ).map(numberField)}
        </div>
      </section>

      <section aria-labelledby={`${id}-complessiva`}>
        <h3 id={`${id}-complessiva`} className={subtitle}>
          Complessiva
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['system_power_cv', 'system_torque_nm'] as const).map(numberField)}
          <AdminSelect
            label="Cambio"
            value={values.gearbox_type}
            onChange={(event) => onChange('gearbox_type', event.target.value)}
            error={errors?.['powertrain.gearbox_type']?.[0]}
          >
            <option value="">Non indicato</option>
            {gearboxTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </AdminSelect>
          {numberField('gears')}
          <AdminSelect
            label="Trazione"
            value={values.drivetrain}
            onChange={(event) => onChange('drivetrain', event.target.value)}
            error={errors?.['powertrain.drivetrain']?.[0]}
          >
            <option value="">Non indicata</option>
            {drivetrains.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </AdminSelect>
        </div>
      </section>
    </div>
  )
}

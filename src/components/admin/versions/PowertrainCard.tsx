import { AdminCard } from '@/components/admin/ui/AdminCard'
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

type PowertrainCardProps = {
  values: PowertrainValues
  onChange: (field: PowertrainField, value: string) => void
  /** Gli errori del backend, con le chiavi complete come "powertrain.engine_id" */
  errors: Record<string, string[]> | null
  delay?: number
}

/** I campi numerici, con l'unità nell'etichetta */
const numberFields: Record<string, { label: string; decimal?: boolean }> = {
  ice_power_cv: { label: 'Potenza (CV)' },
  ice_torque_nm: { label: 'Coppia (Nm)' },
  ice_max_rpm: { label: 'Regime massimo (giri/min)' },
  fuel_consumption_l100: { label: 'Consumo (l/100 km)', decimal: true },
  electric_power_cv: { label: 'Potenza elettrica (CV)' },
  electric_motors_count: { label: 'Motori elettrici' },
  battery_kwh: { label: 'Batteria (kWh)', decimal: true },
  electric_range_km: { label: 'Autonomia elettrica (km)' },
  system_power_cv: { label: 'Potenza complessiva (CV)' },
  system_torque_nm: { label: 'Coppia complessiva (Nm)' },
  gears: { label: 'Marce' },
}

const subtitle =
  'mb-4 text-[0.6875rem] font-semibold tracking-[0.2em] text-rosso-acceso uppercase'

/**
 * La motorizzazione: termica, elettrica e complessiva. I campi che non hanno senso
 * con le scelte attuali si disattivano, e il tipo si aggiorna mentre si compila.
 */
export function PowertrainCard({
  values,
  onChange,
  errors,
  delay,
}: PowertrainCardProps) {
  const { data: engines } = useAdminEngines()
  const kind = powertrainKind(values)

  function numberField(field: PowertrainField) {
    const { label, decimal } = numberFields[field]
    const disabled = isFieldDisabled(field, values)

    return (
      <AdminField
        key={field}
        label={label}
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
    <AdminCard
      aria-labelledby="versione-motorizzazione"
      delay={delay}
      className="col-span-6 p-6 lg:col-span-12"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="versione-motorizzazione"
          className="font-display text-xl font-extrabold tracking-[-0.03em]"
        >
          Motorizzazione
        </h2>
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
      </div>

      <div className="mt-6 grid gap-8 xl:grid-cols-3">
        <section aria-labelledby="motorizzazione-termica">
          <h3 id="motorizzazione-termica" className={subtitle}>
            Termica
          </h3>
          <div className="flex flex-col gap-4">
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
            >
              <option value="">Nessun motore termico</option>
              {engines?.map((engine) => (
                <option key={engine.id} value={engine.id}>
                  {engine.name
                    ? `${engine.code} · ${engine.name}`
                    : engine.code}
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

        <section aria-labelledby="motorizzazione-elettrica">
          <h3 id="motorizzazione-elettrica" className={subtitle}>
            Elettrica
          </h3>
          <div className="flex flex-col gap-4">
            {numberField('electric_power_cv')}
            {(
              [
                'electric_motors_count',
                'battery_kwh',
                'electric_range_km',
              ] as const
            ).map(numberField)}
          </div>
        </section>

        <section aria-labelledby="motorizzazione-complessiva">
          <h3 id="motorizzazione-complessiva" className={subtitle}>
            Complessiva
          </h3>
          <div className="flex flex-col gap-4">
            {(['system_power_cv', 'system_torque_nm'] as const).map(
              numberField,
            )}
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
    </AdminCard>
  )
}

import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { AdminSwitch } from '@/components/admin/ui/AdminSwitch'
import { productionTypes } from '@/components/admin/versions/options'
import type {
  VersionFieldsProps,
  VersionValues,
} from '@/components/admin/versions/versionValues'

/**
 * I campi di anni e produzione: gli anni con l'interruttore "in produzione" subito sotto,
 * poi quante ne sono state fatte e la posizione tra le versioni.
 */
export function ProductionFields({
  values,
  onChange,
  errors,
}: VersionFieldsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <AdminField
        label="Anno di inizio"
        required
        type="number"
        inputMode="numeric"
        min={1947}
        value={values.year_start}
        onChange={(event) => onChange('year_start', event.target.value)}
        error={errors?.year_start?.[0]}
      />
      <AdminField
        label="Anno di fine"
        type="number"
        inputMode="numeric"
        min={1947}
        value={values.in_production ? '' : values.year_end}
        disabled={values.in_production}
        onChange={(event) => onChange('year_end', event.target.value)}
        hint={
          values.in_production
            ? 'In produzione: nessun anno di fine.'
            : undefined
        }
        error={errors?.year_end?.[0]}
      />
      {/* L'interruttore su tutta la riga, sotto gli anni: è lui che spegne l'anno di fine */}
      <AdminSwitch
        label="In produzione"
        hint="Ancora costruita oggi."
        checked={values.in_production}
        onChange={(event) => onChange('in_production', event.target.checked)}
        className="sm:col-span-2"
      />
      <AdminSelect
        label="Tipo di produzione"
        value={values.production_type}
        onChange={(event) =>
          onChange(
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
        onChange={(event) => onChange('units_produced', event.target.value)}
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
        onChange={(event) => onChange('sort_order', event.target.value)}
        hint="L'ordine tra le versioni del modello."
        error={errors?.sort_order?.[0]}
      />
    </div>
  )
}

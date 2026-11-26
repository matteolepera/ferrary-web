import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { bodyTypes, vehicleTypes } from '@/components/admin/versions/options'
import type {
  VersionFieldsProps,
  VersionValues,
} from '@/components/admin/versions/versionValues'
import { slugify } from '@/lib/slugify'

/**
 * I campi dell'identità: nome, indirizzo, tipo, carrozzeria, codice e posti.
 * Senza la card intorno: stanno nella pagina come in una finestra.
 */
export function IdentityFields({
  values,
  onChange,
  errors,
}: VersionFieldsProps) {
  const isF1 = values.vehicle_type === 'f1'

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <AdminField
        label="Nome"
        required
        value={values.name}
        onChange={(event) => onChange('name', event.target.value)}
        error={errors?.name?.[0]}
      />
      <AdminField
        label="Slug"
        optional
        value={values.slug}
        placeholder={slugify(values.name)}
        onChange={(event) => onChange('slug', event.target.value)}
        hint="Vuoto: lo generiamo dal nome."
        error={errors?.slug?.[0]}
      />
      <AdminSelect
        label="Tipo di veicolo"
        required
        value={values.vehicle_type}
        onChange={(event) => {
          const vehicleType = event.target
            .value as VersionValues['vehicle_type']
          onChange('vehicle_type', vehicleType)
          // Una Formula 1 è sempre una monoposto
          if (vehicleType === 'f1') onChange('body_type', 'monoposto')
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
          onChange(
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
        onChange={(event) => onChange('project_code', event.target.value)}
        error={errors?.project_code?.[0]}
      />
      <AdminField
        label="Posti"
        type="number"
        inputMode="numeric"
        min={1}
        max={9}
        value={values.seats}
        onChange={(event) => onChange('seats', event.target.value)}
        error={errors?.seats?.[0]}
      />
    </div>
  )
}

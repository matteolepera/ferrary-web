import type { VersionPayload, VersionSpecs } from '@/types/admin'

/** Tutti i campi della scheda tecnica, nell'ordine del backend */
const FIELDS = [
  'length_mm',
  'width_mm',
  'height_mm',
  'wheelbase_mm',
  'dry_weight_kg',
  'weight_front_pct',
  'chassis_material',
  'brakes',
  'top_speed_kmh',
  'zero_to_100_sec',
  'zero_to_200_sec',
  'fiorano_lap_sec',
] as const

export type SpecsField = (typeof FIELDS)[number]

export type SpecsValues = Record<SpecsField, string>

/** I campi che sono testo e non numeri */
const TEXT: readonly SpecsField[] = ['chassis_material', 'brakes']

/** Dalla scheda tecnica salvata ai valori del form */
export function specsValues(specs?: VersionSpecs | null): SpecsValues {
  return Object.fromEntries(
    FIELDS.map((field) => {
      const value = specs?.[field]
      return [field, value === null || value === undefined ? '' : String(value)]
    }),
  ) as SpecsValues
}

/** Dai valori del form al backend: se è tutto vuoto, la scheda tecnica non c'è */
export function toSpecsPayload(values: SpecsValues): VersionPayload['specs'] {
  const payload = Object.fromEntries(
    FIELDS.map((field) => {
      const raw = values[field].trim()

      if (raw === '') return [field, null]

      return [field, TEXT.includes(field) ? raw : Number(raw)]
    }),
  )

  return Object.values(payload).every((value) => value === null)
    ? null
    : payload
}

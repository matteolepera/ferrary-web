import type { VersionPayload, VersionPowertrain } from '@/types/admin'

/** Tutti i campi modificabili della motorizzazione, nell'ordine del backend */
const FIELDS = [
  'engine_id',
  'ice_power_cv',
  'ice_torque_nm',
  'ice_max_rpm',
  'fuel_consumption_l100',
  'electric_power_cv',
  'electric_motors_count',
  'battery_kwh',
  'electric_range_km',
  'system_power_cv',
  'system_torque_nm',
  'gearbox_type',
  'gears',
  'drivetrain',
] as const

export type PowertrainField = (typeof FIELDS)[number]

/** I valori nel form: tutto come testo, il vuoto vuol dire "non indicato" */
export type PowertrainValues = Record<PowertrainField, string>

/** I campi che hanno senso solo con un motore termico */
const THERMAL: readonly PowertrainField[] = [
  'ice_power_cv',
  'ice_torque_nm',
  'ice_max_rpm',
  'fuel_consumption_l100',
]

/** I campi che hanno senso solo con una parte elettrica */
const ELECTRIC: readonly PowertrainField[] = [
  'electric_motors_count',
  'battery_kwh',
  'electric_range_km',
]

/** I campi che sono testo e non numeri */
const TEXT: readonly PowertrainField[] = ['gearbox_type', 'drivetrain']

/** Dalla motorizzazione salvata ai valori del form */
export function powertrainValues(
  powertrain?: VersionPowertrain | null,
): PowertrainValues {
  return Object.fromEntries(
    FIELDS.map((field) => {
      const value = powertrain?.[field]
      return [field, value === null || value === undefined ? '' : String(value)]
    }),
  ) as PowertrainValues
}

export const hasEngine = (values: PowertrainValues) => values.engine_id !== ''
export const hasElectric = (values: PowertrainValues) =>
  values.electric_power_cv.trim() !== ''

/** Il tipo, come lo calcolerà il database: serve a mostrarlo mentre si compila */
export function powertrainKind(values: PowertrainValues) {
  if (hasEngine(values) && hasElectric(values)) return 'Ibrido'
  if (hasEngine(values)) return 'Termico'
  if (hasElectric(values)) return 'Elettrico'
  return null
}

/** Un campo che, con le scelte attuali, non ha senso compilare */
export function isFieldDisabled(
  field: PowertrainField,
  values: PowertrainValues,
) {
  return (
    (THERMAL.includes(field) && !hasEngine(values)) ||
    (ELECTRIC.includes(field) && !hasElectric(values))
  )
}

/**
 * Dai valori del form a quello che il backend si aspetta:
 * i campi disattivati diventano vuoti, e se è tutto vuoto la motorizzazione non c'è.
 */
export function toPowertrainPayload(
  values: PowertrainValues,
): VersionPayload['powertrain'] {
  const payload = Object.fromEntries(
    FIELDS.map((field) => {
      const raw = values[field].trim()

      if (raw === '' || isFieldDisabled(field, values)) return [field, null]

      return [field, TEXT.includes(field) ? raw : Number(raw)]
    }),
  )

  return Object.values(payload).every((value) => value === null)
    ? null
    : payload
}

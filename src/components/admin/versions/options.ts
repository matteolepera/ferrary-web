import type {
  BodyType,
  BrakeType,
  ChassisMaterial,
  Drivetrain,
  GearboxType,
  ProductionType,
  VehicleType,
  AdminVersion,
} from '@/types/admin'

/** Un valore con la sua etichetta, per i menu a tendina */
export type Option<T extends string> = { value: T; label: string }

export const vehicleTypes: Option<VehicleType>[] = [
  { value: 'stradale', label: 'Stradale' },
  { value: 'pista', label: 'Pista' },
  { value: 'gt_corsa', label: 'GT da corsa' },
  { value: 'prototipo', label: 'Prototipo' },
  { value: 'f1', label: 'Formula 1' },
  { value: 'concept', label: 'Concept' },
]

export const bodyTypes: Option<BodyType>[] = [
  { value: 'coupe', label: 'Coupé' },
  { value: 'spider', label: 'Spider' },
  { value: 'targa', label: 'Targa' },
  { value: 'barchetta', label: 'Barchetta' },
  { value: 'suv', label: 'SUV' },
  { value: 'monoposto', label: 'Monoposto' },
]

export const productionTypes: Option<ProductionType>[] = [
  { value: 'serie', label: 'Di serie' },
  { value: 'serie_limitata', label: 'Serie limitata' },
  { value: 'one_off', label: 'One-off' },
]

export const chassisMaterials: Option<ChassisMaterial>[] = [
  { value: 'acciaio', label: 'Acciaio' },
  { value: 'alluminio', label: 'Alluminio' },
  { value: 'fibra_di_carbonio', label: 'Fibra di carbonio' },
  { value: 'misto', label: 'Misto' },
]

export const brakeTypes: Option<BrakeType>[] = [
  { value: 'tamburo', label: 'A tamburo' },
  { value: 'disco_acciaio', label: 'A disco in acciaio' },
  { value: 'carboceramici', label: 'Carboceramici' },
]

export const gearboxTypes: Option<GearboxType>[] = [
  { value: 'manuale', label: 'Manuale' },
  { value: 'automatico', label: 'Automatico' },
  { value: 'doppia_frizione', label: 'Doppia frizione' },
  { value: 'robotizzato', label: 'Robotizzato' },
  { value: 'sequenziale', label: 'Sequenziale' },
]

export const drivetrains: Option<Drivetrain>[] = [
  { value: 'posteriore', label: 'Posteriore' },
  { value: 'integrale', label: 'Integrale' },
]

/** L'etichetta di un valore, o il codice stesso se non la conosciamo */
export function labelOf<T extends string>(
  options: Option<T>[],
  value: T | null | undefined,
) {
  return options.find((option) => option.value === value)?.label ?? value ?? '—'
}

/** Gli anni di una versione: "2019 – oggi", "2013 – 2017", oppure un anno solo */
export function yearsOf(
  version: Pick<AdminVersion, 'year_start' | 'year_end' | 'in_production'>,
) {
  if (version.in_production) return `${version.year_start} – oggi`
  if (version.year_end && version.year_end !== version.year_start)
    return `${version.year_start} – ${version.year_end}`

  return String(version.year_start)
}

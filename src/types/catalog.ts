// Valori a scelta fissa: gli stessi degli enum PHP del backend
export type VehicleType =
  'stradale' | 'pista' | 'gt_corsa' | 'prototipo' | 'f1' | 'concept'
export type BodyType =
  'coupe' | 'spider' | 'targa' | 'barchetta' | 'suv' | 'monoposto'
export type ProductionType = 'serie' | 'serie_limitata' | 'one_off'
export type PowertrainType = 'termico' | 'ibrido' | 'elettrico'
export type GearboxType =
  'manuale' | 'robotizzato' | 'doppia_frizione' | 'sequenziale' | 'automatico'
export type Drivetrain = 'posteriore' | 'integrale'
export type ChassisMaterial =
  'acciaio' | 'alluminio' | 'fibra_di_carbonio' | 'misto'
export type BrakeType = 'tamburo' | 'disco_acciaio' | 'carboceramici'
export type EngineArchitecture = 'V' | 'piatto' | 'in_linea'
export type Aspiration = 'aspirato' | 'turbo' | 'compressore'
export type DesignerType = 'studio' | 'persona'
export type DesignerRole = 'design' | 'carrozzeria'

export type Category = {
  id: number
  name: string
  slug: string
  /** Numero di modelli visibili, solo nell'elenco delle famiglie */
  models_count?: number
}

export type Image = {
  id: number
  url: string
  alt_text: string
  is_cover: boolean
  sort_order: number
}

export type Engine = {
  id: number
  code: string
  name: string | null
  architecture: EngineArchitecture
  v_angle_deg: number | null
  cylinders: number
  displacement_cc: number
  bore_mm: number | null
  stroke_mm: number | null
  valves_per_cylinder: number | null
  aspiration: Aspiration
  description: string | null
  versions?: Version[]
  versions_count?: number
}

export type Designer = {
  id: number
  name: string
  slug: string
  type: DesignerType
  country: string | null
  /** Presente solo quando il designer arriva da una versione */
  role?: DesignerRole
  versions?: Version[]
  versions_count?: number
}

export type Driver = {
  id: number
  first_name: string
  last_name: string
  slug: string
  nationality: string | null
  /** Formato AAAA-MM-GG */
  birth_date: string | null
  versions?: Version[]
  versions_count?: number
}

export type VersionSpecs = {
  dimensions: {
    length_mm: number | null
    width_mm: number | null
    height_mm: number | null
    wheelbase_mm: number | null
  }
  weight: {
    dry_kg: number | null
    front_distribution_pct: number | null
  }
  chassis: {
    material: ChassisMaterial | null
    brakes: BrakeType | null
  }
  performance: {
    top_speed_kmh: number | null
    zero_to_100_sec: number | null
    zero_to_200_sec: number | null
    fiorano_lap_sec: number | null
  }
}

export type Powertrain = {
  type: PowertrainType
  engine?: Engine | null
  /** null se la versione non ha un motore termico */
  combustion: {
    power_cv: number | null
    torque_nm: number | null
    max_rpm: number | null
    fuel_consumption_l100: number | null
  } | null
  /** null se la versione non ha una parte elettrica */
  electric: {
    motors_count: number | null
    power_cv: number | null
    battery_kwh: number | null
    range_km: number | null
  } | null
  system: {
    power_cv: number | null
    torque_nm: number | null
  }
  transmission: {
    gearbox_type: GearboxType | null
    gears: number | null
    drivetrain: Drivetrain | null
  }
}

export type RacingRecord = {
  championship: string
  season_start: number
  season_end: number | null
  races: number | null
  wins: number | null
  poles: number | null
  podiums: number | null
  fastest_laps: number | null
  drivers_titles: number | null
  constructors_titles: number | null
  notes: string | null
}

export type Version = {
  id: number
  name: string
  slug: string
  vehicle_type: VehicleType
  body_type: BodyType | null
  project_code: string | null
  seats: number | null
  years: {
    start: number
    end: number | null
    in_production: boolean
  }
  production: {
    type: ProductionType | null
    units: number | null
  }
  description: string | null
  model?: CarModel
  cover?: Image | null
  images?: Image[]
  specs?: VersionSpecs | null
  powertrain?: Powertrain | null
  racing?: RacingRecord[]
  designers?: Designer[]
  drivers?: Driver[]
  /** Presente solo quando la versione arriva da un designer */
  designer_role?: DesignerRole
}

export type CarModel = {
  id: number
  name: string
  slug: string
  description: string
  category?: Category
  cover?: Image | null
  /** I tre dati chiave della versione principale, solo negli elenchi */
  highlights?: {
    power_cv: number | null
    zero_to_100_sec: number | null
    top_speed_kmh: number | null
  } | null
  predecessor?: CarModel | null
  successors?: CarModel[]
  versions?: Version[]
  versions_count?: number
  first_year?: number | null
}

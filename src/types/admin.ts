/** I tipi dell'area admin: i dati arrivano con tutte le lingue, perché i form le modificano entrambe */

export type PublicationStatus = 'draft' | 'scheduled' | 'published'

/** Un testo in tutte le lingue: l'italiano c'è sempre, l'inglese può mancare */
export type Translations = {
  it: string
  en?: string
}

export type AdminCategory = {
  id: number
  name: Translations
  slug: string
  sort_order: number
  car_models_count?: number
}

export type AdminCarModel = {
  id: number
  name: string
  slug: string
  description: Translations
  category_id: number
  category?: AdminCategory
  predecessor_id: number | null
  /** Presente quando il backend lo carica, come nella pagina del singolo modello */
  predecessor?: AdminCarModel | null
  versions_count?: number
  status: PublicationStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export type AdminModelFilters = {
  search?: string
  status?: PublicationStatus
  category_id?: number
  page?: number
}

/** I campi che il form manda al backend, per creare o modificare un modello */
export type ModelPayload = {
  name: string
  /** Vuoto: il backend lo genera dal nome */
  slug?: string
  category_id: number | null
  predecessor_id: number | null
  description: Translations
}

/* ---------- Versioni ---------- */

export type VehicleType =
  'stradale' | 'pista' | 'gt_corsa' | 'prototipo' | 'f1' | 'concept'
export type BodyType =
  'coupe' | 'spider' | 'targa' | 'barchetta' | 'suv' | 'monoposto'
export type ProductionType = 'serie' | 'serie_limitata' | 'one_off'
export type ChassisMaterial =
  'acciaio' | 'alluminio' | 'fibra_di_carbonio' | 'misto'
export type BrakeType = 'tamburo' | 'disco_acciaio' | 'carboceramici'
export type GearboxType =
  'manuale' | 'automatico' | 'doppia_frizione' | 'robotizzato' | 'sequenziale'
export type Drivetrain = 'posteriore' | 'integrale'

/** La scheda tecnica: ogni campo può mancare */
export type VersionSpecs = {
  length_mm: number | null
  width_mm: number | null
  height_mm: number | null
  wheelbase_mm: number | null
  dry_weight_kg: number | null
  weight_front_pct: number | null
  chassis_material: ChassisMaterial | null
  brakes: BrakeType | null
  top_speed_kmh: number | null
  zero_to_100_sec: number | null
  zero_to_200_sec: number | null
  fiorano_lap_sec: number | null
}

/** La motorizzazione: termica, elettrica o entrambe */
export type VersionPowertrain = {
  engine_id: number | null
  ice_power_cv: number | null
  ice_torque_nm: number | null
  ice_max_rpm: number | null
  fuel_consumption_l100: number | null
  electric_power_cv: number | null
  electric_motors_count: number | null
  battery_kwh: number | null
  electric_range_km: number | null
  system_power_cv: number | null
  system_torque_nm: number | null
  gearbox_type: GearboxType | null
  gears: number | null
  drivetrain: Drivetrain | null
  /** Calcolato dal database: termico, ibrido o elettrico. Solo da leggere */
  powertrain_type?: 'termico' | 'ibrido' | 'elettrico'
}

export type AdminVersion = {
  id: number
  car_model_id: number
  name: string
  slug: string
  vehicle_type: VehicleType
  body_type: BodyType | null
  project_code: string | null
  seats: number | null
  year_start: number
  year_end: number | null
  in_production: boolean
  production_type: ProductionType | null
  units_produced: number | null
  description: Partial<Translations>
  sort_order: number
  status: PublicationStatus
  published_at: string | null
  created_at: string
  updated_at: string
  specs?: VersionSpecs | null
  powertrain?: VersionPowertrain | null
  /** I collegamenti, nella forma del backend: credits.ts li riconduce a DesignerCredit e DriverCredit */
  designers?: {
    id: number
    name: string
    role?: DesignerRole
    pivot?: { role: DesignerRole }
  }[]
  drivers?: {
    id: number
    name?: string
    first_name?: string
    last_name?: string
  }[]
}

/** Quello che il form manda: i dati della versione con le sue due sezioni */
export type VersionPayload = Omit<
  AdminVersion,
  | 'id'
  | 'car_model_id'
  | 'slug'
  | 'status'
  | 'published_at'
  | 'created_at'
  | 'updated_at'
  | 'specs'
  | 'powertrain'
> & {
  slug?: string
  specs?: Partial<VersionSpecs> | null
  powertrain?: Partial<Omit<VersionPowertrain, 'powertrain_type'>> | null
}

/** Un motore del catalogo, per la scelta nella motorizzazione */
export type EngineArchitecture = 'V' | 'in_linea' | 'piatto'
export type Aspiration = 'aspirato' | 'turbo' | 'compressore'

/** Un motore del catalogo */
export type AdminEngine = {
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
  description: Partial<Translations>
  versions_count?: number
}

/** Quello che il form manda: tutti i campi modificabili */
export type EnginePayload = Omit<
  AdminEngine,
  | 'id'
  | 'versions_count'
  | 'architecture'
  | 'aspiration'
  | 'cylinders'
  | 'displacement_cc'
> & {
  // Possono arrivare vuoti dal form: il backend risponde "obbligatorio" sotto il campo
  architecture: EngineArchitecture | null
  aspiration: Aspiration | null
  cylinders: number | null
  displacement_cc: number | null
}

/** Una foto di una versione, come la restituisce l'admin */
export type AdminImage = {
  id: number
  /** L'indirizzo completo del file */
  url: string
  /** Il testo alternativo in tutte le lingue: l'italiano c'è sempre */
  alt_text: Partial<Translations>
  is_cover: boolean
  sort_order: number
}

export type DesignerType = 'studio' | 'persona'
export type DesignerRole = 'design' | 'carrozzeria'

export type AdminDesigner = {
  id: number
  name: string
  slug: string
  type: DesignerType
  /** Il codice del paese, di due lettere: IT */
  country: string | null
  versions_count?: number
}

export type DesignerPayload = {
  name: string
  slug?: string
  type: DesignerType | null
  country: string | null
}

export type AdminDriver = {
  id: number
  first_name: string
  last_name: string
  slug: string
  /** Il codice del paese, di due lettere: MC */
  nationality: string | null
  /** La data senza ora: 1997-10-16 */
  birth_date: string | null
  versions_count?: number
}

export type DriverPayload = {
  first_name: string
  last_name: string
  slug?: string
  nationality: string | null
  birth_date: string | null
}

/** Un designer collegato a una versione, con il suo ruolo */
export type DesignerCredit = { id: number; name: string; role: DesignerRole }

/** Un pilota collegato a una versione */
export type DriverCredit = { id: number; name: string }

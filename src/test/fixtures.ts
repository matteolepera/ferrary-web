import type { Paginated } from '@/types/api'
import type {
  CarModel,
  Version,
  Category,
  Engine,
  Designer,
} from '@/types/catalog'

export const families: Category[] = [
  { id: 2, name: 'Stradali', slug: 'stradali', models_count: 12 },
  { id: 1, name: 'Hypercar', slug: 'hypercar', models_count: 1 },
]

/**
 * Dati di esempio con la forma delle risposte dell'API, per i test.
 */
export const f40: CarModel = {
  id: 1,
  name: 'F40',
  slug: 'f40',
  description: "Presentata nel 1987 per i quarant'anni della Casa.",
  category: { id: 1, name: 'Hypercar', slug: 'hypercar' },
  cover: null,
  versions_count: 1,
  first_year: 1987,
  highlights: { power_cv: 478, zero_to_100_sec: 4.1, top_speed_kmh: 324 },
}

export const sf90: CarModel = {
  id: 2,
  name: 'SF90 Stradale',
  slug: 'sf90-stradale',
  description: 'La prima Ferrari ibrida plug-in di serie.',
  category: { id: 2, name: 'Stradali', slug: 'stradali' },
  cover: null,
  highlights: { power_cv: 1000, zero_to_100_sec: 2.5, top_speed_kmh: 340 },
  versions_count: 3,
  first_year: 2019,
}

export const sf90Stradale: Version = {
  id: 1,
  name: 'SF90 Stradale',
  slug: 'sf90-stradale',
  vehicle_type: 'stradale',
  body_type: 'coupe',
  project_code: 'F173',
  seats: 2,
  years: { start: 2019, end: null, in_production: false },
  production: { type: 'serie', units: null },
  description: null,
  images: [
    {
      id: 1,
      url: '/foto/sf90-tre-quarti.webp',
      alt_text: 'SF90 Stradale di tre quarti',
      is_cover: true,
      sort_order: 1,
    },
    {
      id: 2,
      url: '/foto/sf90-posteriore.webp',
      alt_text: 'SF90 Stradale vista da dietro',
      is_cover: false,
      sort_order: 2,
    },
  ],
  designers: [
    {
      id: 1,
      name: 'Centro Stile Ferrari',
      slug: 'centro-stile-ferrari',
      type: 'studio',
      country: 'Italia',
      role: 'design',
    },
    {
      id: 2,
      name: 'Flavio Manzoni',
      slug: 'flavio-manzoni',
      type: 'persona',
      country: 'Italia',
      role: 'design',
    },
  ],
  drivers: [],
}

const f154fa: Engine = {
  id: 1,
  code: 'F154FA',
  name: null,
  architecture: 'V',
  v_angle_deg: 90,
  cylinders: 8,
  displacement_cc: 3990,
  bore_mm: null,
  stroke_mm: null,
  valves_per_cylinder: 4,
  aspiration: 'turbo',
  description: null,
}

/** Il dettaglio della SF90 Stradale, come lo restituisce /api/versions/sf90-stradale */
export const sf90StradaleDetail: Version = {
  ...sf90Stradale,
  description:
    "Presentata nel 2019, porta nel nome i novant'anni della Scuderia Ferrari.",
  specs: {
    dimensions: {
      length_mm: 4710,
      width_mm: 1972,
      height_mm: 1186,
      wheelbase_mm: 2650,
    },
    weight: { dry_kg: 1570, front_distribution_pct: null },
    chassis: { material: 'misto', brakes: 'carboceramici' },
    performance: {
      top_speed_kmh: 340,
      zero_to_100_sec: 2.5,
      zero_to_200_sec: 6.7,
      fiorano_lap_sec: 79,
    },
  },
  powertrain: {
    type: 'ibrido',
    engine: f154fa,
    combustion: {
      power_cv: 780,
      torque_nm: 800,
      max_rpm: 7500,
      fuel_consumption_l100: null,
    },
    electric: {
      motors_count: 3,
      power_cv: 220,
      battery_kwh: 7.9,
      range_km: 25,
    },
    system: { power_cv: 1000, torque_nm: null },
    transmission: {
      gearbox_type: 'doppia_frizione',
      gears: 8,
      drivetrain: 'integrale',
    },
  },
}

export const sf90Spider: Version = {
  id: 2,
  name: 'SF90 Spider',
  slug: 'sf90-spider',
  vehicle_type: 'stradale',
  body_type: 'spider',
  project_code: 'F173',
  seats: 2,
  years: { start: 2020, end: null, in_production: true },
  production: { type: 'serie', units: null },
  description: null,
}

/** Il dettaglio di un modello: come nell'elenco, più versioni e discendenza */
export const sf90Detail: CarModel = {
  ...sf90,
  versions: [sf90Stradale, sf90Spider],
  predecessor: null,
  successors: [],
}

export const modelsPage: Paginated<CarModel> = {
  data: [f40, sf90],
  links: { first: null, last: null, prev: null, next: null },
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 24,
    total: 2,
    from: 1,
    to: 2,
  },
}

export const designers: Designer[] = [
  {
    id: 1,
    name: 'Centro Stile Ferrari',
    slug: 'centro-stile-ferrari',
    type: 'studio',
    country: 'Italia',
    versions_count: 3,
  },
  {
    id: 2,
    name: 'Flavio Manzoni',
    slug: 'flavio-manzoni',
    type: 'persona',
    country: 'Italia',
    versions_count: 1,
  },
]

/** Il dettaglio di un designer: le versioni arrivano con il loro modello */
export const manzoniDetail: Designer = {
  ...designers[1],
  versions: [{ ...sf90Stradale, model: sf90, designer_role: 'design' }],
}

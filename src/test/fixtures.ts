import type { Paginated } from '@/types/api'
import type { CarModel, Version, Category } from '@/types/catalog'

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

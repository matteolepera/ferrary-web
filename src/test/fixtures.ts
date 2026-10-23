import type { Paginated } from '@/types/api'
import type { CarModel, Version } from '@/types/catalog'

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

export const modelsPage: Paginated<CarModel> = {
  data: [f40],
  links: { first: null, last: null, prev: null, next: null },
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 24,
    total: 1,
    from: 1,
    to: 1,
  },
}

import { api } from '@/api/client'
import type { ApiResource, Paginated } from '@/types/api'
import type { CarModel, PowertrainType, VehicleType } from '@/types/catalog'

/**
 * Filtri dell'archivio, gli stessi accettati dall'endpoint GET /models.
 */
export type ModelFilters = {
  page?: number
  search?: string
  category?: string
  vehicle_type?: VehicleType
  powertrain?: PowertrainType
  year_from?: number
  year_to?: number
  sort?: 'name' | '-name' | 'year' | '-year'
}

/**
 * Elenco paginato dei modelli visibili.
 */
export async function fetchModels(
  filters: ModelFilters = {},
): Promise<Paginated<CarModel>> {
  const response = await api.get<Paginated<CarModel>>('/models', {
    params: filters,
  })

  return response.data
}

/**
 * Un modello visibile, con le sue versioni, il predecessore e i successori.
 */
export async function fetchModel(slug: string): Promise<CarModel> {
  const response = await api.get<ApiResource<CarModel>>(`/models/${slug}`)

  return response.data.data
}

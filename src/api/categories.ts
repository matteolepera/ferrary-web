import { api } from '@/api/client'
import type { ApiResource } from '@/types/api'
import type { Category } from '@/types/catalog'

/**
 * Le famiglie con almeno un modello visibile, nell'ordine scelto dallo staff.
 */
export async function fetchCategories(): Promise<Category[]> {
  const response = await api.get<ApiResource<Category[]>>('/categories')

  return response.data.data
}

import { api } from '@/api/client'
import type { ApiResource } from '@/types/api'
import type { Version } from '@/types/catalog'

/**
 * Una versione visibile, con dati tecnici, motore, foto, designer, piloti e risultati sportivi.
 */
export async function fetchVersion(slug: string): Promise<Version> {
  const response = await api.get<ApiResource<Version>>(`/versions/${slug}`)

  return response.data.data
}

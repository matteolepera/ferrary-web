import { api } from '@/api/client'
import type { ApiResource } from '@/types/api'
import type { Designer } from '@/types/catalog'

/** I designer con almeno una Ferrari visibile, in ordine alfabetico */
export async function fetchDesigners(): Promise<Designer[]> {
  const response = await api.get<ApiResource<Designer[]>>('/designers')

  return response.data.data
}

/** Un designer con tutte le versioni a cui ha lavorato */
export async function fetchDesigner(slug: string): Promise<Designer> {
  const response = await api.get<ApiResource<Designer>>(`/designers/${slug}`)

  return response.data.data
}

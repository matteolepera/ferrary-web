import { api } from '@/api/client'
import type { ApiResource } from '@/types/api'
import type { Designer, Driver, Engine } from '@/types/catalog'

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

/** I piloti con almeno una Ferrari visibile, per cognome */
export async function fetchDrivers(): Promise<Driver[]> {
  const response = await api.get<ApiResource<Driver[]>>('/drivers')

  return response.data.data
}

/** Un pilota con le versioni che ha guidato e i loro risultati */
export async function fetchDriver(slug: string): Promise<Driver> {
  const response = await api.get<ApiResource<Driver>>(`/drivers/${slug}`)

  return response.data.data
}

/** I motori con almeno una Ferrari visibile, per codice */
export async function fetchEngines(): Promise<Engine[]> {
  const response = await api.get<ApiResource<Engine[]>>('/engines')

  return response.data.data
}

/** Un motore con tutte le versioni che lo montano */
export async function fetchEngine(id: string): Promise<Engine> {
  const response = await api.get<ApiResource<Engine>>(`/engines/${id}`)

  return response.data.data
}

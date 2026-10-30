import type { AxiosRequestConfig } from 'axios'
import { api } from '@/api/client'
import type { ApiResource } from '@/types/api'
import type { Dashboard } from '@/types/dashboard'
import type { User } from '@/types/auth'

/**
 * Le opzioni di ogni richiesta dell'area admin: l'interfaccia è solo in italiano,
 * quindi anche i messaggi del backend, come gli errori di validazione.
 */
export const adminRequest: AxiosRequestConfig = {
  headers: { 'Accept-Language': 'it' },
}

export async function fetchDashboard(): Promise<Dashboard> {
  const response = await api.get<ApiResource<Dashboard>>(
    '/admin/dashboard',
    adminRequest,
  )

  return response.data.data
}

export async function fetchStaff(): Promise<User[]> {
  const response = await api.get<ApiResource<User[]>>(
    '/admin/staff',
    adminRequest,
  )

  return response.data.data
}

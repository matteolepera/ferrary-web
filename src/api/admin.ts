import type { AxiosRequestConfig } from 'axios'
import { api } from '@/api/client'
import type { ApiResource, Paginated } from '@/types/api'
import type { Dashboard } from '@/types/dashboard'
import type { User } from '@/types/auth'
import type {
  AdminCarModel,
  AdminCategory,
  AdminModelFilters,
  ModelPayload,
} from '@/types/admin'

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

export async function fetchAdminModels(
  filters: AdminModelFilters = {},
): Promise<Paginated<AdminCarModel>> {
  const response = await api.get<Paginated<AdminCarModel>>('/admin/models', {
    ...adminRequest,
    params: filters,
  })

  return response.data
}

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const response = await api.get<ApiResource<AdminCategory[]>>(
    '/admin/categories',
    adminRequest,
  )

  return response.data.data
}

export async function fetchAdminModel(id: number): Promise<AdminCarModel> {
  const response = await api.get<ApiResource<AdminCarModel>>(
    `/admin/models/${id}`,
    adminRequest,
  )

  return response.data.data
}

export async function createModel(
  payload: ModelPayload,
): Promise<AdminCarModel> {
  const response = await api.post<ApiResource<AdminCarModel>>(
    '/admin/models',
    payload,
    adminRequest,
  )

  return response.data.data
}

export async function updateModel(
  id: number,
  payload: ModelPayload,
): Promise<AdminCarModel> {
  const response = await api.patch<ApiResource<AdminCarModel>>(
    `/admin/models/${id}`,
    payload,
    adminRequest,
  )

  return response.data.data
}

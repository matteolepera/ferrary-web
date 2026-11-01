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
  AdminVersion,
  VersionPayload,
  AdminEngine,
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

/** Pubblica subito, oppure alla data indicata: senza data decide l'orologio del server */
export async function publishModel(
  id: number,
  publishedAt?: string,
): Promise<AdminCarModel> {
  const response = await api.post<ApiResource<AdminCarModel>>(
    `/admin/models/${id}/publish`,
    publishedAt ? { published_at: publishedAt } : {},
    adminRequest,
  )

  return response.data.data
}

export async function unpublishModel(id: number): Promise<AdminCarModel> {
  const response = await api.post<ApiResource<AdminCarModel>>(
    `/admin/models/${id}/unpublish`,
    {},
    adminRequest,
  )

  return response.data.data
}

/* ---------- Versioni ---------- */

export async function fetchModelVersions(
  modelId: number,
): Promise<AdminVersion[]> {
  const response = await api.get<ApiResource<AdminVersion[]>>(
    `/admin/models/${modelId}/versions`,
    adminRequest,
  )

  return response.data.data
}

export async function fetchAdminVersion(id: number): Promise<AdminVersion> {
  const response = await api.get<ApiResource<AdminVersion>>(
    `/admin/versions/${id}`,
    adminRequest,
  )

  return response.data.data
}

export async function createVersion(
  modelId: number,
  payload: VersionPayload,
): Promise<AdminVersion> {
  const response = await api.post<ApiResource<AdminVersion>>(
    `/admin/models/${modelId}/versions`,
    payload,
    adminRequest,
  )

  return response.data.data
}

export async function updateVersion(
  id: number,
  payload: VersionPayload,
): Promise<AdminVersion> {
  const response = await api.patch<ApiResource<AdminVersion>>(
    `/admin/versions/${id}`,
    payload,
    adminRequest,
  )

  return response.data.data
}

export async function fetchAdminEngines(): Promise<AdminEngine[]> {
  const response = await api.get<ApiResource<AdminEngine[]>>(
    '/admin/engines',
    adminRequest,
  )

  return response.data.data
}

export async function publishVersion(
  id: number,
  publishedAt?: string,
): Promise<AdminVersion> {
  const response = await api.post<ApiResource<AdminVersion>>(
    `/admin/versions/${id}/publish`,
    publishedAt ? { published_at: publishedAt } : {},
    adminRequest,
  )

  return response.data.data
}

export async function unpublishVersion(id: number): Promise<AdminVersion> {
  const response = await api.post<ApiResource<AdminVersion>>(
    `/admin/versions/${id}/unpublish`,
    {},
    adminRequest,
  )

  return response.data.data
}

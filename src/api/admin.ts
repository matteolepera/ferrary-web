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
  AdminImage,
  EnginePayload,
  AdminDesigner,
  DesignerPayload,
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

export async function fetchAdminEngine(id: number): Promise<AdminEngine> {
  const response = await api.get<ApiResource<AdminEngine>>(
    `/admin/engines/${id}`,
    adminRequest,
  )

  return response.data.data
}

export async function createEngine(
  payload: EnginePayload,
): Promise<AdminEngine> {
  const response = await api.post<ApiResource<AdminEngine>>(
    '/admin/engines',
    payload,
    adminRequest,
  )

  return response.data.data
}

export async function updateEngine(
  id: number,
  payload: EnginePayload,
): Promise<AdminEngine> {
  const response = await api.patch<ApiResource<AdminEngine>>(
    `/admin/engines/${id}`,
    payload,
    adminRequest,
  )

  return response.data.data
}

export async function deleteEngine(id: number): Promise<void> {
  await api.delete(`/admin/engines/${id}`, adminRequest)
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

/* ---------- Foto ---------- */

export async function fetchVersionImages(
  versionId: number,
): Promise<AdminImage[]> {
  const response = await api.get<ApiResource<AdminImage[]>>(
    `/admin/versions/${versionId}/images`,
    adminRequest,
  )

  return response.data.data
}

export type ImageUpload = {
  file: File
  altText: { it: string; en?: string }
  /** Chiamata durante il caricamento, con la percentuale da 0 a 100 */
  onProgress?: (percent: number) => void
}

/**
 * Il modulo di una foto: il file nel campo image, e il testo alternativo per lingua.
 * Separato dall'invio per poterlo provare nei test, dove la rete non sa leggere i moduli.
 */
export function imageForm({
  file,
  altText,
}: Pick<ImageUpload, 'file' | 'altText'>) {
  const form = new FormData()
  form.append('image', file)
  form.append('alt_text[it]', altText.it)
  if (altText.en) form.append('alt_text[en]', altText.en)

  return form
}

/**
 * Carica una foto. Il file viaggia come multipart/form-data, il formato dei moduli con allegati,
 * e i campi annidati si scrivono con le parentesi quadre: alt_text[it].
 */
export async function uploadImage(
  versionId: number,
  { file, altText, onProgress }: ImageUpload,
): Promise<AdminImage> {
  const form = imageForm({ file, altText })

  const response = await api.post<ApiResource<AdminImage>>(
    `/admin/versions/${versionId}/images`,
    form,
    {
      headers: {
        ...adminRequest.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (event) => {
        if (event.total)
          onProgress?.(Math.round((event.loaded / event.total) * 100))
      },
    },
  )

  return response.data.data
}

export async function updateImage(
  id: number,
  changes: { alt_text?: { it: string; en?: string }; is_cover?: true },
): Promise<AdminImage> {
  const response = await api.patch<ApiResource<AdminImage>>(
    `/admin/images/${id}`,
    changes,
    adminRequest,
  )

  return response.data.data
}

export async function deleteImage(id: number): Promise<void> {
  await api.delete(`/admin/images/${id}`, adminRequest)
}

export async function reorderImages(
  versionId: number,
  ids: number[],
): Promise<AdminImage[]> {
  const response = await api.put<ApiResource<AdminImage[]>>(
    `/admin/versions/${versionId}/images/order`,
    { images: ids },
    adminRequest,
  )

  return response.data.data
}

/* ---------- Famiglie ---------- */

export type CategoryPayload = {
  name: { it: string; en?: string }
  slug?: string
  sort_order: number
}

export async function createCategory(
  payload: CategoryPayload,
): Promise<AdminCategory> {
  const response = await api.post<ApiResource<AdminCategory>>(
    '/admin/categories',
    payload,
    adminRequest,
  )

  return response.data.data
}

export async function updateCategory(
  id: number,
  payload: CategoryPayload,
): Promise<AdminCategory> {
  const response = await api.patch<ApiResource<AdminCategory>>(
    `/admin/categories/${id}`,
    payload,
    adminRequest,
  )

  return response.data.data
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/admin/categories/${id}`, adminRequest)
}

/* ---------- Designer ---------- */

export async function fetchAdminDesigners(): Promise<AdminDesigner[]> {
  const response = await api.get<ApiResource<AdminDesigner[]>>(
    '/admin/designers',
    adminRequest,
  )

  return response.data.data
}

export async function createDesigner(
  payload: DesignerPayload,
): Promise<AdminDesigner> {
  const response = await api.post<ApiResource<AdminDesigner>>(
    '/admin/designers',
    payload,
    adminRequest,
  )

  return response.data.data
}

export async function updateDesigner(
  id: number,
  payload: DesignerPayload,
): Promise<AdminDesigner> {
  const response = await api.patch<ApiResource<AdminDesigner>>(
    `/admin/designers/${id}`,
    payload,
    adminRequest,
  )

  return response.data.data
}

export async function deleteDesigner(id: number): Promise<void> {
  await api.delete(`/admin/designers/${id}`, adminRequest)
}

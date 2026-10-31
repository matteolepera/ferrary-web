/** I tipi dell'area admin: i dati arrivano con tutte le lingue, perché i form le modificano entrambe */

export type PublicationStatus = 'draft' | 'scheduled' | 'published'

/** Un testo in tutte le lingue: l'italiano c'è sempre, l'inglese può mancare */
export type Translations = {
  it: string
  en?: string
}

export type AdminCategory = {
  id: number
  name: Translations
  slug: string
  sort_order: number
  car_models_count?: number
}

export type AdminCarModel = {
  id: number
  name: string
  slug: string
  description: Translations
  category_id: number
  category?: AdminCategory
  predecessor_id: number | null
  versions_count?: number
  status: PublicationStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export type AdminModelFilters = {
  search?: string
  status?: PublicationStatus
  category_id?: number
  page?: number
}

/** I campi che il form manda al backend, per creare o modificare un modello */
export type ModelPayload = {
  name: string
  /** Vuoto: il backend lo genera dal nome */
  slug?: string
  category_id: number | null
  predecessor_id: number | null
  description: Translations
}

/**
 * Risposta con un singolo elemento: Laravel lo avvolge sempre in "data".
 */
export type ApiResource<T> = {
  data: T
}

/**
 * Risposta paginata di Laravel: gli elementi più i link e le informazioni sulle pagine.
 */
export type Paginated<T> = {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
}

/**
 * Errore di validazione (422): un elenco di messaggi per ogni campo.
 */
export type ValidationError = {
  message: string
  errors: Record<string, string[]>
}

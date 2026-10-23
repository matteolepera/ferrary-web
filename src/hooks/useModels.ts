import { useQuery } from '@tanstack/react-query'
import { fetchModels, type ModelFilters } from '@/api/models'

/**
 * Elenco dei modelli, con cache e stati di caricamento gestiti da TanStack Query.
 */
export function useModels(filters: ModelFilters = {}) {
  return useQuery({
    // La chiave identifica i dati in cache: filtri diversi, cache diverse
    queryKey: ['models', filters],
    queryFn: () => fetchModels(filters),
  })
}

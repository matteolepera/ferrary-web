import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { fetchModels, type ModelFilters } from '@/api/models'

/**
 * Elenco dei modelli, con cache e stati di caricamento gestiti da TanStack Query.
 */
export function useModels(filters: ModelFilters = {}) {
  const { i18n } = useTranslation()

  return useQuery({
    // La lingua fa parte della chiave: ogni lingua ha la sua copia dei dati in cache
    queryKey: ['models', i18n.language, filters],
    queryFn: () => fetchModels(filters),
  })
}

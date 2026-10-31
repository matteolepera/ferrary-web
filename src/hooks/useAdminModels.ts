import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchAdminCategories, fetchAdminModels } from '@/api/admin'
import type { AdminModelFilters } from '@/types/admin'

/**
 * I modelli dell'admin, con i filtri. Cambiando filtro o pagina,
 * la tabella resta visibile finché arrivano i nuovi risultati.
 */
export function useAdminModels(
  filters: AdminModelFilters,
  { enabled = true } = {},
) {
  return useQuery({
    queryKey: ['admin', 'models', filters],
    queryFn: () => fetchAdminModels(filters),
    placeholderData: keepPreviousData,
    enabled,
  })
}

/**
 * Le famiglie, per il menu dei filtri e, più avanti, per il form del modello.
 */
export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: fetchAdminCategories,
    staleTime: 5 * 60_000,
  })
}

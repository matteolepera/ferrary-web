import { useQuery } from '@tanstack/react-query'
import { fetchDashboard } from '@/api/admin'

/**
 * I dati del pannello. La chiave inizia con "admin": il logout la cancella dalla cache.
 */
export function useDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: fetchDashboard,
    // Il pannello racconta cosa sta succedendo: dopo 30 secondi lo si ricarica tornando sulla pagina
    staleTime: 30_000,
  })
}

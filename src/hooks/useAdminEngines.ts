import { useQuery } from '@tanstack/react-query'
import { fetchAdminEngines } from '@/api/admin'

/** I motori del catalogo: cambiano di rado, quindi restano in cache a lungo */
export function useAdminEngines() {
  return useQuery({
    queryKey: ['admin', 'engines'],
    queryFn: fetchAdminEngines,
    staleTime: 10 * 60_000,
  })
}

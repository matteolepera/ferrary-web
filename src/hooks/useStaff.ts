import { useQuery } from '@tanstack/react-query'
import { fetchStaff } from '@/api/admin'

/**
 * Le persone dello staff, il Master per primo. Solo per Master e Admin: ai moderatori il backend risponde 403.
 */
export function useStaff() {
  return useQuery({
    queryKey: ['admin', 'staff'],
    queryFn: fetchStaff,
    // Lo staff cambia di rado
    staleTime: 5 * 60_000,
  })
}

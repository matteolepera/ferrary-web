import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createDriver,
  deleteDriver,
  fetchAdminDrivers,
  updateDriver,
} from '@/api/admin'
import type { DriverPayload } from '@/types/admin'

/** I piloti del catalogo */
export function useAdminDrivers() {
  return useQuery({
    queryKey: ['admin', 'drivers'],
    queryFn: fetchAdminDrivers,
    staleTime: 10 * 60_000,
  })
}

/**
 * Creare, modificare ed eliminare un pilota, aggiornando anche il catalogo pubblico.
 */
export function useDriverActions() {
  const queryClient = useQueryClient()

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'drivers'] })
    queryClient.invalidateQueries({ queryKey: ['drivers'] })
  }

  const save = useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: DriverPayload }) =>
      id === undefined ? createDriver(payload) : updateDriver(id, payload),
    onSuccess: refresh,
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteDriver(id),
    onSuccess: refresh,
  })

  return { save, remove }
}

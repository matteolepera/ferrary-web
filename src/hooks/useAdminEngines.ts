import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createEngine,
  deleteEngine,
  fetchAdminEngine,
  fetchAdminEngines,
  updateEngine,
} from '@/api/admin'
import { isNotFound } from '@/api/errors'
import type { EnginePayload } from '@/types/admin'

/** I motori del catalogo: cambiano di rado, quindi restano in cache a lungo */
export function useAdminEngines() {
  return useQuery({
    queryKey: ['admin', 'engines'],
    queryFn: fetchAdminEngines,
    staleTime: 10 * 60_000,
  })
}

/** Un motore; senza id, il form di un motore nuovo */
export function useAdminEngine(id: number | undefined) {
  return useQuery({
    queryKey: ['admin', 'engines', id],
    queryFn: () => fetchAdminEngine(id as number),
    enabled: id !== undefined,
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 2,
  })
}

/**
 * Creare, modificare ed eliminare un motore. Dopo ognuna si aggiornano i motori dell'admin,
 * e quelli del catalogo pubblico.
 */
export function useEngineActions() {
  const queryClient = useQueryClient()

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'engines'] })
    queryClient.invalidateQueries({ queryKey: ['engines'] })
  }

  const save = useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: EnginePayload }) =>
      id === undefined ? createEngine(payload) : updateEngine(id, payload),
    onSuccess: (engine) => {
      refresh()
      queryClient.setQueryData(['admin', 'engines', engine.id], engine)
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteEngine(id),
    onSuccess: refresh,
  })

  return { save, remove }
}

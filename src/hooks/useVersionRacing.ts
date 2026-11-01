import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createRacing,
  deleteRacing,
  fetchVersionRacing,
  updateRacing,
} from '@/api/admin'
import type { RacingPayload } from '@/types/admin'

const racingKey = (versionId: number) => [
  'admin',
  'versions',
  versionId,
  'racing',
]

/** I risultati sportivi di una versione */
export function useVersionRacing(versionId: number) {
  return useQuery({
    queryKey: racingKey(versionId),
    queryFn: () => fetchVersionRacing(versionId),
  })
}

/** Aggiungere, modificare ed eliminare un campionato della versione */
export function useRacingActions(versionId: number) {
  const queryClient = useQueryClient()

  function refresh() {
    queryClient.invalidateQueries({ queryKey: racingKey(versionId) })
  }

  const save = useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: RacingPayload }) =>
      id === undefined
        ? createRacing(versionId, payload)
        : updateRacing(id, payload),
    onSuccess: refresh,
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteRacing(id),
    onSuccess: refresh,
  })

  return { save, remove }
}

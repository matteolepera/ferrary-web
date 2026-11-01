import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createVersion,
  fetchAdminVersion,
  fetchModelVersions,
  updateVersion,
} from '@/api/admin'
import { isNotFound } from '@/api/errors'
import type { VersionPayload } from '@/types/admin'

/** Le versioni di un modello, nel loro ordine */
export function useModelVersions(modelId: number) {
  return useQuery({
    queryKey: ['admin', 'models', modelId, 'versions'],
    queryFn: () => fetchModelVersions(modelId),
  })
}

/** Una versione, con scheda tecnica e motorizzazione. Senza id: una versione nuova */
export function useAdminVersion(id: number | undefined) {
  return useQuery({
    queryKey: ['admin', 'versions', id],
    queryFn: () => fetchAdminVersion(id as number),
    enabled: id !== undefined,
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 2,
  })
}

/**
 * Il salvataggio: crea la versione nel modello se non ha un id, altrimenti la modifica.
 */
export function useSaveVersion(modelId: number, id: number | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VersionPayload) =>
      id === undefined
        ? createVersion(modelId, payload)
        : updateVersion(id, payload),
    onSuccess: (version) => {
      // Le versioni del modello, il modello stesso con il suo conteggio, e il pannello
      queryClient.invalidateQueries({ queryKey: ['admin', 'models', modelId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      queryClient.setQueryData(['admin', 'versions', version.id], version)
    },
  })
}

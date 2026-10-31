import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createModel, fetchAdminModel, updateModel } from '@/api/admin'
import { isNotFound } from '@/api/errors'
import type { ModelPayload } from '@/types/admin'

/**
 * Un modello dell'admin. Senza id, siamo sul form di un modello nuovo: niente da caricare.
 */
export function useAdminModel(id: number | undefined) {
  return useQuery({
    queryKey: ['admin', 'models', id],
    queryFn: () => fetchAdminModel(id as number),
    enabled: id !== undefined,
    // Un 404 non migliora riprovando
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 2,
  })
}

/**
 * Il salvataggio: crea il modello se non ha un id, altrimenti lo modifica.
 */
export function useSaveModel(id: number | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ModelPayload) =>
      id === undefined ? createModel(payload) : updateModel(id, payload),
    onSuccess: (model) => {
      // Tutte le voci dei modelli, elenco compreso, e il pannello, con i suoi numeri
      queryClient.invalidateQueries({ queryKey: ['admin', 'models'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      // La risposta è già il modello aggiornato: lo scriviamo subito, senza aspettare una nuova richiesta
      queryClient.setQueryData(['admin', 'models', model.id], model)
    },
  })
}

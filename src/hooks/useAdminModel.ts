import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createModel,
  fetchAdminModel,
  updateModel,
  publishModel,
  unpublishModel,
} from '@/api/admin'
import { isNotFound } from '@/api/errors'
import type { ModelPayload } from '@/types/admin'
import type { AdminCarModel } from '@/types/admin'

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

/** Le tre cose che si possono fare con la pubblicazione */
export type PublicationChange =
  | { action: 'publish' }
  | { action: 'schedule'; publishedAt: string }
  | { action: 'unpublish' }

/**
 * Pubblica, programma o riporta in bozza un modello.
 */
export function useModelPublication(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (change: PublicationChange) =>
      change.action === 'unpublish'
        ? unpublishModel(id)
        : publishModel(
            id,
            change.action === 'schedule' ? change.publishedAt : undefined,
          ),
    onSuccess: (result) => {
      // La risposta non ha la famiglia né le versioni: la uniamo al modello che abbiamo già
      queryClient.setQueryData<AdminCarModel>(
        ['admin', 'models', id],
        (current) => (current ? { ...current, ...result } : result),
      )
      // Gli elenchi e il pannello cambiano; il modello stesso è già aggiornato qui sopra
      queryClient.invalidateQueries({
        queryKey: ['admin', 'models'],
        predicate: (query) => query.queryKey[2] !== id,
      })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

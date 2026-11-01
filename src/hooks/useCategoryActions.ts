import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCategory,
  deleteCategory,
  updateCategory,
  type CategoryPayload,
} from '@/api/admin'

/**
 * Creare, modificare ed eliminare una famiglia. Dopo ognuna si aggiornano le famiglie dell'admin,
 * l'elenco dei modelli, che le mostra, e quelle del sito pubblico, nella home e nel piè di pagina.
 */
export function useCategoryActions() {
  const queryClient = useQueryClient()

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'models'] })
    queryClient.invalidateQueries({ queryKey: ['categories'] })
  }

  const save = useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: CategoryPayload }) =>
      id === undefined ? createCategory(payload) : updateCategory(id, payload),
    onSuccess: refresh,
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: refresh,
  })

  return { save, remove }
}

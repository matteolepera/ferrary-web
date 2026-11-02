import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchTrash,
  purgeModel,
  purgeVersion,
  restoreModel,
  restoreVersion,
  trashModel,
  trashVersion,
} from '@/api/admin'

/** Il contenuto del cestino. Solo per Admin e Master */
export function useTrash() {
  return useQuery({
    queryKey: ['admin', 'trash'],
    queryFn: fetchTrash,
    retry: false,
  })
}

/**
 * Tutte le operazioni del cestino. Ognuna cambia cosa si vede altrove:
 * gli elenchi dei modelli, le versioni, il pannello con i suoi numeri, e il sito pubblico.
 */
export function useTrashActions() {
  const queryClient = useQueryClient()

  function refresh() {
    for (const queryKey of [
      ['admin', 'trash'],
      ['admin', 'models'],
      ['admin', 'versions'],
      ['admin', 'dashboard'],
      ['models'],
    ]) {
      queryClient.invalidateQueries({ queryKey })
    }
  }

  const options = { onSuccess: refresh }

  return {
    trashModel: useMutation({ mutationFn: trashModel, ...options }),
    trashVersion: useMutation({ mutationFn: trashVersion, ...options }),
    restoreModel: useMutation({ mutationFn: restoreModel, ...options }),
    restoreVersion: useMutation({ mutationFn: restoreVersion, ...options }),
    purgeModel: useMutation({ mutationFn: purgeModel, ...options }),
    purgeVersion: useMutation({ mutationFn: purgeVersion, ...options }),
  }
}

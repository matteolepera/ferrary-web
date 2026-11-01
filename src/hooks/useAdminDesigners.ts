import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createDesigner,
  deleteDesigner,
  fetchAdminDesigners,
  updateDesigner,
} from '@/api/admin'
import type { DesignerPayload } from '@/types/admin'

/** I designer del catalogo */
export function useAdminDesigners() {
  return useQuery({
    queryKey: ['admin', 'designers'],
    queryFn: fetchAdminDesigners,
    staleTime: 10 * 60_000,
  })
}

/**
 * Creare, modificare ed eliminare un designer, aggiornando anche il catalogo pubblico.
 */
export function useDesignerActions() {
  const queryClient = useQueryClient()

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'designers'] })
    queryClient.invalidateQueries({ queryKey: ['designers'] })
  }

  const save = useMutation({
    mutationFn: ({ id, payload }: { id?: number; payload: DesignerPayload }) =>
      id === undefined ? createDesigner(payload) : updateDesigner(id, payload),
    onSuccess: refresh,
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteDesigner(id),
    onSuccess: refresh,
  })

  return { save, remove }
}

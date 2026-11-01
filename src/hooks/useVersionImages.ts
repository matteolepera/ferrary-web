import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteImage,
  fetchVersionImages,
  reorderImages,
  updateImage,
  uploadImage,
  type ImageUpload,
} from '@/api/admin'
import type { AdminImage } from '@/types/admin'

const imagesKey = (versionId: number) => [
  'admin',
  'versions',
  versionId,
  'images',
]

/** Le foto di una versione, nell'ordine della galleria */
export function useVersionImages(versionId: number) {
  return useQuery({
    queryKey: imagesKey(versionId),
    queryFn: () => fetchVersionImages(versionId),
  })
}

/**
 * Tutte le operazioni sulle foto di una versione. Dopo ognuna, la galleria si ricarica,
 * e anche il pannello, dove una versione senza foto compare tra quelle da completare.
 */
export function useImageActions(versionId: number) {
  const queryClient = useQueryClient()

  function refresh() {
    queryClient.invalidateQueries({ queryKey: imagesKey(versionId) })
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
  }

  const upload = useMutation({
    mutationFn: (upload: ImageUpload) => uploadImage(versionId, upload),
    onSuccess: refresh,
  })

  const update = useMutation({
    mutationFn: ({
      id,
      ...changes
    }: {
      id: number
      alt_text?: { it: string; en?: string }
      is_cover?: true
    }) => updateImage(id, changes),
    onSuccess: refresh,
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteImage(id),
    onSuccess: refresh,
  })

  const reorder = useMutation({
    mutationFn: (ids: number[]) => reorderImages(versionId, ids),
    // Il nuovo ordine si vede subito, senza aspettare il server
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: imagesKey(versionId) })
      const previous = queryClient.getQueryData<AdminImage[]>(
        imagesKey(versionId),
      )

      queryClient.setQueryData<AdminImage[]>(imagesKey(versionId), (current) =>
        ids
          .map((id) => current?.find((image) => image.id === id))
          .filter((image) => image !== undefined),
      )

      return { previous }
    },
    // Se il server rifiuta, la galleria torna com'era
    onError: (_error, _ids, context) => {
      queryClient.setQueryData(imagesKey(versionId), context?.previous)
    },
    onSettled: refresh,
  })

  return { upload, update, remove, reorder }
}

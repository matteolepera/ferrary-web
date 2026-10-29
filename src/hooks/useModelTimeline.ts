import { useInfiniteQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { fetchModels } from '@/api/models'

/**
 * Tutti i modelli in ordine cronologico, caricati una pagina dopo l'altra.
 */
export function useModelTimeline() {
  const { i18n } = useTranslation()

  return useInfiniteQuery({
    queryKey: ['models-timeline', i18n.language],
    queryFn: ({ pageParam }) => fetchModels({ sort: 'year', page: pageParam }),
    // Si parte dalla prima pagina...
    initialPageParam: 1,
    // ...e si chiede la successiva finché ce n'è una; undefined significa "fine"
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
  })
}

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { fetchTimeline } from '@/api/models'

/**
 * Tutte le Ferrari in ordine cronologico, in una richiesta sola.
 */
export function useModelTimeline() {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: ['models-timeline', i18n.language],
    queryFn: fetchTimeline,
  })
}

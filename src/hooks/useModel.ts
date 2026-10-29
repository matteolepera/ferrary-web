import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { isNotFound } from '@/api/errors'
import { fetchModel } from '@/api/models'

/**
 * Un modello, cercato per slug. I testi sono tradotti: la lingua fa parte della chiave.
 */
export function useModel(slug: string) {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: ['model', i18n.language, slug],
    queryFn: () => fetchModel(slug),
    // Un modello che non esiste non comparirà riprovando: niente nuovo tentativo sul 404
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 1,
  })
}

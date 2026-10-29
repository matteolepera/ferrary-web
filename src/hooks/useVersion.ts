import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { isNotFound } from '@/api/errors'
import { fetchVersion } from '@/api/versions'

/**
 * Una versione, cercata per slug. Finché lo slug non è noto, la richiesta aspetta.
 */
export function useVersion(slug: string | undefined) {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: ['version', i18n.language, slug],
    queryFn: () => fetchVersion(slug ?? ''),
    enabled: slug !== undefined,
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 1,
  })
}

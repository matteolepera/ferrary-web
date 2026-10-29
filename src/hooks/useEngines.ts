import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { fetchEngine, fetchEngines } from '@/api/catalogs'
import { isNotFound } from '@/api/errors'

export function useEngines() {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: ['engines', i18n.language],
    queryFn: fetchEngines,
  })
}

export function useEngine(id: string) {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: ['engine', i18n.language, id],
    queryFn: () => fetchEngine(id),
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 1,
  })
}

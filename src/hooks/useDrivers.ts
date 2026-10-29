import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { fetchDriver, fetchDrivers } from '@/api/catalogs'
import { isNotFound } from '@/api/errors'

export function useDrivers() {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: ['drivers', i18n.language],
    queryFn: fetchDrivers,
  })
}

export function useDriver(slug: string) {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: ['driver', i18n.language, slug],
    queryFn: () => fetchDriver(slug),
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 1,
  })
}

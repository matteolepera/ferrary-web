import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { fetchDesigner, fetchDesigners } from '@/api/catalogs'
import { isNotFound } from '@/api/errors'

export function useDesigners() {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: ['designers', i18n.language],
    queryFn: fetchDesigners,
  })
}

export function useDesigner(slug: string) {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: ['designer', i18n.language, slug],
    queryFn: () => fetchDesigner(slug),
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 1,
  })
}

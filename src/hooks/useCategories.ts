import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { fetchCategories } from '@/api/categories'

/**
 * Le famiglie dell'archivio. I nomi sono tradotti, quindi la lingua fa parte della chiave.
 */
export function useCategories() {
  const { i18n } = useTranslation()

  return useQuery({
    queryKey: ['categories', i18n.language],
    queryFn: fetchCategories,
  })
}

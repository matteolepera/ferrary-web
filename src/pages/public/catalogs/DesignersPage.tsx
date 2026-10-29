import { useTranslation } from 'react-i18next'
import { CatalogIndex } from '@/components/catalog/CatalogIndex'
import { useDesigners } from '@/hooks/useDesigners'

export function DesignersPage() {
  const { t } = useTranslation()
  const { data, isPending, isError } = useDesigners()

  const items = data?.map((designer) => ({
    id: designer.id,
    to: `/designer/${designer.slug}`,
    name: designer.name,
    meta: [
      t(`catalogs.designers.types.${designer.type}`),
      designer.country,
      designer.versions_count !== undefined &&
        t('catalogs.count', { count: designer.versions_count }),
    ]
      .filter(Boolean)
      .join(' · '),
  }))

  return (
    <CatalogIndex
      title={t('catalogs.designers.title')}
      text={t('catalogs.designers.text')}
      items={items}
      isPending={isPending}
      isError={isError}
    />
  )
}

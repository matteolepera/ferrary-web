import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { YSegments } from '@/components/ui/YSegments'
import { CatalogIndex } from '@/components/catalog/CatalogIndex'
import { useDesigners } from '@/hooks/useDesigners'
import { countryName } from '@/lib/format'

/** I tipi di designer, nell'ordine del menu */
const TYPES = ['studio', 'persona'] as const

export function DesignersPage() {
  const { t, i18n } = useTranslation()
  const { data, isPending, isError, refetch } = useDesigners()
  const [type, setType] = useState('')

  const items = data
    ?.filter((designer) => !type || designer.type === type)
    .map((designer) => ({
      id: designer.id,
      to: `/designer/${designer.slug}`,
      // Il tipo in rosso sopra il nome, dove i motori hanno il codice
      code: t(`catalogs.designers.types.${designer.type}`),
      name: designer.name,
      meta: designer.country
        ? countryName(designer.country, i18n.language)
        : undefined,
      count: designer.versions_count,
    }))

  return (
    <CatalogIndex
      title={t('catalogs.designers.title')}
      text={t('catalogs.designers.text')}
      items={items}
      isPending={isPending}
      isError={isError}
      onRetry={() => refetch()}
      countLabel={(count) => t('catalogs.designers.count', { count })}
      controls={
        <YSegments
          label={t('catalogs.designers.type')}
          value={type}
          onChange={setType}
          options={[
            { value: '', label: t('catalogs.all') },
            ...TYPES.map((value) => ({
              value,
              label: t(`catalogs.designers.types.${value}`),
            })),
          ]}
          className="pr-6 md:pr-7"
        />
      }
    />
  )
}

import { useTranslation } from 'react-i18next'
import { CatalogIndex } from '@/components/catalog/CatalogIndex'
import { useEngines } from '@/hooks/useEngines'
import { formatNumber } from '@/lib/format'

export function EnginesPage() {
  const { t, i18n } = useTranslation()
  const { data, isPending, isError } = useEngines()

  const items = data?.map((engine) => ({
    id: engine.id,
    to: `/motori/${engine.id}`,
    // Il codice è il nome tecnico; se il motore ha anche un nome comune, lo affianchiamo
    name: engine.name ? `${engine.code} · ${engine.name}` : engine.code,
    meta: [
      t(`model.layouts.${engine.architecture}`, {
        cylinders: engine.cylinders,
      }),
      `${formatNumber(engine.displacement_cc, i18n.language)} cm³`,
      engine.versions_count !== undefined &&
        t('catalogs.count', { count: engine.versions_count }),
    ]
      .filter(Boolean)
      .join(' · '),
  }))

  return (
    <CatalogIndex
      title={t('catalogs.engines.title')}
      text={t('catalogs.engines.text')}
      items={items}
      isPending={isPending}
      isError={isError}
    />
  )
}

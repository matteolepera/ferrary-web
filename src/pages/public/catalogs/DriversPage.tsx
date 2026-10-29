import { useTranslation } from 'react-i18next'
import { CatalogIndex } from '@/components/catalog/CatalogIndex'
import { useDrivers } from '@/hooks/useDrivers'

export function DriversPage() {
  const { t } = useTranslation()
  const { data, isPending, isError } = useDrivers()

  const items = data?.map((driver) => ({
    id: driver.id,
    to: `/piloti/${driver.slug}`,
    name: `${driver.first_name} ${driver.last_name}`,
    meta: [
      driver.nationality,
      driver.versions_count !== undefined &&
        t('catalogs.count', { count: driver.versions_count }),
    ]
      .filter(Boolean)
      .join(' · '),
  }))

  return (
    <CatalogIndex
      title={t('catalogs.drivers.title')}
      text={t('catalogs.drivers.text')}
      items={items}
      isPending={isPending}
      isError={isError}
    />
  )
}

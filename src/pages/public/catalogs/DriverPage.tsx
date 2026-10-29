import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { CatalogDetail } from '@/components/catalog/CatalogDetail'
import { useDriver } from '@/hooks/useDrivers'
import { formatDate } from '@/lib/format'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function DriverPage() {
  const { t, i18n } = useTranslation()
  const { slug = '' } = useParams()
  const { data: driver, isPending, isError, error } = useDriver(slug)

  if (isError && isNotFound(error)) {
    return <NotFoundPage />
  }

  if (isError) {
    return (
      <p role="alert" className="text-errore px-5 pt-36 pb-16 text-center">
        {t('catalogs.error')}
      </p>
    )
  }

  if (isPending) {
    return (
      <div
        aria-busy="true"
        className="bg-ombra/40 min-h-[30rem] animate-pulse"
      />
    )
  }

  return (
    <CatalogDetail
      back={{ to: '/piloti', label: t('catalogs.drivers.title') }}
      eyebrow={driver.nationality ?? undefined}
      name={`${driver.first_name} ${driver.last_name}`}
      versions={driver.versions ?? []}
      // Nella card, il campionato in cui ha corso quella Ferrari
      metaFor={(version) => version.racing?.[0]?.championship}
    >
      {driver.birth_date && (
        <dl className="mt-5 flex gap-3 text-sm">
          <dt className="text-neutral-400">
            {t('catalogs.drivers.birthDate')}
          </dt>
          <dd className="text-neutral-100">
            {formatDate(driver.birth_date, i18n.language)}
          </dd>
        </dl>
      )}
    </CatalogDetail>
  )
}

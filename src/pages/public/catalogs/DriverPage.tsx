import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { CatalogDetail } from '@/components/catalog/CatalogDetail'
import { useDriver } from '@/hooks/useDrivers'
import { countryName, formatDate } from '@/lib/format'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ErrorState } from '@/components/ui/ErrorState'
import { yearsSpan } from '@/components/catalog/yearsSpan'
import type { Fact } from '@/components/ui/FactStrip'

export function DriverPage() {
  const { t, i18n } = useTranslation()
  const { slug = '' } = useParams()
  const { data: driver, isPending, isError, error, refetch } = useDriver(slug)

  if (isError && isNotFound(error)) {
    return <NotFoundPage />
  }

  if (isError) {
    return (
      <ErrorState
        message={t('catalogs.error')}
        onRetry={() => refetch()}
        className="px-5 pt-36 pb-16"
      />
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

  const versions = driver.versions ?? []
  const country = driver.nationality
    ? countryName(driver.nationality, i18n.language)
    : null

  // Il Paese è già nell'etichetta: qui le Ferrari, gli anni e la data di nascita
  const highlights: Fact[] = [
    {
      key: 'versions',
      label: t('catalogs.drivers.works'),
      value: String(versions.length),
    },
    {
      key: 'years',
      label: t('catalogs.drivers.years'),
      value: yearsSpan(versions),
    },
    {
      key: 'birthDate',
      label: t('catalogs.drivers.birthDate'),
      value: driver.birth_date
        ? formatDate(driver.birth_date, i18n.language)
        : null,
    },
  ]

  return (
    <CatalogDetail
      back={{ to: '/piloti', label: t('catalogs.drivers.title') }}
      kind={t('catalogs.drivers.kind')}
      detail={country}
      name={`${driver.first_name} ${driver.last_name}`}
      highlights={highlights}
      versions={versions}
      // Nella carta, il campionato in cui ha corso quella Ferrari
      metaFor={(version) => version.racing?.[0]?.championship}
    />
  )
}

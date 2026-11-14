import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { CatalogDetail } from '@/components/catalog/CatalogDetail'
import { useDesigner } from '@/hooks/useDesigners'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ErrorState } from '@/components/ui/ErrorState'
import { countryName } from '@/lib/format'
import { yearsSpan } from '@/components/catalog/yearsSpan'
import type { Fact } from '@/components/ui/FactStrip'

export function DesignerPage() {
  const { t, i18n } = useTranslation()
  const { slug = '' } = useParams()
  const {
    data: designer,
    isPending,
    isError,
    error,
    refetch,
  } = useDesigner(slug)

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

  const versions = designer.versions ?? []
  const country = designer.country
    ? countryName(designer.country, i18n.language)
    : null
  const type = t(`catalogs.designers.types.${designer.type}`)

  // Il tipo e il Paese sono già nell'etichetta: qui solo quante Ferrari e in che anni
  const highlights: Fact[] = [
    {
      key: 'versions',
      label: t('catalogs.designers.works'),
      value: String(versions.length),
    },
    {
      key: 'years',
      label: t('catalogs.designers.years'),
      value: yearsSpan(versions),
    },
  ]

  return (
    <CatalogDetail
      back={{ to: '/designer', label: t('catalogs.designers.title') }}
      kind={type}
      detail={country}
      name={designer.name}
      highlights={highlights}
      versions={versions}
      metaFor={(version) =>
        version.designer_role
          ? t(`model.people.roles.${version.designer_role}`)
          : undefined
      }
    />
  )
}

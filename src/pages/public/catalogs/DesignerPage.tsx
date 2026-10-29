import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { CatalogDetail } from '@/components/catalog/CatalogDetail'
import { useDesigner } from '@/hooks/useDesigners'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ErrorState } from '@/components/ui/ErrorState'

export function DesignerPage() {
  const { t } = useTranslation()
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

  return (
    <CatalogDetail
      back={{ to: '/designer', label: t('catalogs.designers.title') }}
      eyebrow={[
        t(`catalogs.designers.types.${designer.type}`),
        designer.country,
      ]
        .filter(Boolean)
        .join(' · ')}
      name={designer.name}
      versions={designer.versions ?? []}
      metaFor={(version) =>
        version.designer_role
          ? t(`model.people.roles.${version.designer_role}`)
          : undefined
      }
    />
  )
}

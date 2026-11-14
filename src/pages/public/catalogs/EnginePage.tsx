import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { CatalogDetail } from '@/components/catalog/CatalogDetail'
import { useEngine } from '@/hooks/useEngines'
import { formatNumber } from '@/lib/format'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ErrorState } from '@/components/ui/ErrorState'
import type { Fact } from '@/components/ui/FactStrip'

export function EnginePage() {
  const { t, i18n } = useTranslation()
  const { id = '' } = useParams()
  const { data: engine, isPending, isError, error, refetch } = useEngine(id)

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

  const layout = t(`model.layouts.${engine.architecture}`, {
    cylinders: engine.cylinders,
  })

  const versions = engine.versions ?? []

  // I numeri protagonisti; quelli senza dato non compaiono
  const stars: Fact[] = [
    {
      key: 'displacement',
      label: t('model.displacement'),
      value: formatNumber(engine.displacement_cc, i18n.language),
      unit: 'cm³',
    },
    {
      key: 'cylinders',
      label: t('catalogs.engines.cylinders'),
      value: String(engine.cylinders),
    },
    {
      key: 'versions',
      label: t('catalogs.ferrari', { count: versions.length }),
      value: String(versions.length),
    },
  ]

  // La didascalia accanto
  const caption: Fact[] = [
    {
      key: 'architecture',
      label: t('model.sheet.rows.architecture'),
      value:
        engine.architecture === 'V' && engine.v_angle_deg !== null
          ? t('model.sheet.vAngle', { layout, angle: engine.v_angle_deg })
          : layout,
    },
    {
      key: 'aspiration',
      label: t('model.sheet.rows.aspiration'),
      value: t(`model.sheet.aspirations.${engine.aspiration}`),
    },
    {
      key: 'boreStroke',
      label: t('model.sheet.rows.boreStroke'),
      value:
        engine.bore_mm !== null && engine.stroke_mm !== null
          ? `${formatNumber(engine.bore_mm, i18n.language, 1)} × ${formatNumber(engine.stroke_mm, i18n.language, 1)} mm`
          : null,
    },
    {
      key: 'valves',
      label: t('model.sheet.rows.valves'),
      value:
        engine.valves_per_cylinder !== null
          ? String(engine.valves_per_cylinder)
          : null,
    },
  ]

  return (
    <CatalogDetail
      back={{ to: '/motori', label: t('catalogs.engines.title') }}
      kind={t('catalogs.engines.kind')}
      detail={engine.name}
      name={engine.code}
      description={engine.description}
      facts={{ stars, caption }}
      versions={versions}
    />
  )
}

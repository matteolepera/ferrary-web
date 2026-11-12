import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArchiveSelect } from '@/components/archive/ArchiveSelect'
import { CatalogIndex } from '@/components/catalog/CatalogIndex'
import { useEngines } from '@/hooks/useEngines'
import { formatNumber } from '@/lib/format'
import type { Engine } from '@/types/catalog'

/** La chiave dell'architettura di un motore, per il filtro: "V-12", "piatto-12" */
const layoutKey = (engine: Engine) =>
  `${engine.architecture}-${engine.cylinders}`

export function EnginesPage() {
  const { t, i18n } = useTranslation()
  const { data, isPending, isError, refetch } = useEngines()
  const [layout, setLayout] = useState('')

  // "V12", "12 cilindri boxer": l'architettura in parole, nella lingua del sito
  const layoutLabel = (engine: Engine) =>
    t(`model.layouts.${engine.architecture}`, { cylinders: engine.cylinders })

  // Le architetture presenti nel catalogo, una volta sola, dai cilindri più numerosi ai meno
  const layouts = [
    ...new Map(
      (data ?? []).map((engine) => [layoutKey(engine), engine]),
    ).values(),
  ].sort(
    (a, b) =>
      b.cylinders - a.cylinders || a.architecture.localeCompare(b.architecture),
  )

  const items = data
    ?.filter((engine) => !layout || layoutKey(engine) === layout)
    .map((engine) => ({
      id: engine.id,
      to: `/motori/${engine.id}`,
      code: engine.code,
      // Il nome comune se c'è, altrimenti l'architettura
      name: engine.name ?? layoutLabel(engine),
      meta: [
        engine.architecture === 'V' && engine.v_angle_deg !== null
          ? t('model.sheet.vAngle', {
              layout: layoutLabel(engine),
              angle: engine.v_angle_deg,
            })
          : layoutLabel(engine),
        `${formatNumber(engine.displacement_cc, i18n.language)} cm³`,
        // "turbo", "a compressore": l'aspirato, il caso più comune, non si scrive
        engine.aspiration !== 'aspirato' &&
          t(`model.aspirations.${engine.aspiration}`),
      ]
        .filter(Boolean)
        .join(' · '),
      count: engine.versions_count,
    }))

  return (
    <CatalogIndex
      title={t('catalogs.engines.title')}
      text={t('catalogs.engines.text')}
      items={items}
      isPending={isPending}
      isError={isError}
      onRetry={() => refetch()}
      countLabel={(count) => t('catalogs.engines.count', { count })}
      controls={
        <ArchiveSelect
          label={t('catalogs.engines.architecture')}
          prefix={t('catalogs.engines.architecture')}
          value={layout}
          onChange={setLayout}
          className="min-w-0 flex-1 pr-7 md:pr-8 lg:w-80 lg:flex-none"
        >
          <option value="">{t('catalogs.engines.allArchitectures')}</option>
          {layouts.map((engine) => (
            <option key={layoutKey(engine)} value={layoutKey(engine)}>
              {layoutLabel(engine)}
            </option>
          ))}
        </ArchiveSelect>
      }
    />
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { YSegments } from '@/components/ui/YSegments'
import { CatalogIndex } from '@/components/catalog/CatalogIndex'
import { useEngines } from '@/hooks/useEngines'
import { formatNumber } from '@/lib/format'
import type { Engine } from '@/types/catalog'

/** Il gruppo di un motore, per il filtro: "V12", "V8" per i motori a V, "piatto" e "in_linea" per gli altri */
const groupOf = (engine: Engine) =>
  engine.architecture === 'V' ? `V${engine.cylinders}` : engine.architecture

export function EnginesPage() {
  const { t, i18n } = useTranslation()
  const { data, isPending, isError, refetch } = useEngines()
  const [layout, setLayout] = useState('')

  // "V12", "12 cilindri boxer": l'architettura in parole, nella lingua del sito
  const layoutLabel = (engine: Engine) =>
    t(`model.layouts.${engine.architecture}`, { cylinders: engine.cylinders })

  // I gruppi presenti nel catalogo: prima i motori a V, dai cilindri più numerosi ai meno, poi boxer e in linea
  const groups = [
    ...new Map(
      (data ?? []).map((engine) => [groupOf(engine), engine]),
    ).values(),
  ].sort(
    (a, b) =>
      Number(b.architecture === 'V') - Number(a.architecture === 'V') ||
      b.cylinders - a.cylinders ||
      a.architecture.localeCompare(b.architecture),
  )

  const groupLabel = (engine: Engine) =>
    engine.architecture === 'V'
      ? `V${engine.cylinders}`
      : engine.architecture === 'piatto'
        ? t('catalogs.engines.flat')
        : t('catalogs.engines.inline')

  const items = data
    ?.filter((engine) => !layout || groupOf(engine) === layout)
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
        <YSegments
          label={t('catalogs.engines.architecture')}
          value={layout}
          onChange={setLayout}
          options={[
            { value: '', label: t('catalogs.all') },
            ...groups.map((engine) => ({
              value: groupOf(engine),
              label: groupLabel(engine),
            })),
          ]}
          className="pr-6 md:pr-7"
        />
      }
    />
  )
}

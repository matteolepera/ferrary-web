import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { CatalogDetail } from '@/components/catalog/CatalogDetail'
import { useEngine } from '@/hooks/useEngines'
import { formatNumber } from '@/lib/format'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function EnginePage() {
  const { t, i18n } = useTranslation()
  const { id = '' } = useParams()
  const { data: engine, isPending, isError, error } = useEngine(id)

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

  const layout = t(`model.layouts.${engine.architecture}`, {
    cylinders: engine.cylinders,
  })

  // Le caratteristiche del motore; quelle senza dato non compaiono
  const facts = [
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
      key: 'displacement',
      label: t('model.displacement'),
      value: `${formatNumber(engine.displacement_cc, i18n.language)} cm³`,
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
  ].filter((fact) => fact.value !== null)

  return (
    <CatalogDetail
      back={{ to: '/motori', label: t('catalogs.engines.title') }}
      eyebrow={engine.name ?? undefined}
      name={engine.code}
      versions={engine.versions ?? []}
    >
      <dl className="border-linea bg-linea mt-8 grid max-w-3xl grid-cols-2 gap-px border md:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.key} className="bg-notte px-4 py-4">
            <dt className="text-[0.625rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
              {fact.label}
            </dt>
            <dd className="mt-1.5 font-medium text-neutral-100">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      {engine.description && (
        <p className="mt-8 max-w-[62ch] text-[1.0625rem] leading-[1.75] text-neutral-300">
          {engine.description}
        </p>
      )}
    </CatalogDetail>
  )
}

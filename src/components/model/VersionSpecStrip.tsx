import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/lib/format'
import type { Powertrain, Version } from '@/types/catalog'

type VersionSpecStripProps = {
  /** Il dettaglio della versione; finché non arriva, la fascia mostra un segnaposto */
  version: Version | undefined
}

/**
 * I sette dati chiave della versione, in una fascia sotto l'apertura.
 */
export function VersionSpecStrip({ version }: VersionSpecStripProps) {
  const { t, i18n } = useTranslation()

  if (!version) {
    return (
      <div
        aria-hidden="true"
        className="border-linea bg-ombra h-48 animate-pulse border-y md:h-28"
      />
    )
  }

  const na = t('model.notAvailable')
  const number = (
    value: number | null | undefined,
    unit: string,
    decimals = 0,
  ) =>
    value == null
      ? na
      : `${formatNumber(value, i18n.language, decimals)} ${unit}`

  // "V8 turbo ibrido", "12 cilindri boxer", "Elettrico"
  const engineLabel = (powertrain: Powertrain | null | undefined) => {
    if (!powertrain) {
      return na
    }

    if (powertrain.type === 'elettrico') {
      return t('model.electric')
    }

    if (!powertrain.engine) {
      return na
    }

    const { architecture, cylinders, aspiration } = powertrain.engine
    const parts = [t(`model.layouts.${architecture}`, { cylinders })]

    if (aspiration !== 'aspirato') {
      parts.push(t(`model.aspirations.${aspiration}`))
    }

    if (powertrain.type === 'ibrido') {
      parts.push(t('model.hybrid'))
    }

    return parts.join(' ')
  }

  // Il numero di esemplari dice più del tipo di produzione, quando c'è
  const productionLabel = () => {
    const { type, units } = version.production

    if (units !== null) {
      return t('model.units', { count: units })
    }

    return type ? t(`model.productionTypes.${type}`) : na
  }

  const { specs, powertrain } = version
  const power = powertrain?.system.power_cv ?? powertrain?.combustion?.power_cv

  const items = [
    { key: 'engine', label: t('model.engine'), value: engineLabel(powertrain) },
    {
      key: 'power',
      label: t('model.power'),
      value: number(power, 'cv'),
      accent: true,
    },
    {
      key: 'acceleration',
      label: t('model.acceleration'),
      value: number(specs?.performance.zero_to_100_sec, 's', 2),
      accent: true,
    },
    {
      key: 'topSpeed',
      label: t('model.topSpeed'),
      value: number(specs?.performance.top_speed_kmh, 'km/h'),
      accent: true,
    },
    {
      key: 'displacement',
      label: t('model.displacement'),
      value: number(powertrain?.engine?.displacement_cc, 'cm³'),
    },
    {
      key: 'dryWeight',
      label: t('model.dryWeight'),
      value: number(specs?.weight.dry_kg, 'kg'),
    },
    {
      key: 'production',
      label: t('model.production'),
      value: productionLabel(),
    },
  ]

  return (
    <section
      aria-label={t('model.specsLabel')}
      className="border-linea bg-linea border-y"
    >
      {/* Lo spazio di un pixel tra le celle lascia vedere lo sfondo: sono le linee della griglia */}
      <dl className="mx-auto grid max-w-[1360px] grid-cols-2 gap-px md:grid-cols-4 lg:grid-cols-7">
        {items.map((item) => (
          <div
            key={item.key}
            className="bg-ombra px-5 py-5 last:col-span-2 md:px-6 md:py-6 lg:last:col-span-1"
          >
            <dt
              className={`text-[0.625rem] font-semibold tracking-[0.2em] uppercase ${
                item.accent ? 'text-rosso-acceso' : 'text-neutral-400'
              }`}
            >
              {item.label}
            </dt>
            <dd className="font-display mt-2 text-xl leading-tight font-extrabold tracking-[-0.02em] md:text-2xl">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

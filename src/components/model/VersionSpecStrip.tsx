import { type Fact, FactStrip } from '@/components/ui/FactStrip'
import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/lib/format'
import type { Powertrain, Version, VehicleType } from '@/types/catalog'

type VersionSpecStripProps = {
  /** Il dettaglio della versione; finché non arriva, la fascia mostra un segnaposto */
  version: Version | undefined
}

/** Le auto da corsa: per loro contano i risultati, non la velocità di punta */
const RACING_TYPES: VehicleType[] = ['f1', 'prototipo', 'gt_corsa']

/**
 * I dati chiave della versione, come la didascalia di un'opera:
 * tre numeri protagonisti, grandi, e il resto più piccolo accanto.
 * Un dato mancante non compare.
 */
export function VersionSpecStrip({ version }: VersionSpecStripProps) {
  const { t, i18n } = useTranslation()

  if (!version) {
    return (
      <div
        aria-hidden="true"
        className="border-linea h-56 animate-pulse border-y md:h-36"
      />
    )
  }

  /** Il solo numero, nella lingua del sito; l'unità la mette la fascia */
  const figure = (value: number | null | undefined, decimals = 0) =>
    value == null ? null : formatNumber(value, i18n.language, decimals)

  /** Un numero con la sua unità, per la didascalia */
  const withUnit = (value: number | null | undefined, unit: string) =>
    value == null ? null : `${formatNumber(value, i18n.language)} ${unit}`

  // "V8 turbo ibrido", "12 cilindri boxer", "Elettrico"
  const engineLabel = (powertrain: Powertrain | null | undefined) => {
    if (!powertrain) return null
    if (powertrain.type === 'elettrico') return t('model.electric')
    if (!powertrain.engine) return null

    const { architecture, cylinders, aspiration } = powertrain.engine
    const parts = [t(`model.layouts.${architecture}`, { cylinders })]

    if (aspiration !== 'aspirato')
      parts.push(t(`model.aspirations.${aspiration}`))
    if (powertrain.type === 'ibrido') parts.push(t('model.hybrid'))

    return parts.join(' ')
  }

  const { specs, powertrain, years, production } = version
  const engine: Fact = {
    key: 'engine',
    label: t('model.engine'),
    value: engineLabel(powertrain),
  }
  const displacement: Fact = {
    key: 'displacement',
    label: t('model.displacement'),
    value: withUnit(powertrain?.engine?.displacement_cc, 'cm³'),
  }

  let primary: Fact[]
  let secondary: Fact[]

  if (RACING_TYPES.includes(version.vehicle_type)) {
    // Le auto da corsa: protagonisti i risultati, sommati sui campionati
    const racing = version.racing ?? []
    const total = (field: 'races' | 'wins') =>
      racing.some((record) => record[field] != null)
        ? racing.reduce((sum, record) => sum + (record[field] ?? 0), 0)
        : null
    const titles = racing.reduce(
      (sum, record) =>
        sum + (record.drivers_titles ?? 0) + (record.constructors_titles ?? 0),
      0,
    )
    const single = years.end === null || years.end === years.start

    // I risultati: protagonisti se maggiori di zero, nella didascalia se zero
    const results: Fact[] = [
      {
        key: 'wins',
        label: t('model.racing.wins'),
        value: figure(total('wins')),
      },
      {
        key: 'titles',
        label: t('model.racing.totalTitles'),
        value: String(titles),
      },
      {
        key: 'races',
        label: t('model.racing.races'),
        value: figure(total('races')),
      },
    ]
    const counts = (item: Fact) => item.value !== null && item.value !== '0'

    primary = results.filter(counts)
    secondary = [
      engine,
      displacement,
      {
        key: 'seasons',
        label: t('model.racing.season'),
        value: single ? String(years.start) : `${years.start}–${years.end}`,
      },
      // Le vittorie a zero restano un'informazione, ma piccola. I titoli a zero invece non si nominano
      ...results.filter((item) => item.key === 'wins' && item.value === '0'),
    ]
  } else {
    // Il numero di esemplari dice più del tipo di produzione, quando c'è
    const productionLabel =
      production.units !== null
        ? t('model.units', { count: production.units })
        : production.type
          ? t(`model.productionTypes.${production.type}`)
          : null

    primary = [
      {
        key: 'power',
        label: t('model.power'),
        value: figure(
          powertrain?.system.power_cv ?? powertrain?.combustion?.power_cv,
        ),
        unit: 'cv',
      },
      {
        key: 'acceleration',
        label: t('model.acceleration'),
        value: figure(specs?.performance.zero_to_100_sec, 2),
        unit: 's',
      },
      {
        key: 'topSpeed',
        label: t('model.topSpeed'),
        value: figure(specs?.performance.top_speed_kmh),
        unit: 'km/h',
      },
    ]
    secondary = [
      engine,
      displacement,
      {
        key: 'dryWeight',
        label: t('model.dryWeight'),
        value: withUnit(specs?.weight.dry_kg, 'kg'),
      },
      {
        key: 'production',
        label: t('model.production'),
        value: productionLabel,
      },
    ]
  }

  return (
    <FactStrip
      label={t('model.specsLabel')}
      stars={primary}
      caption={secondary}
    />
  )
}

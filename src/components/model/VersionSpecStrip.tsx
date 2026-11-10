import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/lib/format'
import type { Powertrain, Version, VehicleType } from '@/types/catalog'

type VersionSpecStripProps = {
  /** Il dettaglio della versione; finché non arriva, la fascia mostra un segnaposto */
  version: Version | undefined
}

/** Le auto da corsa: per loro contano i risultati, non la velocità di punta */
const RACING_TYPES: VehicleType[] = ['f1', 'prototipo', 'gt_corsa']

/** Un dato: il valore, e per i numeri protagonisti l'unità a parte, più piccola */
type Item = { key: string; label: string; value: string | null; unit?: string }

/** Solo i dati che esistono */
const present = (items: Item[]) =>
  items.filter((item): item is Item & { value: string } => item.value !== null)

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
  const engine: Item = {
    key: 'engine',
    label: t('model.engine'),
    value: engineLabel(powertrain),
  }
  const displacement: Item = {
    key: 'displacement',
    label: t('model.displacement'),
    value: withUnit(powertrain?.engine?.displacement_cc, 'cm³'),
  }

  let primary: Item[]
  let secondary: Item[]

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
    const results: Item[] = [
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
    const counts = (item: Item) => item.value !== null && item.value !== '0'

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

  const stars = present(primary)
  const caption = present(secondary)

  if (stars.length === 0 && caption.length === 0) {
    return null
  }

  return (
    <section
      aria-label={t('model.specsLabel')}
      className="border-linea border-y"
    >
      {/* Telefono e tablet: i protagonisti in fila, la didascalia sotto. Dal desktop: tutto su una riga */}
      <div className="mx-auto max-w-[1360px] px-5 md:px-10 lg:flex">
        {stars.length > 0 && (
          <dl
            className="divide-linea grid grid-cols-[repeat(var(--stars),minmax(0,1fr))] divide-x"
            // I protagonisti si dividono lo spazio: dal desktop, uno ciascuno, e la didascalia un po' di più
            style={
              {
                '--stars': stars.length,
                flex: `${stars.length} 1 0%`,
              } as CSSProperties
            }
          >
            {stars.map((item) => (
              <div
                key={item.key}
                className="py-6 pr-3 pl-3 first:pl-0 md:py-9 md:pr-8 md:pl-8"
              >
                <dt className="flex items-center gap-2.5 text-[0.5625rem] font-semibold tracking-[0.16em] text-neutral-400 uppercase md:text-[0.625rem] md:tracking-[0.22em]">
                  {/* Il segno rosso obliquo, come nella barra della Y */}
                  <span
                    aria-hidden="true"
                    className="bg-rosso-acceso h-[3px] w-2.5 shrink-0 -skew-x-[28deg] shadow-[0_0_8px_rgba(255,59,48,0.6)] md:w-3.5"
                  />
                  {item.label}
                </dt>
                <dd className="font-display mt-3 text-[2rem] leading-[0.9] font-extrabold tracking-[-0.04em] md:mt-4 md:text-5xl lg:text-[4rem]">
                  {item.value}
                  {item.unit && (
                    <span className="font-sans text-[0.6875rem] font-semibold tracking-[0.02em] text-neutral-400 md:text-[0.9375rem]">
                      {' '}
                      {item.unit}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {caption.length > 0 && (
          <dl
            className={[
              'grid grid-cols-2 content-center gap-x-5 gap-y-4 py-5 md:gap-x-7 md:py-6',
              'lg:border-linea lg:border-l lg:py-8 lg:pl-10',
              // Sotto i protagonisti, una linea li separa; dal desktop la linea è a sinistra
              stars.length > 0 ? 'border-linea border-t lg:border-t-0' : '',
            ].join(' ')}
            style={{ flex: '1.25 1 0%' }}
          >
            {caption.map((item) => (
              <div key={item.key}>
                <dt className="text-[0.625rem] font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                  {item.label}
                </dt>
                <dd className="font-display mt-1.5 text-[0.9375rem] font-bold tracking-[-0.02em] md:text-lg">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}

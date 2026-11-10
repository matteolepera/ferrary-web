import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/lib/format'
import type { Powertrain, Version, VehicleType } from '@/types/catalog'

type VersionSpecStripProps = {
  /** Il dettaglio della versione; finché non arriva, la fascia mostra un segnaposto */
  version: Version | undefined
}

/** Le auto da corsa: per loro contano le stagioni e i risultati, non la velocità di punta */
const RACING_TYPES: VehicleType[] = ['f1', 'prototipo', 'gt_corsa']

type Item = {
  key: string
  label: string
  value: string | null
  accent?: boolean
}

/**
 * I dati chiave della versione, in una fascia sotto l'apertura.
 * Mostra solo quelli che esistono: un dato mancante non compare, invece di diventare "n.d.".
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

  /** Un numero con la sua unità, oppure niente */
  const number = (
    value: number | null | undefined,
    unit: string,
    decimals = 0,
  ) =>
    value == null
      ? null
      : `${formatNumber(value, i18n.language, decimals)} ${unit}`

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
  const engine = {
    key: 'engine',
    label: t('model.engine'),
    value: engineLabel(powertrain),
  }
  const displacement = {
    key: 'displacement',
    label: t('model.displacement'),
    value: number(powertrain?.engine?.displacement_cc, 'cm³'),
  }

  let items: Item[]

  if (RACING_TYPES.includes(version.vehicle_type)) {
    // Le auto da corsa: le stagioni e i totali dei risultati sportivi
    const racing = version.racing ?? []
    // La somma di un campo, solo se almeno un campionato lo riporta
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

    items = [
      engine,
      displacement,
      {
        key: 'seasons',
        label: t('model.racing.season'),
        value: single ? String(years.start) : `${years.start}–${years.end}`,
      },
      {
        key: 'races',
        label: t('model.racing.races'),
        value: total('races')?.toString() ?? null,
      },
      {
        key: 'wins',
        label: t('model.racing.wins'),
        value: total('wins')?.toString() ?? null,
        accent: true,
      },
      // I titoli solo se ce ne sono: uno zero, in prima fila, direbbe poco
      {
        key: 'titles',
        label: t('model.racing.totalTitles'),
        value: titles > 0 ? String(titles) : null,
        accent: true,
      },
    ]
  } else {
    // Il numero di esemplari dice più del tipo di produzione, quando c'è
    const productionLabel =
      production.units !== null
        ? t('model.units', { count: production.units })
        : production.type
          ? t(`model.productionTypes.${production.type}`)
          : null

    items = [
      engine,
      {
        key: 'power',
        label: t('model.power'),
        value: number(
          powertrain?.system.power_cv ?? powertrain?.combustion?.power_cv,
          'cv',
        ),
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
      displacement,
      {
        key: 'dryWeight',
        label: t('model.dryWeight'),
        value: number(specs?.weight.dry_kg, 'kg'),
      },
      {
        key: 'production',
        label: t('model.production'),
        value: productionLabel,
      },
    ]
  }

  // Solo i dati che esistono
  const shown = items.filter(
    (item): item is Item & { value: string } => item.value !== null,
  )

  if (shown.length === 0) {
    return null
  }

  return (
    <section
      aria-label={t('model.specsLabel')}
      className="border-linea bg-linea border-y"
    >
      {/*
        Lo spazio di un pixel tra le celle lascia vedere lo sfondo: sono le linee della griglia.
        Le celle crescono fino a riempire ogni riga, qualunque sia il loro numero: niente buchi
      */}
      <dl className="mx-auto flex max-w-[1360px] flex-wrap gap-px">
        {shown.map((item) => (
          <div
            key={item.key}
            className="bg-ombra flex-1 basis-[calc(50%-1px)] px-5 py-5 md:basis-[calc(25%-1px)] md:px-6 md:py-6 lg:basis-0"
            style={{ '--cells': shown.length } as CSSProperties}
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

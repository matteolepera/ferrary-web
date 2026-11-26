import {
  bodyTypes,
  brakeTypes,
  chassisMaterials,
  drivetrains,
  gearboxTypes,
  productionTypes,
  vehicleTypes,
  yearsOf,
  type Option,
} from '@/components/admin/versions/options'
import {
  isFieldDisabled,
  powertrainKind,
  powertrainValues,
  type PowertrainField,
} from '@/components/admin/versions/powertrain'
import type { VersionSection } from '@/components/admin/versions/versionSections'
import { formatLap, formatNumber } from '@/lib/format'
import type { AdminEngine, AdminVersion, VersionSpecs } from '@/types/admin'

/** Un dato da leggere nella pagina: null se manca. wide occupa tutta la riga (i testi lunghi) */
export type SummaryItem = {
  label: string
  value: string | null
  wide?: boolean
}

/** Un numero con la sua unità, all'italiana: "4710 mm", "2,9 s" */
function amount(value: number | null | undefined, unit?: string, decimals = 0) {
  if (value === null || value === undefined) return null
  const number = formatNumber(value, 'it', decimals)
  return unit ? `${number} ${unit}` : number
}

/** L'etichetta di una scelta, o null se non è stata fatta */
function option<T extends string>(
  options: Option<T>[],
  value: T | null | undefined,
) {
  return options.find((item) => item.value === value)?.label ?? null
}

/** Un testo, o null se è vuoto */
function text(value: string | null | undefined) {
  return value && value.trim() !== '' ? value : null
}

/** I numeri della motorizzazione, nell'ordine dei campi */
const powertrainNumbers: {
  field: PowertrainField
  label: string
  unit?: string
  decimals?: number
}[] = [
  { field: 'ice_power_cv', label: 'Potenza', unit: 'CV' },
  { field: 'ice_torque_nm', label: 'Coppia', unit: 'Nm' },
  { field: 'ice_max_rpm', label: 'Regime massimo', unit: 'giri/min' },
  {
    field: 'fuel_consumption_l100',
    label: 'Consumo',
    unit: 'l/100 km',
    decimals: 1,
  },
  { field: 'electric_power_cv', label: 'Potenza elettrica', unit: 'CV' },
  { field: 'electric_motors_count', label: 'Motori elettrici' },
  { field: 'battery_kwh', label: 'Batteria', unit: 'kWh', decimals: 1 },
  { field: 'electric_range_km', label: 'Autonomia elettrica', unit: 'km' },
  { field: 'system_power_cv', label: 'Potenza complessiva', unit: 'CV' },
  { field: 'system_torque_nm', label: 'Coppia complessiva', unit: 'Nm' },
]

/** I numeri della scheda tecnica, nell'ordine dei campi */
const specsNumbers: {
  field: keyof VersionSpecs
  label: string
  unit: string
  decimals?: number
}[] = [
  { field: 'length_mm', label: 'Lunghezza', unit: 'mm' },
  { field: 'width_mm', label: 'Larghezza', unit: 'mm' },
  { field: 'height_mm', label: 'Altezza', unit: 'mm' },
  { field: 'wheelbase_mm', label: 'Passo', unit: 'mm' },
  { field: 'dry_weight_kg', label: 'Peso a secco', unit: 'kg' },
  { field: 'weight_front_pct', label: 'Peso all’anteriore', unit: '%' },
  { field: 'top_speed_kmh', label: 'Velocità massima', unit: 'km/h' },
  { field: 'zero_to_100_sec', label: '0-100 km/h', unit: 's', decimals: 2 },
  { field: 'zero_to_200_sec', label: '0-200 km/h', unit: 's', decimals: 2 },
]

/**
 * La motorizzazione da leggere: solo i dati che hanno senso con il suo tipo.
 * Una termica non mostra la batteria, un'elettrica non mostra il consumo.
 * Senza motorizzazione, nessun dato.
 */
function powertrainSummary(
  version: AdminVersion,
  engines: AdminEngine[] | undefined,
): SummaryItem[] {
  const values = powertrainValues(version.powertrain)
  const kind = powertrainKind(values)
  if (!kind) return []

  const powertrain = version.powertrain
  const items: SummaryItem[] = [{ label: 'Tipo', value: kind }]

  if (powertrain?.engine_id) {
    const engine = engines?.find((item) => item.id === powertrain.engine_id)
    items.push({
      label: 'Motore',
      value: engine
        ? engine.name
          ? `${engine.code} · ${engine.name}`
          : engine.code
        : null,
    })
  }

  for (const { field, label, unit, decimals } of powertrainNumbers) {
    if (isFieldDisabled(field, values)) continue
    const value = powertrain?.[field]
    items.push({
      label,
      value: amount(typeof value === 'number' ? value : null, unit, decimals),
    })
  }

  // Il cambio con le sue marce, insieme: "Doppia frizione, 8 marce"
  const gearbox = option(gearboxTypes, powertrain?.gearbox_type)
  const gears = powertrain?.gears ? `${powertrain.gears} marce` : null
  items.push({
    label: 'Cambio',
    value: [gearbox, gears].filter(Boolean).join(', ') || null,
  })
  items.push({
    label: 'Trazione',
    value: option(drivetrains, powertrain?.drivetrain),
  })

  return items
}

function specsSummary(version: AdminVersion): SummaryItem[] {
  const specs = version.specs
  const lap = specs?.fiorano_lap_sec

  return [
    ...specsNumbers.map(({ field, label, unit, decimals }) => {
      const value = specs?.[field]
      return {
        label,
        value: amount(typeof value === 'number' ? value : null, unit, decimals),
      }
    }),
    {
      label: 'Materiale del telaio',
      value: option(chassisMaterials, specs?.chassis_material),
    },
    { label: 'Freni', value: option(brakeTypes, specs?.brakes) },
    // Il giro come lo si legge sul cronometro: 79 secondi diventano "1:19"
    { label: 'Giro di Fiorano', value: lap ? formatLap(lap, 'it') : null },
  ]
}

/**
 * I dati di una sezione della versione, pronti da leggere nella pagina.
 * La motorizzazione ha bisogno dei motori del catalogo, per scrivere il nome del motore.
 */
export function sectionSummary(
  section: VersionSection,
  version: AdminVersion,
  engines?: AdminEngine[],
): SummaryItem[] {
  switch (section) {
    case 'identita':
      return [
        { label: 'Nome', value: text(version.name) },
        {
          label: 'Tipo di veicolo',
          value: option(vehicleTypes, version.vehicle_type),
        },
        { label: 'Carrozzeria', value: option(bodyTypes, version.body_type) },
        { label: 'Codice di progetto', value: text(version.project_code) },
        { label: 'Posti', value: amount(version.seats) },
        { label: 'Slug', value: text(version.slug) },
      ]
    case 'produzione':
      return [
        { label: 'Anni', value: yearsOf(version) },
        {
          label: 'Tipo di produzione',
          value: option(productionTypes, version.production_type),
        },
        { label: 'Esemplari prodotti', value: amount(version.units_produced) },
        { label: 'Posizione', value: amount(version.sort_order) },
      ]
    case 'descrizione':
      return [
        {
          label: 'In italiano',
          value: text(version.description.it),
          wide: true,
        },
        {
          label: 'In inglese',
          value: text(version.description.en),
          wide: true,
        },
      ]
    case 'motorizzazione':
      return powertrainSummary(version, engines)
    case 'scheda':
      return specsSummary(version)
  }
}

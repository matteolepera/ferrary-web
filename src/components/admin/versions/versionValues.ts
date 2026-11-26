import {
  powertrainValues,
  toPowertrainPayload,
  type PowertrainValues,
} from '@/components/admin/versions/powertrain'
import {
  specsValues,
  toSpecsPayload,
  type SpecsValues,
} from '@/components/admin/versions/specs'
import type {
  AdminVersion,
  BodyType,
  ProductionType,
  VehicleType,
  VersionPayload,
} from '@/types/admin'

/** I campi della versione, come testo per il modulo (tranne l'interruttore "in produzione") */
export type VersionValues = {
  name: string
  slug: string
  vehicle_type: VehicleType | ''
  body_type: BodyType | ''
  project_code: string
  seats: string
  year_start: string
  year_end: string
  in_production: boolean
  production_type: ProductionType | ''
  units_produced: string
  sort_order: string
  description_it: string
  description_en: string
}

/** Tutto lo stato di una versione nel modulo: i suoi campi, la motorizzazione e la scheda tecnica */
export type VersionDraft = {
  values: VersionValues
  powertrain: PowertrainValues
  specs: SpecsValues
}

/** I campi numerici sono testo nel modulo: vuoto diventa null, il resto un numero */
export function toNumber(value: string) {
  return value.trim() === '' ? null : Number(value)
}

/** Un numero o null, come testo per un campo */
function toText(value: number | null | undefined) {
  return value === null || value === undefined ? '' : String(value)
}

/** Lo stato di partenza: quello della versione salvata, o vuoto per una nuova */
export function versionDraft(version?: AdminVersion): VersionDraft {
  return {
    values: {
      name: version?.name ?? '',
      slug: version?.slug ?? '',
      vehicle_type: version?.vehicle_type ?? '',
      body_type: version?.body_type ?? '',
      project_code: version?.project_code ?? '',
      seats: toText(version?.seats),
      year_start: toText(version?.year_start),
      year_end: toText(version?.year_end),
      in_production: version?.in_production ?? false,
      production_type: version?.production_type ?? '',
      units_produced: toText(version?.units_produced),
      sort_order: toText(version?.sort_order ?? 1),
      description_it: version?.description.it ?? '',
      description_en: version?.description.en ?? '',
    },
    powertrain: powertrainValues(version?.powertrain),
    specs: specsValues(version?.specs),
  }
}

/**
 * Quello che il backend riceve: la versione intera, ogni volta.
 * Una finestra che cambia solo una sezione manda le altre così come sono salvate.
 */
export function toVersionPayload({
  values,
  powertrain,
  specs,
}: VersionDraft): VersionPayload {
  return {
    name: values.name.trim(),
    slug: values.slug.trim() || undefined,
    // Il campo vuoto arriva al backend come null, e lui risponde "obbligatorio"
    vehicle_type: (values.vehicle_type || null) as VehicleType,
    body_type: values.body_type || null,
    project_code: values.project_code.trim() || null,
    seats: toNumber(values.seats),
    year_start: toNumber(values.year_start) as number,
    // In produzione non c'è un anno di fine
    year_end: values.in_production ? null : toNumber(values.year_end),
    in_production: values.in_production,
    production_type: values.production_type || null,
    units_produced: toNumber(values.units_produced),
    sort_order: toNumber(values.sort_order) ?? 1,
    description: { it: values.description_it, en: values.description_en },
    powertrain: toPowertrainPayload(powertrain),
    specs: toSpecsPayload(specs),
  }
}

/** Cambia un campo della versione, con il tipo giusto per ogni campo */
export type VersionUpdate = <K extends keyof VersionValues>(
  field: K,
  value: VersionValues[K],
) => void

/** Le props dei campi di una sezione: i valori, come cambiarli e gli errori del backend */
export type VersionFieldsProps = {
  values: VersionValues
  onChange: VersionUpdate
  errors: Record<string, string[]> | null
}

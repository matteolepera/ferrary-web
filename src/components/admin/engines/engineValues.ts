import type {
  AdminEngine,
  Aspiration,
  EngineArchitecture,
  EnginePayload,
} from '@/types/admin'

/** I campi del motore come li tiene il modulo: i numeri come testo, le scelte vuote come '' */
export type EngineValues = {
  code: string
  name: string
  architecture: EngineArchitecture | ''
  v_angle_deg: string
  cylinders: string
  displacement_cc: string
  bore_mm: string
  stroke_mm: string
  valves_per_cylinder: string
  aspiration: Aspiration | ''
  description_it: string
  description_en: string
}

/** Cambia un campo del motore, con il tipo giusto per ogni campo */
export type EngineUpdate = <K extends keyof EngineValues>(
  field: K,
  value: EngineValues[K],
) => void

/** Le props dei campi di una sezione del motore */
export type EngineFieldsProps = {
  values: EngineValues
  onChange: EngineUpdate
  errors: Record<string, string[]> | null
}

function toNumber(value: string) {
  return value.trim() === '' ? null : Number(value)
}

function toText(value: number | null | undefined) {
  return value === null || value === undefined ? '' : String(value)
}

/** Lo stato di partenza: quello del motore salvato, o vuoto per uno nuovo */
export function engineValues(engine?: AdminEngine): EngineValues {
  return {
    code: engine?.code ?? '',
    name: engine?.name ?? '',
    architecture: engine?.architecture ?? '',
    v_angle_deg: toText(engine?.v_angle_deg),
    cylinders: toText(engine?.cylinders),
    displacement_cc: toText(engine?.displacement_cc),
    bore_mm: toText(engine?.bore_mm),
    stroke_mm: toText(engine?.stroke_mm),
    valves_per_cylinder: toText(engine?.valves_per_cylinder),
    aspiration: engine?.aspiration ?? '',
    description_it: engine?.description.it ?? '',
    description_en: engine?.description.en ?? '',
  }
}

/** Quello che il backend riceve: il motore intero, ogni volta */
export function toEnginePayload(values: EngineValues): EnginePayload {
  return {
    code: values.code.trim(),
    name: values.name.trim() || null,
    architecture: values.architecture || null,
    // L'angolo esiste solo per i motori a V
    v_angle_deg:
      values.architecture === 'V' ? toNumber(values.v_angle_deg) : null,
    cylinders: toNumber(values.cylinders),
    displacement_cc: toNumber(values.displacement_cc),
    bore_mm: toNumber(values.bore_mm),
    stroke_mm: toNumber(values.stroke_mm),
    valves_per_cylinder: toNumber(values.valves_per_cylinder),
    aspiration: values.aspiration || null,
    description: { it: values.description_it, en: values.description_en },
  }
}

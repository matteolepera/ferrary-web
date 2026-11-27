import type { EngineSection } from '@/components/admin/engines/engineSections'
import {
  architectures,
  aspirations,
  displacement,
} from '@/components/admin/engines/options'
import { labelOf } from '@/components/admin/versions/options'
import type { SummaryItem } from '@/components/admin/versions/versionSummary'
import { formatNumber } from '@/lib/format'
import type { AdminEngine } from '@/types/admin'

/** Un testo, o null se è vuoto */
function text(value: string | null | undefined) {
  return value && value.trim() !== '' ? value : null
}

/** Un numero con la sua unità, all'italiana: "94 mm", "86,5 mm" */
function amount(value: number | null, unit?: string, decimals = 0) {
  if (value === null) return null
  const number = formatNumber(value, 'it', decimals)
  return unit ? `${number} ${unit}` : number
}

/** I dati di una sezione del motore, pronti da leggere nella pagina */
export function engineSectionSummary(
  section: EngineSection,
  engine: AdminEngine,
): SummaryItem[] {
  if (section === 'descrizione') {
    return [
      { label: 'In italiano', value: text(engine.description.it), wide: true },
      { label: 'In inglese', value: text(engine.description.en), wide: true },
    ]
  }

  return [
    { label: 'Codice', value: engine.code },
    // Il nome è facoltativo: se manca non è un dato da completare
    { label: 'Nome', value: text(engine.name) ?? 'Nessuno' },
    {
      label: 'Architettura',
      value: labelOf(architectures, engine.architecture),
    },
    // L'angolo esiste solo per i motori a V: per gli altri non lo mostriamo
    ...(engine.architecture === 'V'
      ? [
          {
            label: 'Angolo della V',
            value:
              engine.v_angle_deg === null ? null : `${engine.v_angle_deg}°`,
          },
        ]
      : []),
    { label: 'Cilindri', value: amount(engine.cylinders) },
    { label: 'Cilindrata', value: displacement(engine.displacement_cc) },
    { label: 'Alesaggio', value: amount(engine.bore_mm, 'mm', 2) },
    { label: 'Corsa', value: amount(engine.stroke_mm, 'mm', 2) },
    {
      label: 'Valvole per cilindro',
      value: amount(engine.valves_per_cylinder),
    },
    { label: 'Aspirazione', value: labelOf(aspirations, engine.aspiration) },
  ]
}

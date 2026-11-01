import type { Option } from '@/components/admin/versions/options'
import type { AdminEngine, Aspiration, EngineArchitecture } from '@/types/admin'
import { formatNumber } from '@/lib/format'

export const architectures: Option<EngineArchitecture>[] = [
  { value: 'V', label: 'A V' },
  { value: 'in_linea', label: 'In linea' },
  { value: 'piatto', label: 'Piatto' },
]

export const aspirations: Option<Aspiration>[] = [
  { value: 'aspirato', label: 'Aspirato' },
  { value: 'turbo', label: 'Turbo' },
  { value: 'compressore', label: 'Compressore' },
]

/** Il motore in poche parole, come lo direbbe un appassionato: "V12 a 65°", "4 in linea", "12 piatto" */
export function engineSummary(
  engine: Pick<AdminEngine, 'architecture' | 'cylinders' | 'v_angle_deg'>,
) {
  if (engine.architecture === 'V') {
    return engine.v_angle_deg
      ? `V${engine.cylinders} a ${engine.v_angle_deg}°`
      : `V${engine.cylinders}`
  }

  return `${engine.cylinders} ${engine.architecture === 'in_linea' ? 'in linea' : 'piatto'}`
}

/** La cilindrata come la si legge: 3.990 cm³ */
export function displacement(cc: number) {
  return `${formatNumber(cc, 'it', 0)} cm³`
}

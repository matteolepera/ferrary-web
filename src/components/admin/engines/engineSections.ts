/** Le sezioni del motore che si modificano in una finestra */
export type EngineSection = 'dati' | 'descrizione'

type SectionInfo = {
  title: string
  /** Il pulsante della finestra: dice cosa si salva */
  submitLabel: string
  /** I campi del backend della sezione: "description" vale per tutti i "description.qualcosa" */
  fields: string[]
}

export const engineSections: Record<EngineSection, SectionInfo> = {
  dati: {
    title: 'Dati tecnici',
    submitLabel: 'Salva i dati tecnici',
    fields: [
      'code',
      'name',
      'architecture',
      'v_angle_deg',
      'cylinders',
      'displacement_cc',
      'bore_mm',
      'stroke_mm',
      'valves_per_cylinder',
      'aspiration',
    ],
  },
  descrizione: {
    title: 'Descrizione',
    submitLabel: 'Salva la descrizione',
    fields: ['description'],
  },
}

/** La sezione di un errore del backend: "description.it" è della descrizione */
export function engineSectionOf(key: string): EngineSection | undefined {
  return (Object.keys(engineSections) as EngineSection[]).find((section) =>
    engineSections[section].fields.some(
      (field) => key === field || key.startsWith(`${field}.`),
    ),
  )
}

/** Le sezioni della versione che si modificano in una finestra */
export type VersionSection =
  'identita' | 'produzione' | 'descrizione' | 'motorizzazione' | 'scheda'

type SectionInfo = {
  title: string
  /** Il pulsante della finestra: dice cosa si salva */
  submitLabel: string
  /** lg per le sezioni con tanti campi */
  size: 'md' | 'lg'
  /** I campi del backend della sezione: "specs" vale per tutti gli "specs.qualcosa" */
  fields: string[]
}

export const versionSections: Record<VersionSection, SectionInfo> = {
  identita: {
    title: 'Identità',
    submitLabel: 'Salva l’identità',
    size: 'md',
    fields: [
      'name',
      'slug',
      'vehicle_type',
      'body_type',
      'project_code',
      'seats',
    ],
  },
  produzione: {
    title: 'Anni e produzione',
    submitLabel: 'Salva anni e produzione',
    size: 'md',
    fields: [
      'year_start',
      'year_end',
      'in_production',
      'production_type',
      'units_produced',
      'sort_order',
    ],
  },
  descrizione: {
    title: 'Descrizione',
    submitLabel: 'Salva la descrizione',
    size: 'md',
    fields: ['description'],
  },
  motorizzazione: {
    title: 'Motorizzazione',
    submitLabel: 'Salva la motorizzazione',
    size: 'lg',
    fields: ['powertrain'],
  },
  scheda: {
    title: 'Scheda tecnica',
    submitLabel: 'Salva la scheda tecnica',
    size: 'lg',
    fields: ['specs'],
  },
}

/** La sezione di un errore del backend: "specs.top_speed_kmh" è della scheda tecnica */
export function sectionOf(key: string): VersionSection | undefined {
  return (Object.keys(versionSections) as VersionSection[]).find((section) =>
    versionSections[section].fields.some(
      (field) => key === field || key.startsWith(`${field}.`),
    ),
  )
}

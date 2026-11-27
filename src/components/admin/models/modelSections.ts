/** Le sezioni del modello che si modificano in una finestra */
export type ModelSection = 'dati' | 'descrizione'

type SectionInfo = {
  title: string
  /** Il pulsante della finestra: dice cosa si salva */
  submitLabel: string
  /** I campi del backend della sezione: "description" vale per tutti i "description.qualcosa" */
  fields: string[]
}

export const modelSections: Record<ModelSection, SectionInfo> = {
  dati: {
    title: 'Dati principali',
    submitLabel: 'Salva i dati principali',
    fields: ['name', 'slug', 'category_id', 'predecessor_id'],
  },
  descrizione: {
    title: 'Descrizione',
    submitLabel: 'Salva la descrizione',
    fields: ['description'],
  },
}

/** La sezione di un errore del backend: "description.it" è della descrizione */
export function modelSectionOf(key: string): ModelSection | undefined {
  return (Object.keys(modelSections) as ModelSection[]).find((section) =>
    modelSections[section].fields.some(
      (field) => key === field || key.startsWith(`${field}.`),
    ),
  )
}

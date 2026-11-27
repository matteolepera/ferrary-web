import type { ModelOption } from '@/components/admin/models/PredecessorPicker'
import type { AdminCarModel, ModelPayload } from '@/types/admin'

/** I campi del modello come li tiene il modulo: la famiglia come testo, il predecessore come scelta */
export type ModelValues = {
  name: string
  slug: string
  category_id: string
  predecessor: ModelOption | null
  description_it: string
  description_en: string
}

/** Cambia un campo del modello, con il tipo giusto per ogni campo */
export type ModelUpdate = <K extends keyof ModelValues>(
  field: K,
  value: ModelValues[K],
) => void

/** Le props dei campi di una sezione del modello */
export type ModelFieldsProps = {
  values: ModelValues
  onChange: ModelUpdate
  errors: Record<string, string[]> | null
}

/** Lo stato di partenza: quello del modello salvato, o vuoto per uno nuovo */
export function modelValues(model?: AdminCarModel): ModelValues {
  return {
    name: model?.name ?? '',
    slug: model?.slug ?? '',
    category_id: model ? String(model.category_id) : '',
    predecessor: model?.predecessor
      ? { id: model.predecessor.id, name: model.predecessor.name }
      : null,
    description_it: model?.description.it ?? '',
    description_en: model?.description.en ?? '',
  }
}

/**
 * Quello che il backend riceve: il modello intero, ogni volta.
 * Una finestra che cambia solo una sezione manda l'altra così com'è salvata.
 */
export function toModelPayload(values: ModelValues): ModelPayload {
  return {
    name: values.name.trim(),
    // Vuoto: in creazione il backend lo genera dal nome, in modifica resta quello di prima
    slug: values.slug.trim() || undefined,
    category_id: values.category_id ? Number(values.category_id) : null,
    predecessor_id: values.predecessor?.id ?? null,
    description: { it: values.description_it, en: values.description_en },
  }
}

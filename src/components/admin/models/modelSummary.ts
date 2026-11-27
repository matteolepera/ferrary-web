import type { ModelSection } from '@/components/admin/models/modelSections'
import type { SummaryItem } from '@/components/admin/versions/versionSummary'
import type { AdminCarModel, AdminCategory } from '@/types/admin'

/** Un testo, o null se è vuoto */
function text(value: string | null | undefined) {
  return value && value.trim() !== '' ? value : null
}

/**
 * I dati di una sezione del modello, pronti da leggere nella pagina.
 * La famiglia si cerca tra quelle del catalogo; se non sono ancora arrivate, vale quella del modello.
 */
export function modelSectionSummary(
  section: ModelSection,
  model: AdminCarModel,
  categories?: AdminCategory[],
): SummaryItem[] {
  if (section === 'descrizione') {
    return [
      { label: 'In italiano', value: text(model.description.it), wide: true },
      { label: 'In inglese', value: text(model.description.en), wide: true },
    ]
  }

  const category =
    categories?.find((item) => item.id === model.category_id) ?? model.category

  return [
    { label: 'Nome', value: text(model.name) },
    { label: 'Famiglia', value: category?.name.it ?? null },
    // Il primo di una serie non ha predecessore: è un dato, non una mancanza
    {
      label: 'Predecessore',
      value: model.predecessor_id
        ? (model.predecessor?.name ?? null)
        : 'Nessuno',
    },
    { label: 'Slug', value: text(model.slug) },
  ]
}

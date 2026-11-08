import type { Category } from '@/types/catalog'

export type CategoryGroupKey = 'road' | 'racing' | 'concept' | 'other'

/** Le categorie di ogni gruppo, per slug, nell'ordine del menu */
const GROUPS: Record<Exclude<CategoryGroupKey, 'other'>, string[]> = {
  road: [
    'sportive',
    'gran-turismo',
    'serie-speciali',
    'supercar',
    'icona',
    'progetti-speciali',
  ],
  racing: [
    'formula-1',
    'sport-prototipi',
    'gt-storiche',
    'gt2-gte',
    'gt3',
    'challenge',
    'programmi-xx',
  ],
  concept: ['concept'],
}

const ORDER: CategoryGroupKey[] = ['road', 'racing', 'concept', 'other']

/** Il gruppo di una categoria; quelle che non conosciamo vanno in "Altre" */
function groupOf(slug: string): CategoryGroupKey {
  const keys = Object.keys(GROUPS) as Exclude<CategoryGroupKey, 'other'>[]

  return keys.find((key) => GROUPS[key].includes(slug)) ?? 'other'
}

/**
 * Le categorie divise per gruppo, senza gruppi vuoti.
 * Dentro ogni gruppo resta l'ordine deciso dallo staff, quello che arriva dall'API.
 */
export function groupCategories(categories: Category[]) {
  return ORDER.map((key) => ({
    key,
    categories: categories.filter((category) => groupOf(category.slug) === key),
  })).filter((group) => group.categories.length > 0)
}

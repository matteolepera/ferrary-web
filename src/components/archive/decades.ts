import type { TFunction } from 'i18next'
import type { ModelFilters } from '@/api/models'

// Dagli anni '40 al decennio in corso
export const FIRST_DECADE = 1940
export const LAST_DECADE = Math.floor(new Date().getFullYear() / 10) * 10
export const DECADES = Array.from(
  { length: (LAST_DECADE - FIRST_DECADE) / 10 + 1 },
  (_, i) => FIRST_DECADE + i * 10,
)

/** L'anno del decennio: 1987 diventa 1980 */
export const decadeOf = (year: number) => Math.floor(year / 10) * 10

/** "'60" per il Novecento, "2010" per il Duemila: la forma breve, per la linea del tempo */
export const shortDecade = (decade: number) =>
  decade < 2000 ? `'${String(decade).slice(2)}` : String(decade)

/** "Anni '60" in italiano, "1960s" in inglese */
export function decadeLabel(t: TFunction, decade: number) {
  return t('archive.filters.decade', {
    short: shortDecade(decade),
    full: String(decade),
  })
}

/**
 * Il periodo dei filtri, in decenni. Se l'indirizzo ne ha solo un estremo,
 * l'altro è il bordo della linea del tempo.
 */
export function periodOf(filters: ModelFilters) {
  const hasPeriod =
    filters.year_from !== undefined || filters.year_to !== undefined
  const low =
    filters.year_from !== undefined ? decadeOf(filters.year_from) : FIRST_DECADE
  const high =
    filters.year_to !== undefined ? decadeOf(filters.year_to) : LAST_DECADE

  return { hasPeriod, low, high, single: hasPeriod && low === high }
}

/** Il periodo in parole: "Qualsiasi", "Anni '60" oppure "Anni '60 – Anni '70" */
export function periodLabel(t: TFunction, filters: ModelFilters) {
  const { hasPeriod, low, high, single } = periodOf(filters)

  if (!hasPeriod) return t('archive.filters.anyYear')
  if (single) return decadeLabel(t, low)

  return t('archive.filters.range', {
    from: decadeLabel(t, low),
    to: decadeLabel(t, high),
  })
}

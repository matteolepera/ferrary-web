import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/lib/format'
import type { CarModel } from '@/types/catalog'

/**
 * I dati chiave di un modello, nella lingua del sito: il valore intero, "1000 cv",
 * e il numero e l'unità separati, per chi vuole disegnarli diversi.
 * Per le auto che hanno corso contano i risultati (vittorie, titoli, gare);
 * per le altre, o se i risultati sono tutti a zero, potenza, 0–100 e velocità.
 * Solo quelli che esistono: un dato mancante non compare.
 */
export function useHighlights(highlights: CarModel['highlights']) {
  const { t, i18n } = useTranslation()

  const stat = (
    key: string,
    label: string,
    number: number | null | undefined,
    unit = '',
    decimals = 0,
  ) => {
    if (number == null) return null
    const figure = formatNumber(number, i18n.language, decimals)

    return {
      key,
      label,
      figure,
      unit,
      value: unit ? `${figure} ${unit}` : figure,
    }
  }

  /** Solo i dati che esistono */
  const present = <T>(items: (T | null)[]) =>
    items.filter((item): item is T => item !== null)

  // I risultati: solo quelli maggiori di zero ("|| null" trasforma lo zero in dato mancante)
  const racing = highlights?.racing
  const results = racing
    ? present([
        stat('wins', t('model.racing.wins'), racing.wins || null),
        stat('titles', t('model.racing.totalTitles'), racing.titles || null),
        stat('races', t('model.racing.races'), racing.races || null),
      ])
    : []

  if (results.length > 0) {
    return results
  }

  return present([
    stat('power', t('model.power'), highlights?.power_cv, 'cv'),
    stat(
      'acceleration',
      t('model.acceleration'),
      highlights?.zero_to_100_sec,
      's',
      2,
    ),
    stat('topSpeed', t('model.topSpeed'), highlights?.top_speed_kmh, 'km/h'),
  ])
}

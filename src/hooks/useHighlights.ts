import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/lib/format'
import type { CarModel } from '@/types/catalog'

/**
 * I dati chiave di un modello, nella lingua del sito: il valore intero, "1000 cv",
 * e il numero e l'unità separati, per chi vuole disegnarli diversi.
 * Solo quelli che esistono: un dato mancante non compare.
 */
export function useHighlights(highlights: CarModel['highlights']) {
  const { t, i18n } = useTranslation()

  const stat = (
    key: string,
    label: string,
    number: number | null | undefined,
    unit: string,
    decimals = 0,
  ) => {
    if (number == null) return null
    const figure = formatNumber(number, i18n.language, decimals)

    return { key, label, figure, unit, value: `${figure} ${unit}` }
  }

  return [
    stat('power', t('model.power'), highlights?.power_cv, 'cv'),
    stat(
      'acceleration',
      t('model.acceleration'),
      highlights?.zero_to_100_sec,
      's',
      2,
    ),
    stat('topSpeed', t('model.topSpeed'), highlights?.top_speed_kmh, 'km/h'),
  ].filter((item) => item !== null)
}

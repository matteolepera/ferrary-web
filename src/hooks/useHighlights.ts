import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/lib/format'
import type { CarModel } from '@/types/catalog'

/**
 * I tre dati chiave di un modello, con etichetta e valore già formattati nella lingua del sito.
 */
export function useHighlights(highlights: CarModel['highlights']) {
  const { t, i18n } = useTranslation()

  const value = (
    number: number | null | undefined,
    unit: string,
    decimals = 0,
  ) =>
    number == null
      ? t('model.notAvailable')
      : `${formatNumber(number, i18n.language, decimals)} ${unit}`

  return [
    {
      key: 'power',
      label: t('model.power'),
      value: value(highlights?.power_cv, 'cv'),
    },
    {
      key: 'acceleration',
      label: t('model.acceleration'),
      value: value(highlights?.zero_to_100_sec, 's', 2),
    },
    {
      key: 'topSpeed',
      label: t('model.topSpeed'),
      value: value(highlights?.top_speed_kmh, 'km/h'),
    },
  ]
}

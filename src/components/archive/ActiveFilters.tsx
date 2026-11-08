import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ModelFilters } from '@/api/models'
import { periodLabel, periodOf } from '@/components/archive/decades'

type ActiveFiltersProps = {
  filters: ModelFilters
  onChange: (changes: Partial<ModelFilters>) => void
}

/**
 * I filtri della scheda attivi, come etichette da togliere una alla volta.
 * Ricerca e famiglia non compaiono: si vedono già nella barra.
 */
export function ActiveFilters({ filters, onChange }: ActiveFiltersProps) {
  const { t } = useTranslation()

  const chips: { key: string; label: string; clear: Partial<ModelFilters> }[] =
    []

  if (filters.powertrain) {
    chips.push({
      key: 'powertrain',
      label: t(`archive.filters.powertrains.${filters.powertrain}`),
      clear: { powertrain: undefined },
    })
  }

  if (periodOf(filters).hasPeriod) {
    chips.push({
      key: 'period',
      label: periodLabel(t, filters),
      clear: { year_from: undefined, year_to: undefined },
    })
  }

  if (chips.length === 0) {
    return null
  }

  return (
    <ul
      aria-label={t('archive.activeFilters')}
      className="flex flex-wrap gap-2"
    >
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            aria-label={t('archive.removeFilter', { name: chip.label })}
            onClick={() => onChange(chip.clear)}
            className={[
              'border-linea inline-flex items-center gap-2 border px-3 py-1.5 text-xs text-neutral-200 transition-colors',
              'hover:border-neutral-500 hover:text-white',
              'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-2',
            ].join(' ')}
          >
            {chip.label}
            <X aria-hidden="true" className="size-3.5 text-neutral-400" />
          </button>
        </li>
      ))}
    </ul>
  )
}

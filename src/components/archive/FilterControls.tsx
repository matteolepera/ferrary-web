import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { ModelFilters } from '@/api/models'
import type { PowertrainType } from '@/types/catalog'

type FilterControlsProps = {
  filters: ModelFilters
  onChange: (changes: Partial<ModelFilters>) => void
}

const POWERTRAINS: (PowertrainType | undefined)[] = [
  undefined,
  'termico',
  'ibrido',
  'elettrico',
]

// Dagli anni '40 al decennio in corso
const FIRST_DECADE = 1940
const LAST_DECADE = Math.floor(new Date().getFullYear() / 10) * 10
const DECADES = Array.from(
  { length: (LAST_DECADE - FIRST_DECADE) / 10 + 1 },
  (_, i) => FIRST_DECADE + i * 10,
)

const labelClass =
  'text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase'
const pillClass = [
  'border px-4 py-2.5 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosso-acceso',
].join(' ')

/** Menu a tendina con etichetta e freccia, nello stile del sito */
function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs text-neutral-400">{label}</span>
      <span className="relative flex items-center">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="border-linea bg-ombra w-full appearance-none border py-3 pr-10 pl-4 text-[0.9375rem] text-neutral-100 focus:border-neutral-400 focus:outline-none lg:min-w-44"
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 size-4 text-neutral-400"
        />
      </span>
    </label>
  )
}

/**
 * Motorizzazione, periodo e ordinamento: gli stessi controlli nel pannello mobile e in linea sul desktop.
 */
export function FilterControls({ filters, onChange }: FilterControlsProps) {
  const { t } = useTranslation()

  const decadeLabel = (decade: number) =>
    t('archive.filters.decade', {
      short: decade < 2000 ? `'${String(decade).slice(2)}` : String(decade),
      full: String(decade),
    })

  // Un valore vuoto del menu significa "nessun filtro"
  const toYear = (value: string) => (value === '' ? undefined : Number(value))

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:flex-wrap lg:items-end lg:gap-10">
      <fieldset>
        <legend className={labelClass}>
          {t('archive.filters.powertrain')}
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {POWERTRAINS.map((powertrain) => {
            const active = filters.powertrain === powertrain

            return (
              <button
                key={powertrain ?? 'tutte'}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ powertrain })}
                className={`${pillClass} ${
                  active
                    ? 'text-notte border-white bg-white'
                    : 'border-linea text-neutral-300 hover:border-neutral-500 hover:text-white'
                }`}
              >
                {powertrain
                  ? t(`archive.filters.powertrains.${powertrain}`)
                  : t('archive.filters.any')}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>{t('archive.filters.period')}</legend>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:flex">
          <Select
            label={t('archive.filters.from')}
            value={filters.year_from?.toString() ?? ''}
            onChange={(value) => onChange({ year_from: toYear(value) })}
          >
            <option value="">{t('archive.filters.anyYear')}</option>
            {DECADES.map((decade) => (
              // Non si può partire da un decennio successivo alla fine scelta
              <option
                key={decade}
                value={decade}
                disabled={
                  filters.year_to !== undefined && decade > filters.year_to
                }
              >
                {decadeLabel(decade)}
              </option>
            ))}
          </Select>

          <Select
            label={t('archive.filters.to')}
            value={filters.year_to?.toString() ?? ''}
            onChange={(value) => onChange({ year_to: toYear(value) })}
          >
            <option value="">{t('archive.filters.anyYear')}</option>
            {DECADES.map((decade) => (
              // "Al" un decennio significa fino al suo ultimo anno: Anni '60 → 1969
              <option
                key={decade}
                value={decade + 9}
                disabled={
                  filters.year_from !== undefined &&
                  decade + 9 < filters.year_from
                }
              >
                {decadeLabel(decade)}
              </option>
            ))}
          </Select>
        </div>
      </fieldset>

      <Select
        label={t('archive.filters.sort')}
        value={filters.sort ?? ''}
        onChange={(value) =>
          onChange({
            sort: value === '' ? undefined : (value as ModelFilters['sort']),
          })
        }
      >
        {/* Il valore vuoto è il predefinito dell'API: nome dalla A alla Z */}
        <option value="">{t('archive.filters.sorts.nameAsc')}</option>
        <option value="-name">{t('archive.filters.sorts.nameDesc')}</option>
        <option value="-year">{t('archive.filters.sorts.newest')}</option>
        <option value="year">{t('archive.filters.sorts.oldest')}</option>
      </Select>
    </div>
  )
}

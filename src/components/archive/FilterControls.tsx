import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { ModelFilters } from '@/api/models'
import {
  DECADES,
  decadeLabel,
  periodLabel,
  periodOf,
  shortDecade,
} from '@/components/archive/decades'
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

/** Il centro di un decennio sulla linea, in percentuale: ogni decennio occupa una colonna */
const centerOf = (decade: number) =>
  ((DECADES.indexOf(decade) + 0.5) * 100) / DECADES.length

const labelClass =
  'text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase'

/**
 * Motorizzazione e periodo, nella scheda che si apre dal pulsante "Filtri".
 */
export function FilterControls({ filters, onChange }: FilterControlsProps) {
  const { t } = useTranslation()
  const powertrainId = useId()
  const periodId = useId()

  // Il periodo scelto, in decenni: si ricalcola a ogni disegno, dai filtri attuali
  const { hasPeriod, low, high, single } = periodOf(filters)

  function pickDecade(decade: number) {
    if (single && decade === low) {
      // Lo stesso decennio di nuovo: il periodo si toglie
      onChange({ year_from: undefined, year_to: undefined })
    } else if (single) {
      // Un secondo decennio: il periodo si allarga fino a lui, da qualunque lato
      onChange({
        year_from: Math.min(low, decade),
        year_to: Math.max(low, decade) + 9,
      })
    } else {
      // Nessun periodo, o un periodo già allargato: si riparte da un decennio solo
      onChange({ year_from: decade, year_to: decade + 9 })
    }
  }

  const powertrainLabel = (powertrain: PowertrainType | undefined) =>
    powertrain
      ? t(`archive.filters.powertrains.${powertrain}`)
      : t('archive.filters.any')

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-labelledby={powertrainId}>
        <div className="flex items-baseline justify-between gap-4">
          <span id={powertrainId} className={labelClass}>
            {t('archive.filters.powertrain')}
          </span>
          <span aria-hidden="true" className="text-xs text-neutral-200">
            {powertrainLabel(filters.powertrain)}
          </span>
        </div>

        {/* Quattro scelte attaccate: una sola alla volta */}
        <div className="border-linea mt-3 grid grid-cols-4 border">
          {POWERTRAINS.map((powertrain, place) => {
            const active = filters.powertrain === powertrain

            return (
              <button
                key={powertrain ?? 'tutte'}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ powertrain })}
                className={[
                  'h-10 text-[0.625rem] font-semibold tracking-[0.14em] uppercase transition-colors md:text-[0.6875rem]',
                  'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:-outline-offset-2',
                  place > 0 ? 'border-linea border-l' : '',
                  active
                    ? 'text-notte bg-white'
                    : 'text-neutral-400 hover:text-white',
                ].join(' ')}
              >
                {powertrainLabel(powertrain)}
              </button>
            )
          })}
        </div>
      </div>

      <div role="group" aria-labelledby={periodId}>
        <div className="flex items-baseline justify-between gap-4">
          <span id={periodId} className={labelClass}>
            {t('archive.filters.period')}
          </span>
          <span aria-hidden="true" className="text-xs text-neutral-200">
            {periodLabel(t, filters)}
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500">
          {t('archive.filters.periodHint')}
        </p>

        {/* La linea del tempo: il tratto rosso va dal primo all'ultimo decennio scelto */}
        <div
          aria-hidden="true"
          className="bg-linea relative mx-0.5 mt-6 h-[3px]"
        >
          {hasPeriod && (
            <>
              <span
                className="bg-rosso absolute inset-y-0 transition-all duration-300"
                style={{
                  left: `${centerOf(low)}%`,
                  width: `${centerOf(high) - centerOf(low)}%`,
                }}
              />
              <span
                className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_3px_var(--color-ombra)]"
                style={{ left: `${centerOf(low)}%` }}
              />
              {!single && (
                <span
                  className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_3px_var(--color-ombra)]"
                  style={{ left: `${centerOf(high)}%` }}
                />
              )}
            </>
          )}
        </div>

        <div
          className="mt-1 grid"
          style={{
            gridTemplateColumns: `repeat(${DECADES.length}, minmax(0, 1fr))`,
          }}
        >
          {DECADES.map((decade) => {
            const inside = hasPeriod && decade >= low && decade <= high

            return (
              <button
                key={decade}
                type="button"
                aria-label={decadeLabel(t, decade)}
                aria-pressed={inside}
                onClick={() => pickDecade(decade)}
                className={[
                  'h-9 text-[0.625rem] font-semibold tabular-nums transition-colors md:text-[0.6875rem]',
                  'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:-outline-offset-2',
                  inside ? 'text-white' : 'text-neutral-500 hover:text-white',
                ].join(' ')}
              >
                {shortDecade(decade)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

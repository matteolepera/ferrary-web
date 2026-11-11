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

/** Il titolo di una sezione, con il segno rosso obliquo davanti */
function SectionLabel({ id, children }: { id: string; children: string }) {
  return (
    <span
      id={id}
      className="flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase"
    >
      <span
        aria-hidden="true"
        className="bg-rosso-acceso h-[3px] w-3 -skew-x-[28deg] shadow-[0_0_8px_rgba(255,59,48,0.6)]"
      />
      {children}
    </span>
  )
}

/** Il cursore della linea del tempo: un piccolo parallelogramma, come il segno della Y */
function Knob({ at }: { at: number }) {
  return (
    <span
      className="absolute top-1/2 h-3 w-4 -translate-x-1/2 -translate-y-1/2 -skew-x-[20deg] bg-white shadow-[0_0_0_3px_var(--color-neutral-900)] transition-[left] duration-300"
      style={{ left: `${at}%` }}
    />
  )
}

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
    <div className="flex flex-col gap-9">
      <div role="group" aria-labelledby={powertrainId}>
        <div className="flex items-baseline justify-between gap-4">
          <SectionLabel id={powertrainId}>
            {t('archive.filters.powertrain')}
          </SectionLabel>
          <span
            aria-hidden="true"
            className="text-[0.8125rem] text-neutral-100"
          >
            {powertrainLabel(filters.powertrain)}
          </span>
        </div>

        {/* Quattro scelte in un riquadro con l'angolo della Y: la scelta attiva ha il riflettore */}
        <div className="mt-3.5 grid h-12 grid-cols-4 overflow-hidden rounded-[3px] rounded-tl-[14px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
          {POWERTRAINS.map((powertrain, place) => {
            const active = filters.powertrain === powertrain

            return (
              <button
                key={powertrain ?? 'tutte'}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ powertrain })}
                className={[
                  'relative text-[0.625rem] font-semibold tracking-[0.14em] uppercase transition-colors md:text-[0.6875rem]',
                  'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:-outline-offset-4',
                  // Le linee inclinate tra una scelta e l'altra
                  place > 0
                    ? "before:absolute before:inset-y-3.5 before:left-0 before:w-px before:-skew-x-[20deg] before:bg-white/12 before:content-['']"
                    : '',
                  active
                    ? [
                        'bg-[radial-gradient(ellipse_70%_90%_at_50%_0%,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_60%,transparent_85%)] text-white',
                        "after:absolute after:bottom-2 after:left-1/2 after:h-[3px] after:w-3.5 after:-translate-x-1/2 after:-skew-x-[28deg] after:content-['']",
                        'after:bg-rosso-acceso after:shadow-[0_0_8px_rgba(255,59,48,0.7)]',
                      ].join(' ')
                    : 'text-neutral-500 hover:text-white',
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
          <SectionLabel id={periodId}>
            {t('archive.filters.period')}
          </SectionLabel>
          <span
            aria-hidden="true"
            className="text-[0.8125rem] text-neutral-100"
          >
            {periodLabel(t, filters)}
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500">
          {t('archive.filters.periodHint')}
        </p>

        {/* La linea del tempo: il tratto rosso va dal primo all'ultimo decennio scelto */}
        <div
          aria-hidden="true"
          className="bg-linea relative mx-0.5 mt-7 h-[3px]"
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
              <Knob at={centerOf(low)} />
              {!single && <Knob at={centerOf(high)} />}
            </>
          )}
        </div>

        <div
          className="mt-1.5 grid"
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
                  'font-display h-9 text-[0.6875rem] font-bold tabular-nums transition-colors md:text-xs',
                  'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:-outline-offset-2',
                  inside ? 'text-white' : 'text-neutral-600 hover:text-white',
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

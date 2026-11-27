/** Una scelta del filtro: undefined vuol dire "tutti" */
export type FilterOption<T extends string> = {
  value: T | undefined
  label: string
}

type FilterPillsProps<T extends string> = {
  /** Il nome del gruppo, per il lettore di schermo */
  label: string
  options: FilterOption<T>[]
  value: T | undefined
  onChange: (value: T | undefined) => void
}

/**
 * I filtri a pillole degli elenchi: una barra alta quanto la ricerca e le select (48 pixel),
 * con la scelta attiva in bianco. Ogni pillola dice con aria-pressed se è scelta.
 */
export function FilterPills<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterPillsProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="bg-ombra inline-flex h-12 items-center gap-1 rounded-full border border-white/10 p-1"
    >
      {options.map((option) => {
        const active = option.value === value

        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={[
              'h-full rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors',
              'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-2',
              active
                ? 'text-notte bg-white'
                : 'text-neutral-400 hover:bg-white/6 hover:text-white',
            ].join(' ')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

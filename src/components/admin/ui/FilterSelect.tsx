import { useId, type ComponentProps } from 'react'
import { CaretDownIcon } from '@phosphor-icons/react'

type FilterSelectProps = ComponentProps<'select'> & {
  /** Il nome del filtro: non si vede, la prima scelta ("Tutte le famiglie") dice già cosa filtra */
  label: string
}

/**
 * Un menu a tendina nella barra dei filtri di un elenco: alto e arrotondato come la ricerca
 * e le pillole, così la riga dei filtri ha un solo aspetto.
 */
export function FilterSelect({
  label,
  id,
  className = '',
  children,
  ...props
}: FilterSelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>
      {/* appearance-none toglie la freccia del browser: la nostra ha spazio dal bordo */}
      <select
        id={selectId}
        className="bg-ombra h-12 w-full appearance-none rounded-full border border-white/10 pr-11 pl-4 text-sm text-neutral-100 transition-colors focus:border-neutral-300"
        {...props}
      >
        {children}
      </select>
      <CaretDownIcon
        aria-hidden="true"
        size={14}
        weight="bold"
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-neutral-400"
      />
    </div>
  )
}

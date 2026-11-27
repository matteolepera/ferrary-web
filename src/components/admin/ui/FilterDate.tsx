import type { ComponentProps } from 'react'

type FilterDateProps = Omit<ComponentProps<'input'>, 'type'> & {
  /** Scritto dentro il campo, prima della data: "Dal", "Al" */
  label: string
}

/**
 * Una data nella barra dei filtri di un elenco: l'etichetta sta dentro, a sinistra,
 * e il campo è alto e arrotondato come la ricerca, le pillole e le select.
 */
export function FilterDate({
  label,
  className = '',
  ...props
}: FilterDateProps) {
  return (
    <label
      className={`bg-ombra flex h-12 items-center gap-2 rounded-full border border-white/10 px-4 text-sm transition-colors focus-within:border-neutral-300 ${className}`}
    >
      <span className="text-neutral-500">{label}</span>
      {/* color-scheme scuro: il calendario e la sua icona seguono il tema dell'admin */}
      <input
        type="date"
        className="bg-transparent text-neutral-100 [color-scheme:dark] outline-none"
        {...props}
      />
    </label>
  )
}

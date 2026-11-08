import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

type ArchiveSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
  /** Etichetta solo per i lettori di schermo: nella barra il valore scelto parla da sé */
  hideLabel?: boolean
  className?: string
}

/**
 * Menu a tendina con etichetta e freccia, nello stile dell'archivio.
 */
export function ArchiveSelect({
  label,
  value,
  onChange,
  children,
  hideLabel = false,
  className = '',
}: ArchiveSelectProps) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className={hideLabel ? 'sr-only' : 'text-xs text-neutral-400'}>
        {label}
      </span>
      <span className="relative flex items-center">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="border-linea bg-ombra w-full appearance-none border py-3.5 pr-10 pl-4 text-[0.9375rem] text-neutral-100 focus:border-neutral-400 focus:outline-none"
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

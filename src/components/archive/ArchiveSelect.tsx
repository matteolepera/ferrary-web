import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { yFocusMark } from '@/components/ui/yFocus'

type ArchiveSelectProps = {
  /** Il nome completo del menu, per i lettori di schermo: "Famiglia", "Ordina per" */
  label: string
  /** L'etichetta breve, visibile prima del valore: "Famiglia", "Ordina" */
  prefix?: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
  className?: string
}

/**
 * Un menu a tendina dentro la barra dell'archivio: l'etichetta breve, il valore scelto e la freccia.
 */
export function ArchiveSelect({
  label,
  prefix,
  value,
  onChange,
  children,
  className = '',
}: ArchiveSelectProps) {
  return (
    <label
      className={`${yFocusMark} flex h-full items-center gap-2.5 px-4 md:px-5 ${className}`}
    >
      {prefix && (
        // Visibile ma nascosta ai lettori di schermo: il menu ha già il suo nome completo
        <span
          aria-hidden="true"
          className="hidden text-[0.625rem] font-semibold tracking-[0.18em] text-neutral-500 uppercase md:inline"
        >
          {prefix}
        </span>
      )}
      <span className="relative flex min-w-0 flex-1 items-center">
        <select
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full min-w-0 cursor-pointer appearance-none truncate bg-transparent py-2 pr-6 text-sm text-neutral-100 focus-visible:outline-none md:text-[0.9375rem]"
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-0 size-4 text-neutral-500"
        />
      </span>
    </label>
  )
}

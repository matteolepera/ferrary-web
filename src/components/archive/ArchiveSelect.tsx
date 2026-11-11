import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { yFocusMark } from '@/components/ui/yFocus'

type ArchiveSelectProps = {
  /** Il nome completo del menu, per i lettori di schermo: "Famiglia", "Ordina per" */
  label: string
  /** L'etichetta breve, visibile prima del valore dal tablet in su: "Famiglia", "Ordina" */
  prefix?: string
  /** Se c'è, su telefono il menu è solo questa icona: il valore compare dal tablet in su */
  icon?: ReactNode
  value: string
  onChange: (value: string) => void
  children: ReactNode
  className?: string
}

/**
 * Un menu a tendina dentro la barra dell'archivio: l'etichetta breve, il valore scelto e la freccia.
 * Con un'icona, su telefono si riduce a lei, per lasciare spazio agli altri controlli.
 */
export function ArchiveSelect({
  label,
  prefix,
  icon,
  value,
  onChange,
  children,
  className = '',
}: ArchiveSelectProps) {
  return (
    <label
      className={`${yFocusMark} flex h-full items-center px-4 md:gap-2.5 md:px-5 ${icon ? 'gap-0' : 'gap-2.5'} ${className}`}
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

      {/* Su telefono, l'icona al posto del valore */}
      {icon && (
        <span aria-hidden="true" className="text-neutral-300 md:hidden">
          {icon}
        </span>
      )}

      <span
        className={`flex min-w-0 flex-1 items-center ${icon ? 'md:relative' : 'relative'}`}
      >
        <select
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={[
            'w-full min-w-0 cursor-pointer appearance-none truncate bg-transparent py-2 pr-6 text-sm text-neutral-100 focus-visible:outline-none md:text-[0.9375rem]',
            // Con l'icona, su telefono il menu è invisibile ma copre tutto il controllo: toccando l'icona si apre lui
            icon ? 'absolute inset-0 opacity-0 md:static md:opacity-100' : '',
          ].join(' ')}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 size-4 text-neutral-500 ${icon ? 'hidden md:block' : ''}`}
        />
      </span>
    </label>
  )
}

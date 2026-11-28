import type { ReactNode } from 'react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'

type ForwardLinkProps = {
  to: string
  /** Il testo visibile, corto: "Registro", "Gestisci" */
  children: ReactNode
  /** Il nome completo per il lettore di schermo: deve contenere il testo visibile */
  label: string
}

/**
 * Il pulsante per andare a una pagina, in alto a destra nelle card del pannello.
 * È il gemello di BackLink: stessa pillola, con la freccia a destra.
 */
export function ForwardLink({ to, children, label }: ForwardLinkProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="group focus-visible:outline-rosso-acceso inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/20 pr-1.5 pl-4 text-[0.8125rem] font-semibold text-neutral-200 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {children}
      <span
        aria-hidden="true"
        className="flex size-6 items-center justify-center rounded-full bg-white/8 transition-transform group-hover:translate-x-0.5"
      >
        <ArrowRightIcon size={13} />
      </span>
    </Link>
  )
}

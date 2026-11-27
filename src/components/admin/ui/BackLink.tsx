import { ArrowLeftIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'

type BackLinkProps = {
  to: string
  /** Dove si torna: "SF90", "Modelli". Lo legge il lettore di schermo, e si vede passando sopra */
  label: string
}

/**
 * Il pulsante per tornare indietro, sopra il titolo delle pagine interne.
 * Porta sempre alla pagina che contiene questa (il modello di una versione, l'elenco dei motori),
 * anche se ci si è arrivati da un link diretto: non è il "indietro" del browser.
 */
export function BackLink({ to, label }: BackLinkProps) {
  return (
    <Link
      to={to}
      aria-label={`Torna indietro a ${label}`}
      title={`Torna a ${label}`}
      className="group focus-visible:outline-rosso-acceso inline-flex h-9 items-center gap-2 rounded-full border border-white/20 pr-4 pl-1.5 text-[0.8125rem] font-semibold text-neutral-200 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span
        aria-hidden="true"
        className="flex size-6 items-center justify-center rounded-full bg-white/8 transition-transform group-hover:-translate-x-0.5"
      >
        <ArrowLeftIcon size={13} />
      </span>
      Torna indietro
    </Link>
  )
}

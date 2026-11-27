import type { ReactNode } from 'react'

type ListHeaderProps = {
  /** La sezione dell'admin, in rosso sopra il titolo: "Catalogo", "Persone" */
  eyebrow: string
  title: string
  /** Quanti sono: "12 motori", oppure "3 motori con questi filtri" */
  count?: string
  /** Il pulsante a destra, di solito "Nuovo …" */
  action?: ReactNode
}

/** La testata degli elenchi dell'admin: tutte uguali, come quella dei modelli */
export function ListHeader({ eyebrow, title, count, action }: ListHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display mt-2.5 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
          {title}
        </h1>
        {/* Lo spazio c'è sempre: il titolo non salta quando arriva il numero */}
        <p className="mt-3 min-h-5 text-sm text-neutral-400">{count}</p>
      </div>
      {action}
    </header>
  )
}

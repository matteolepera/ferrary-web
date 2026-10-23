import { Link } from 'react-router'

type NotFoundPageProps = {
  /** Dove riporta il pulsante: la home del sito o del pannello */
  backTo?: string
}

/**
 * Pagina mostrata per gli indirizzi che non esistono.
 */
export function NotFoundPage({ backTo = '/' }: NotFoundPageProps) {
  return (
    <section className="py-16 text-center">
      <p className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
        Errore 404
      </p>
      <h1 className="mt-2 text-3xl font-bold">Pagina non trovata</h1>
      <p className="mt-4 text-neutral-600">
        L'indirizzo che hai aperto non esiste, oppure è stato spostato.
      </p>
      <Link
        to={backTo}
        className="mt-8 inline-block rounded bg-neutral-900 px-4 py-2 text-white"
      >
        Torna all'inizio
      </Link>
    </section>
  )
}

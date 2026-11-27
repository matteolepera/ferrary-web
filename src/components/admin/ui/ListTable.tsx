import type { ReactNode } from 'react'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminPagination } from '@/components/admin/ui/AdminPagination'

/** La riga di un elenco: le pagine la usano per i loro <tr> */
export const listRowClass =
  'border-linea border-b transition-colors last:border-b-0 hover:bg-white/[0.02]'

type ListTableProps = {
  /** Per il lettore di schermo: "Motori del catalogo" */
  caption: string
  /** I titoli delle colonne; '' è la colonna delle azioni, senza titolo visibile */
  columns: string[]
  /** La larghezza minima, sotto la quale la tabella scorre: "min-w-[40rem]" */
  minWidth?: string
  isPending: boolean
  /** Il messaggio se il caricamento non riesce */
  error?: string | null
  /** Il messaggio se non c'è nessuna riga da mostrare */
  empty?: string | null
  /** Le pagine: senza, l'elenco sta tutto in una (ad esempio le famiglie, che sono poche) */
  page?: number
  lastPage?: number
  onPageChange?: (page: number) => void
  /** Sotto la tabella, prima delle pagine: ad esempio l'errore di un'eliminazione */
  footer?: ReactNode
  children: ReactNode
}

/**
 * La tabella degli elenchi dell'admin, uguale per tutti: i titoli, le righe sagoma
 * mentre carica, il messaggio dell'elenco vuoto e le pagine in fondo.
 */
export function ListTable({
  caption,
  columns,
  minWidth = 'min-w-[40rem]',
  isPending,
  error,
  empty,
  page,
  lastPage,
  onPageChange,
  footer,
  children,
}: ListTableProps) {
  return (
    <AdminCard className="mt-7 overflow-hidden">
      {error ? (
        <p role="alert" className="p-6 text-[0.9375rem] text-neutral-300">
          {error}
        </p>
      ) : (
        // La tabella scorre in orizzontale dentro la card, sul tablet
        <div className="overflow-x-auto">
          <table
            aria-busy={isPending}
            className={`w-full text-left text-sm ${minWidth}`}
          >
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr className="border-linea border-b">
                {columns.map((column, index) => (
                  <th
                    key={column || index}
                    scope="col"
                    className="px-5 py-4 text-[0.6875rem] font-semibold tracking-[0.18em] whitespace-nowrap text-neutral-400 uppercase first:pl-6"
                  >
                    {column || <span className="sr-only">Azioni</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isPending
                ? // Cinque righe sagoma, mentre arriva la risposta
                  Array.from({ length: 5 }, (_, index) => (
                    <tr
                      key={index}
                      className="border-linea border-b last:border-b-0"
                    >
                      <td colSpan={columns.length} className="px-6 py-4">
                        <span className="block h-9 animate-pulse rounded-xl bg-white/5" />
                      </td>
                    </tr>
                  ))
                : children}
            </tbody>
          </table>

          {!isPending && empty && (
            <p className="px-6 py-12 text-center text-sm text-neutral-400">
              {empty}
            </p>
          )}
        </div>
      )}

      {footer}

      {page !== undefined && lastPage !== undefined && onPageChange && (
        <AdminPagination
          page={page}
          lastPage={lastPage}
          onChange={onPageChange}
        />
      )}
    </AdminCard>
  )
}

import { useSearchParams } from 'react-router'
import type { AdminModelFilters, PublicationStatus } from '@/types/admin'

const STATUSES: PublicationStatus[] = ['draft', 'scheduled', 'published']

/** Un numero intero positivo dall'indirizzo, oppure niente */
function toPositiveInteger(value: string | null) {
  const number = Number(value)

  return value && Number.isInteger(number) && number > 0 ? number : undefined
}

/** Lo stato solo se è uno dei tre previsti: "?status=pippo" viene ignorato */
function toStatus(value: string | null) {
  return STATUSES.find((status) => status === value)
}

/**
 * I filtri della tabella dei modelli, nell'indirizzo: si possono salvare, condividere,
 * e i pulsanti del pannello ci arrivano già filtrati.
 */
export function useAdminModelFilters() {
  const [params, setParams] = useSearchParams()

  const filters: AdminModelFilters = {
    search: params.get('search') || undefined,
    status: toStatus(params.get('status')),
    category_id: toPositiveInteger(params.get('category_id')),
    page: toPositiveInteger(params.get('page')),
  }

  function setFilters(
    changes: Partial<AdminModelFilters>,
    { replace = false } = {},
  ) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)

        for (const [key, value] of Object.entries(changes)) {
          if (value === undefined || value === '') {
            next.delete(key)
          } else {
            next.set(key, String(value))
          }
        }

        // Con un filtro diverso i risultati cambiano: si riparte dalla prima pagina
        if (!('page' in changes)) {
          next.delete('page')
        }

        return next
      },
      { replace, preventScrollReset: true },
    )
  }

  return { filters, setFilters }
}

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { fetchActivity } from '@/api/admin'
import type { ActivityFilters } from '@/types/dashboard'

/** Il registro, con i filtri: cambiando pagina o filtro, l'elenco resta visibile finché arriva il nuovo */
export function useActivity(filters: ActivityFilters) {
  return useQuery({
    queryKey: ['admin', 'activity', filters],
    queryFn: () => fetchActivity(filters),
    placeholderData: keepPreviousData,
    retry: false,
  })
}

/** Una data dall'indirizzo, solo se ha la forma giusta: 2026-10-01 */
function toDate(value: string | null) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined
}

/** Un numero intero positivo dall'indirizzo, oppure niente */
function toPositiveInteger(value: string | null) {
  const number = Number(value)
  return value && Number.isInteger(number) && number > 0 ? number : undefined
}

/**
 * I filtri del registro, nell'indirizzo: come quelli della tabella dei modelli.
 */
export function useActivityFilters() {
  const [params, setParams] = useSearchParams()
  const log = params.get('log')

  const filters: ActivityFilters = {
    log: log === 'catalogo' || log === 'staff' ? log : undefined,
    causer_id: toPositiveInteger(params.get('causer_id')),
    subject_type: params.get('subject_type') || undefined,
    from: toDate(params.get('from')),
    to: toDate(params.get('to')),
    page: toPositiveInteger(params.get('page')),
  }

  function setFilters(changes: Partial<ActivityFilters>) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)

        for (const [key, value] of Object.entries(changes)) {
          if (value === undefined || value === '') next.delete(key)
          else next.set(key, String(value))
        }

        // Con un filtro diverso si riparte dalla prima pagina
        if (!('page' in changes)) next.delete('page')

        return next
      },
      { preventScrollReset: true },
    )
  }

  return { filters, setFilters }
}

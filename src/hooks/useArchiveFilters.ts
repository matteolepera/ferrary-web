import { useSearchParams } from 'react-router'
import type { ModelFilters } from '@/api/models'
import type { PowertrainType } from '@/types/catalog'

const SORTS = ['name', '-name', 'year', '-year'] as const
const POWERTRAINS: readonly PowertrainType[] = [
  'termico',
  'ibrido',
  'elettrico',
]

/** Un valore ammesso tra quelli dell'elenco, altrimenti nessun valore */
function oneOf<T extends string>(
  value: string | null,
  allowed: readonly T[],
): T | undefined {
  return allowed.includes(value as T) ? (value as T) : undefined
}

/** Un numero intero, altrimenti nessun valore: "1980" diventa 1980, "abc" viene ignorato */
function toInteger(value: string | null): number | undefined {
  if (value === null || value === '') {
    return undefined
  }

  const number = Number(value)

  return Number.isInteger(number) ? number : undefined
}

type SetOptions = {
  /** Sostituisce la voce della cronologia invece di aggiungerne una (es. mentre si digita) */
  replace?: boolean
}

/**
 * I filtri dell'archivio, salvati nell'indirizzo della pagina.
 * Indietro, Avanti e i link condivisi funzionano come ci si aspetta.
 */
export function useArchiveFilters() {
  const [params, setParams] = useSearchParams()

  // Dall'indirizzo ai filtri: i valori non validi vengono semplicemente ignorati
  const filters: ModelFilters = {
    search: params.get('search') || undefined,
    category: params.get('category') || undefined,
    powertrain: oneOf(params.get('powertrain'), POWERTRAINS),
    year_from: toInteger(params.get('year_from')),
    year_to: toInteger(params.get('year_to')),
    sort: oneOf(params.get('sort'), SORTS),
    page: toInteger(params.get('page')),
  }

  // Dai filtri all'indirizzo: i valori vuoti spariscono dalla URL
  function setFilters(
    changes: Partial<ModelFilters>,
    { replace = false }: SetOptions = {},
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

        // Con un filtro diverso, i risultati cambiano: si riparte dalla prima pagina
        if (!('page' in changes)) {
          next.delete('page')
        }

        return next
      },
      { replace },
    )
  }

  function clearFilters() {
    setParams({})
  }

  return { filters, setFilters, clearFilters }
}

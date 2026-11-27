import { useSearchParams } from 'react-router'

type Changes<K extends string> = Partial<
  Record<K | 'search' | 'page', string | number | undefined>
>

/** La pagina dall'indirizzo: un intero positivo, altrimenti la prima */
function toPage(value: string | null) {
  const number = Number(value)
  return value && Number.isInteger(number) && number > 0 ? number : 1
}

/**
 * Ricerca, filtri e pagina di un elenco, nell'indirizzo: come per i modelli, si possono salvare
 * e condividere, e Indietro torna ai filtri di prima. keys sono i nomi dei filtri ("architecture").
 */
export function useListParams<K extends string>(keys: readonly K[]) {
  const [params, setParams] = useSearchParams()

  const filters = Object.fromEntries(
    keys.map((key) => [key, params.get(key) || undefined]),
  ) as Record<K, string | undefined>

  function set(changes: Changes<K>, { replace = false } = {}) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)

        for (const [key, value] of Object.entries(changes)) {
          if (value === undefined || value === '') next.delete(key)
          else next.set(key, String(value))
        }

        // Con un filtro diverso i risultati cambiano: si riparte dalla prima pagina
        if (!('page' in changes)) next.delete('page')

        return next
      },
      { replace, preventScrollReset: true },
    )
  }

  return {
    search: params.get('search') ?? '',
    page: toPage(params.get('page')),
    filters,
    set,
    /** Vero se c'è almeno un filtro o una ricerca: il testo dell'elenco vuoto cambia */
    hasFilters: Boolean(
      params.get('search') || keys.some((key) => params.get(key)),
    ),
    /** Azzera ricerca e filtri */
    clear: () =>
      set(
        Object.fromEntries(
          [...keys, 'search'].map((key) => [key, undefined]),
        ) as Changes<K>,
      ),
  }
}

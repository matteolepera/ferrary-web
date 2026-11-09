import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { fetchModels } from '@/api/models'
import { useDebounced } from '@/hooks/useDebounced'

/** Quanti modelli mostrare nei suggerimenti: gli altri sono nell'archivio */
const MAX_RESULTS = 5

/**
 * La ricerca veloce, condivisa da barra del desktop e dock: il testo, i modelli che corrispondono,
 * la scelta con le frecce e l'apertura con Invio.
 */
export function useQuickSearch(onClose: () => void) {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  // L'indice del risultato scelto con le frecce; -1 vuol dire "nessuno": Invio apre tutti i risultati
  const [active, setActive] = useState(-1)
  const search = useDebounced(term.trim(), 250)
  const typed = term.trim()

  // La stessa chiave della cache dell'archivio: aprendolo dopo, i risultati sono già pronti
  const { data, isFetching } = useQuery({
    queryKey: ['models', i18n.language, { search }],
    queryFn: () => fetchModels({ search }),
    enabled: search.length > 0,
    placeholderData: keepPreviousData,
  })
  const results = search ? (data?.data.slice(0, MAX_RESULTS) ?? []) : []

  function change(value: string) {
    setTerm(value)
    setActive(-1)
  }

  function go(to: string) {
    onClose()
    navigate(to)
  }

  const openModel = (slug: string) => go(`/modelli/${slug}`)
  const openAll = () => go(`/modelli?search=${encodeURIComponent(typed)}`)

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((current) => Math.min(current + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((current) => Math.max(current - 1, -1))
    } else if (event.key === 'Enter' && typed) {
      event.preventDefault()
      const picked = results[active]
      if (picked) openModel(picked.slug)
      else openAll()
    }
  }

  return {
    term,
    typed,
    change,
    results,
    active,
    // Nessun risultato: lo diciamo solo quando la risposta è arrivata, non mentre arriva
    empty: search.length > 0 && !isFetching && results.length === 0,
    onKeyDown,
    openModel,
    openAll,
  }
}

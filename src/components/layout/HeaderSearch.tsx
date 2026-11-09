import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { fetchModels } from '@/api/models'
import { useDebounced } from '@/hooks/useDebounced'

/** Quanti modelli mostrare sotto la barra: gli altri sono nell'archivio */
const MAX_RESULTS = 5

type HeaderSearchProps = {
  onClose: () => void
}

/**
 * La ricerca nella barra della Y: un campo, e sotto i modelli che corrispondono mentre si scrive.
 * Frecce per scegliere, Invio per aprire, Esc per chiudere.
 */
export function HeaderSearch({ onClose }: HeaderSearchProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  // L'indice del risultato scelto con le frecce; -1 vuol dire "nessuno": Invio apre tutti i risultati
  const [active, setActive] = useState(-1)
  const search = useDebounced(term.trim(), 250)
  const input = useRef<HTMLInputElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const listId = useId()

  // La stessa chiave della cache dell'archivio: aprendolo dopo, i risultati sono già pronti
  const { data, isFetching } = useQuery({
    queryKey: ['models', i18n.language, { search }],
    queryFn: () => fetchModels({ search }),
    enabled: search.length > 0,
    placeholderData: keepPreviousData,
  })
  const results = search ? (data?.data.slice(0, MAX_RESULTS) ?? []) : []
  const typed = term.trim()

  // Aperta: il cursore nel campo
  useEffect(() => {
    input.current?.focus()
  }, [])

  // Un clic fuori dalla ricerca la chiude
  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) onClose()
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [onClose])

  function go(to: string) {
    onClose()
    navigate(to)
  }

  const allResults = () => go(`/modelli?search=${encodeURIComponent(typed)}`)

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
      if (picked) go(`/modelli/${picked.slug}`)
      else allResults()
    }
  }

  return (
    <div
      ref={container}
      className="relative flex flex-1 items-center gap-3 pr-1"
    >
      <Search
        aria-hidden="true"
        className="text-rosso-acceso size-4 shrink-0"
      />

      <input
        ref={input}
        type="text"
        role="combobox"
        aria-label={t('nav.searchLabel')}
        aria-expanded={typed.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        placeholder={t('nav.searchPlaceholder')}
        value={term}
        onChange={(event) => {
          setTerm(event.target.value)
          setActive(-1)
        }}
        onKeyDown={onKeyDown}
        className="h-11 flex-1 bg-transparent text-[0.9375rem] text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
      />

      <button
        type="button"
        aria-label={t('nav.searchClose')}
        onClick={onClose}
        className="shrink-0 rounded-[2px] border border-white/15 px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.14em] text-neutral-400 uppercase transition-colors hover:border-white/40 hover:text-white"
      >
        Esc
      </button>

      {/* I risultati, sotto la barra, con la stessa forma della Y */}
      {typed && (
        <div className="absolute top-full -right-5 left-0 mt-4 rounded-[3px] rounded-tl-[18px] bg-neutral-900 p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] [clip-path:polygon(0_0,100%_0,100%_calc(100%-20px),calc(100%-20px)_100%,0_100%)]">
          <ul id={listId} role="listbox" aria-label={t('nav.searchLabel')}>
            {results.map((model, place) => (
              <li
                key={model.id}
                id={`${listId}-${place}`}
                role="option"
                aria-selected={place === active}
                // Il campo non perde il focus cliccando un risultato
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => go(`/modelli/${model.slug}`)}
                className={[
                  'flex cursor-pointer items-center gap-4 rounded-[2px] rounded-tl-[12px] px-3 py-2.5 text-[0.9375rem] transition-colors',
                  place === active
                    ? 'bg-white/[0.07] text-white'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white',
                ].join(' ')}
              >
                <span className="bg-ombra riflettore relative h-11 w-[4.5rem] shrink-0 overflow-hidden rounded-[2px] rounded-tl-[8px]">
                  {model.cover && (
                    <img
                      src={model.cover.url}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate">{model.name}</span>
                <span className="shrink-0 text-[0.625rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase">
                  {[model.category?.name, model.first_year]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </li>
            ))}
          </ul>

          {search && !isFetching && results.length === 0 && (
            <p className="px-3 py-3 text-sm text-neutral-400">
              {t('nav.searchEmpty')}
            </p>
          )}

          <button
            type="button"
            onPointerDown={(event) => event.preventDefault()}
            onClick={allResults}
            className="text-rosso-acceso flex w-full items-center justify-between rounded-[2px] px-3 py-3 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase hover:bg-white/5"
          >
            {t('nav.searchAll', { term: typed })}
            <span aria-hidden="true">Invio ↵</span>
          </button>
        </div>
      )}
    </div>
  )
}

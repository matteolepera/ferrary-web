import { useId, useState, type KeyboardEvent } from 'react'
import { FieldMessages } from '@/components/admin/ui/FieldMessages'
import { Icon } from '@/components/admin/ui/Icon'
import { useFieldA11y } from '@/components/admin/ui/useFieldA11y'
import { useAdminModels } from '@/hooks/useAdminModels'
import { useDebounced } from '@/hooks/useDebounced'

export type ModelOption = { id: number; name: string }

/** Quanti risultati mostrare: oltre, conviene scrivere qualche lettera in più */
const MAX_RESULTS = 8

type PredecessorPickerProps = {
  value: ModelOption | null
  onChange: (value: ModelOption | null) => void
  /** Il modello che si sta modificando: non può precedere se stesso */
  excludeId?: number
  error?: string
}

/**
 * La scelta del predecessore: si scrive una parte del nome e si sceglie tra i risultati.
 * Segue lo schema "combobox" di WAI-ARIA: frecce per muoversi, Invio per scegliere, Esc per chiudere.
 */
export function PredecessorPicker({
  value,
  onChange,
  excludeId,
  error,
}: PredecessorPickerProps) {
  const hint =
    'Il modello che è venuto prima: la pagina pubblica lo mostra nella discendenza.'
  const { fieldId, hintId, errorId, describedBy, invalid } = useFieldA11y(
    undefined,
    hint,
    error,
  )
  const listId = useId()

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  // Dopo aver tolto il predecessore, il focus torna nel campo di ricerca
  const [focusSearch, setFocusSearch] = useState(false)

  const search = useDebounced(query.trim())
  const { data, isFetching } = useAdminModels(
    { search },
    { enabled: open && search.length > 0 },
  )

  const results = (data?.data ?? [])
    .filter((model) => model.id !== excludeId)
    .slice(0, MAX_RESULTS)
  const showList = open && search.length > 0 && results.length > 0

  function choose(model: ModelOption) {
    onChange({ id: model.id, name: model.name })
    setQuery('')
    setOpen(false)
    setActive(-1)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      if (results.length === 0) return

      const step = event.key === 'ArrowDown' ? 1 : -1
      // Arrivati in fondo si riparte dall'inizio, e viceversa
      setActive((current) => (current + step + results.length) % results.length)
    } else if (event.key === 'Enter' && showList && active >= 0) {
      // Invio sceglie il risultato, invece di inviare il form
      event.preventDefault()
      choose(results[active])
    } else if (event.key === 'Escape') {
      setOpen(false)
      setActive(-1)
    }
  }

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-2 block text-[0.6875rem] font-semibold tracking-[0.18em] text-neutral-400 uppercase"
      >
        Predecessore
      </label>

      {value ? (
        <div className="bg-notte flex h-13 items-center justify-between gap-3 rounded-2xl border border-white/10 px-4">
          <span
            id={fieldId}
            className="truncate text-[0.9375rem] font-semibold"
          >
            {value.name}
          </span>
          <button
            type="button"
            aria-label={`Togli ${value.name} come predecessore`}
            onClick={() => {
              onChange(null)
              setFocusSearch(true)
            }}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon path="M6 6l12 12M18 6L6 18" size={16} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div
            className={[
              'bg-notte flex h-13 items-center gap-2.5 rounded-2xl border px-4 transition-colors focus-within:border-neutral-300',
              error ? 'border-errore' : 'border-white/10',
            ].join(' ')}
          >
            <span aria-hidden="true" className="flex text-neutral-500">
              <Icon
                path="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5"
                size={16}
              />
            </span>
            <input
              id={fieldId}
              role="combobox"
              aria-expanded={showList}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                showList && active >= 0
                  ? `${listId}-${results[active].id}`
                  : undefined
              }
              aria-invalid={invalid}
              aria-describedby={describedBy}
              autoComplete="off"
              autoFocus={focusSearch}
              value={query}
              placeholder="Cerca un modello"
              onChange={(event) => {
                setQuery(event.target.value)
                setOpen(true)
                setActive(-1)
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              onKeyDown={handleKeyDown}
              className="h-full min-w-0 flex-1 bg-transparent text-[0.9375rem] text-neutral-100 outline-none placeholder:text-neutral-600"
            />
          </div>

          <ul
            id={listId}
            role="listbox"
            aria-label="Modelli trovati"
            hidden={!showList}
            className="border-linea bg-ombra absolute inset-x-0 z-20 mt-2 rounded-2xl border p-1.5 shadow-[0_20px_40px_rgb(0_0_0/0.5)]"
          >
            {results.map((model, index) => (
              <li
                key={model.id}
                id={`${listId}-${model.id}`}
                role="option"
                aria-selected={index === active}
                // mousedown e non click: arriva prima del blur del campo, che chiuderebbe l'elenco
                onMouseDown={(event) => {
                  event.preventDefault()
                  choose(model)
                }}
                className={[
                  'flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm',
                  index === active
                    ? 'text-notte bg-white'
                    : 'text-neutral-100 hover:bg-white/5',
                ].join(' ')}
              >
                <span className="truncate font-semibold">{model.name}</span>
                <span
                  className={
                    index === active ? 'text-neutral-600' : 'text-neutral-500'
                  }
                >
                  {model.category?.name.it}
                </span>
              </li>
            ))}
          </ul>

          {/* Cosa sta succedendo, annunciato senza interrompere */}
          <p role="status" className="sr-only">
            {open &&
              search.length > 0 &&
              !isFetching &&
              results.length === 0 &&
              'Nessun modello trovato.'}
            {showList && `${results.length} risultati.`}
          </p>
          {open && search.length > 0 && !isFetching && results.length === 0 && (
            <p
              aria-hidden="true"
              className="mt-2 text-[0.8125rem] text-neutral-500"
            >
              Nessun modello trovato.
            </p>
          )}
        </div>
      )}

      <FieldMessages
        hint={hint}
        error={error}
        hintId={hintId}
        errorId={errorId}
      />
    </div>
  )
}

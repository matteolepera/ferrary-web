import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '@/components/admin/ui/Icon'

type AdminSearchProps = {
  label: string
  /** Il valore attuale, dall'indirizzo */
  value: string
  /** Chiamata 300 ms dopo l'ultimo tasto */
  onSearch: (value: string) => void
  placeholder?: string
}

/**
 * La ricerca a pillola dell'admin: aggiorna i risultati mentre scrivi, senza una richiesta per ogni lettera.
 */
export function AdminSearch({
  label,
  value,
  onSearch,
  placeholder,
}: AdminSearchProps) {
  const id = useId()
  const [text, setText] = useState(value)

  // Se l'indirizzo cambia da fuori, ad esempio con Indietro o "Azzera filtri", il campo si adegua
  const [lastValue, setLastValue] = useState(value)
  if (value !== lastValue) {
    setLastValue(value)
    setText(value)
  }

  // Sempre l'ultima versione della funzione, senza far ripartire l'attesa a ogni ridisegno
  const onSearchRef = useRef(onSearch)
  useEffect(() => {
    onSearchRef.current = onSearch
  })

  useEffect(() => {
    if (text === value) return

    const timer = setTimeout(() => onSearchRef.current(text.trim()), 300)

    return () => clearTimeout(timer)
  }, [text, value])

  return (
    <div className="bg-ombra flex h-11 min-w-56 flex-1 items-center gap-2.5 rounded-full border border-white/10 px-4 transition-colors focus-within:border-neutral-300 md:max-w-80">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span aria-hidden="true" className="flex text-neutral-500">
        <Icon
          path="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5"
          size={16}
        />
      </span>
      <input
        id={id}
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-500"
      />
    </div>
  )
}

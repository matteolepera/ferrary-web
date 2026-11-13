import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { yFocusMark } from '@/components/ui/yFocus'
import { useDebounced } from '@/hooks/useDebounced'

type ArchiveSearchProps = {
  /** La ricerca attiva, come è nell'indirizzo */
  value: string
  /** Chiamata quando si smette di scrivere, con il testo senza spazi ai lati, o undefined se è vuoto */
  onChange: (value: string | undefined) => void
  /** Mette il cursore nel campo appena la pagina si apre, come dal pulsante "Cerca" */
  autoFocus?: boolean
  className?: string
}

/**
 * Il campo di ricerca dell'archivio, dentro la barra con la forma della Y.
 * La ricerca parte quando si smette di scrivere, non a ogni lettera.
 */
export function ArchiveSearch({
  value,
  onChange,
  autoFocus,
  className = '',
}: ArchiveSearchProps) {
  const { t } = useTranslation()
  const [text, setText] = useState(value)
  const typed = text.trim()
  const debounced = useDebounced(typed, 300)
  const input = useRef<HTMLInputElement>(null)

  // Quando il filtro cambia da fuori, con "Azzera i filtri" o con Indietro, il campo si allinea.
  // Si confronta con il valore precedente durante il disegno, senza un effetto in più
  const [previous, setPrevious] = useState(value)
  if (value !== previous) {
    setPrevious(value)
    if (value !== typed) setText(value)
  }

  // Si smette di scrivere: la ricerca parte. Solo quando l'attesa è finita, cioè quando il testo
  // atteso è uguale a quello scritto, così un valore vecchio non rimette un filtro appena tolto
  useEffect(() => {
    if (debounced === typed && debounced !== value) {
      onChange(debounced || undefined)
    }
  }, [debounced, typed, value, onChange])

  // Dal pulsante "Cerca": il campo prende il cursore, e su telefono si apre la tastiera.
  // Aspettiamo un fotogramma, perché dopo un cambio di pagina il layout porta il focus sul contenuto principale
  useEffect(() => {
    if (!autoFocus) return

    const frame = requestAnimationFrame(() => input.current?.focus())

    return () => cancelAnimationFrame(frame)
  }, [autoFocus])

  return (
    <label
      className={`${yFocusMark} flex h-14 items-center after:left-12 after:translate-x-0 lg:h-full ${className}`}
    >
      <span className="sr-only">{t('archive.searchLabel')}</span>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-5 size-4 text-neutral-400"
      />
      <input
        ref={input}
        type="search"
        value={text}
        placeholder={t('nav.searchPlaceholder')}
        onChange={(event) => setText(event.target.value)}
        className="h-full w-full bg-transparent pr-4 pl-12 text-[0.9375rem] text-neutral-100 placeholder:text-neutral-500 focus-visible:outline-none"
      />
    </label>
  )
}

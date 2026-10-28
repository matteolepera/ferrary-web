import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/** Quanto aspettare dopo l'ultima lettera prima di cercare */
const DEBOUNCE_MS = 300

type ArchiveSearchProps = {
  /** La ricerca attuale, letta dall'indirizzo */
  value: string
  /** Chiamata quando l'utente ha finito di scrivere */
  onChange: (value: string) => void
}

/**
 * Campo di ricerca dell'archivio: aggiorna l'indirizzo solo quando si smette di scrivere.
 */
export function ArchiveSearch({ value, onChange }: ArchiveSearchProps) {
  const { t } = useTranslation()
  const [text, setText] = useState(value)
  const [lastValue, setLastValue] = useState(value)

  // Se la ricerca cambia da fuori (Indietro, "Azzera i filtri"), il campo si allinea
  if (value !== lastValue) {
    setLastValue(value)
    setText(value)
  }

  // Dopo l'ultima lettera, aspetta un attimo; ogni nuova lettera ricomincia l'attesa
  useEffect(() => {
    if (text === value) {
      return
    }

    const timer = setTimeout(() => onChange(text.trim()), DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [text, value, onChange])

  return (
    <label className="relative flex items-center lg:w-80">
      <span className="sr-only">{t('archive.searchLabel')}</span>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 size-4 text-neutral-400"
      />
      <input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={t('archive.searchPlaceholder')}
        className={[
          'border-linea bg-ombra w-full border py-3.5 pr-4 pl-11 text-[0.9375rem] text-neutral-100',
          'placeholder:text-neutral-500 focus:border-neutral-400 focus:outline-none',
        ].join(' ')}
      />
    </label>
  )
}

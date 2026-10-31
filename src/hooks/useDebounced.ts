import { useEffect, useState } from 'react'

/**
 * Lo stesso valore, ma aggiornato solo quando smette di cambiare per un po':
 * con la ricerca, una richiesta quando si fa una pausa, non a ogni lettera.
 */
export function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

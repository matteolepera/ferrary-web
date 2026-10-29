import { useEffect, useRef } from 'react'

/**
 * Esegue callback quando l'elemento collegato al ref si avvicina allo schermo.
 */
export function useWhenVisible(callback: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current

    if (!element || !enabled) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          callback()
        }
      },
      // Scatta 400 pixel prima del fondo: la pagina nuova arriva prima che serva
      { rootMargin: '0px 0px 400px 0px' },
    )

    observer.observe(element)

    // Pulizia: smette di osservare quando cambia qualcosa o la pagina si chiude
    return () => observer.disconnect()
  }, [callback, enabled])

  return ref
}

import { useEffect, useState } from 'react'

/**
 * Vero quando la sezione con quell'id attraversa il centro dello schermo.
 * Con enabled falso non guarda niente: serve solo nella pagina che contiene la sezione.
 */
export function useSectionInView(id: string, enabled: boolean) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    // Nei test e nei browser molto vecchi non esiste: la voce resta semplicemente spenta
    if (!enabled || !('IntersectionObserver' in window)) return

    let intersection: IntersectionObserver | undefined
    let mutation: MutationObserver | undefined

    const watch = (element: Element) => {
      intersection = new IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        {
          // Una linea sottile a metà schermo: la sezione è "attiva" quando la attraversa
          rootMargin: '-45% 0px -45% 0px',
        },
      )
      intersection.observe(element)
    }

    const element = document.getElementById(id)

    if (element) {
      watch(element)
    } else {
      // La pagina arriva dopo l'intestazione, caricata a parte: aspettiamo che la sezione compaia
      mutation = new MutationObserver(() => {
        const found = document.getElementById(id)
        if (found) {
          mutation?.disconnect()
          watch(found)
        }
      })
      mutation.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      intersection?.disconnect()
      mutation?.disconnect()
    }
  }, [id, enabled])

  // Fuori dalla pagina giusta la sezione non c'è, qualunque sia l'ultimo valore
  return enabled && inView
}

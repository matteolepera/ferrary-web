import { useEffect, useState } from 'react'

/**
 * Vero quando la pagina è scesa oltre la soglia, in pixel.
 * Serve a cambiare l'aspetto di un elemento fisso appena si comincia a scorrere.
 */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > threshold)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)

    // Allineato subito: tornando indietro, la pagina può riaprirsi già scorsa
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

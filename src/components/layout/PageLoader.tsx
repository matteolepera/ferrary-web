/**
 * Mostrato solo al primo caricamento, mentre arriva il file della pagina:
 * lo stesso nero del sito, così il passaggio non si nota.
 */
export function PageLoader() {
  return <div aria-busy="true" className="bg-notte min-h-screen" />
}

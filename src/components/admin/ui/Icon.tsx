/**
 * Icona dell'area admin: un tracciato SVG con lo stile della bozza.
 * Decorativa: il nome lo dà sempre il testo accanto, o l'etichetta del pulsante.
 */
export function Icon({ path, size = 20 }: { path: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

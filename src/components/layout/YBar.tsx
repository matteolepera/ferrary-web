import { useId } from 'react'

/** Il contorno della barra, sulle regole della Y: un angolo tondo in alto a sinistra, quasi vivi gli altri, un taglio in basso a destra */
const OUTLINE =
  'M0 20 A20 20 0 0 1 20 0 L795 0 Q800 0 800 5 L800 36 L776 60 L5 60 Q0 60 0 55 Z'

/**
 * Lo sfondo della barra di navigazione del desktop: la forma, il bordo e la trama di carbonio.
 * Larga 800 e alta 60: la barra ha queste misure fisse, così gli angoli non si deformano.
 */
export function YBar({ className = '' }: { className?: string }) {
  // Un id unico per la trama: due barre nella stessa pagina non si confonderebbero
  const carbon = useId()

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 60"
      className={`absolute inset-0 size-full overflow-visible ${className}`}
    >
      <defs>
        <pattern
          id={carbon}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="3" height="6" fill="rgba(255,255,255,0.022)" />
        </pattern>
      </defs>
      <path
        d={OUTLINE}
        fill="rgba(16,16,16,0.92)"
        stroke="rgba(255,255,255,0.13)"
      />
      <path d={OUTLINE} fill={`url(#${carbon})`} />
      {/* Un filo di luce sul bordo superiore, come una superficie lucida */}
      <path d="M20 0.5 L795 0.5" stroke="rgba(255,255,255,0.09)" />
    </svg>
  )
}

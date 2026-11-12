import type { ReactNode } from 'react'

type EyebrowProps = {
  /** h2 quando è il titolo della sezione, p quando sta sopra un titolo vero */
  as?: 'h2' | 'p'
  id?: string
  className?: string
  children: ReactNode
}

/**
 * L'etichetta rossa di una sezione, con il segno obliquo della Y davanti.
 */
export function Eyebrow({
  as: Tag = 'p',
  id,
  className = '',
  children,
}: EyebrowProps) {
  return (
    <Tag
      id={id}
      className={`text-rosso-acceso flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs ${className}`}
    >
      <span
        aria-hidden="true"
        className="bg-rosso-acceso h-[3px] w-3.5 shrink-0 -skew-x-[28deg] shadow-[0_0_8px_rgba(255,59,48,0.6)]"
      />
      {children}
    </Tag>
  )
}

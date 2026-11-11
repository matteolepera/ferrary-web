import type { ReactNode } from 'react'

type YPanelProps = {
  className?: string
  children: ReactNode
}

/**
 * Un pannello con la forma della Y: l'angolo grande in alto a sinistra, gli altri quasi vivi,
 * il taglio in basso a destra, con la trama di carbonio e il filo di luce in alto.
 * Quando un controllo dentro è attivo, il bordo si schiarisce seguendo la forma.
 */
export function YPanel({ className = '', children }: YPanelProps) {
  return (
    <div
      className={[
        'group relative rounded-[4px] rounded-tl-[20px] [clip-path:polygon(0_0,100%_0,100%_calc(100%-22px),calc(100%-22px)_100%,0_100%)]',
        'bg-neutral-900 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.022)_0_2px,transparent_2px_6px)]',
        // Il bordo e il filo di luce: ombre interne, che il ritaglio non taglia
        'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.07)] transition-shadow duration-300',
        'focus-within:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]',
        className,
      ].join(' ')}
    >
      {children}
      {/* Il bordo del taglio, che le ombre interne non disegnano: si schiarisce insieme al bordo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-px w-[31px] origin-bottom-right -rotate-45 bg-white/12 transition-colors duration-300 group-focus-within:bg-white/30"
      />
    </div>
  )
}

/** Il separatore inclinato della Y, tra due controlli dello stesso pannello */
export function YSeparator({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`h-6 w-px shrink-0 -skew-x-[20deg] self-center bg-white/14 ${className}`}
    />
  )
}

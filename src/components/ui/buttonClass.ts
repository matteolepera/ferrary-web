export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-rosso text-white hover:bg-rosso-scuro',
  secondary:
    'border border-white/40 text-white hover:bg-white hover:text-notte',
  ghost: 'text-white underline-offset-4 hover:underline',
}

/**
 * Classi del pulsante, riusabili anche sui link che devono sembrare pulsanti.
 */
export function buttonClass(
  variant: ButtonVariant = 'primary',
  className = '',
) {
  return [
    'inline-flex items-center justify-center gap-2 px-7 py-4',
    'text-xs font-semibold tracking-[0.18em] uppercase transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosso-acceso',
    'disabled:pointer-events-none disabled:opacity-40',
    variants[variant],
    className,
  ].join(' ')
}

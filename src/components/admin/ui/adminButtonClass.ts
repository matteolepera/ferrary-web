export type AdminButtonVariant = 'primary' | 'light' | 'outline'

const variants: Record<AdminButtonVariant, string> = {
  primary: 'bg-rosso text-white hover:bg-rosso-scuro',
  light: 'bg-white text-notte hover:bg-neutral-200',
  outline: 'border border-white/20 text-white hover:border-white/50',
}

/**
 * Classi del pulsante dell'area admin: a pillola, come nel pannello.
 * Separate dal componente per usarle anche sui Link.
 */
export function adminButtonClass(
  variant: AdminButtonVariant = 'primary',
  className = '',
) {
  return [
    'inline-flex h-12 items-center justify-center gap-2 rounded-full px-5',
    'text-sm font-semibold transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosso-acceso',
    'disabled:pointer-events-none disabled:opacity-40',
    variants[variant],
    className,
  ].join(' ')
}

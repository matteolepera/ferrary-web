import type { ComponentProps } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ComponentProps<'button'> & {
  /** primary: l'azione principale, una per schermata */
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-rosso text-white hover:bg-rosso-scuro',
  secondary:
    'border border-white/40 text-white hover:bg-white hover:text-notte',
  ghost: 'text-white underline-offset-4 hover:underline',
}

/**
 * Pulsante del design system: squadrato, in maiuscolo, con le lettere spaziate.
 */
export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 px-7 py-4',
        'text-xs font-semibold tracking-[0.18em] uppercase transition-colors',
        'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-40',
        variants[variant],
        className,
      ].join(' ')}
      {...props}
    />
  )
}

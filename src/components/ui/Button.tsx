import type { ComponentProps } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ComponentProps<'button'> & {
  /** primary: l'azione principale, una per schermata */
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-rosso text-white hover:bg-rosso-scuro',
  secondary:
    'border border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900',
  ghost: 'text-neutral-900 underline-offset-4 hover:underline',
}

/**
 * Pulsante del design system. Premuto, "affonda" leggermente come un tasto fisico.
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
        'inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-medium',
        'ease-scatto transition duration-150 active:scale-[0.97]',
        'focus-visible:outline-rosso focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-40',
        variants[variant],
        className,
      ].join(' ')}
      {...props}
    />
  )
}

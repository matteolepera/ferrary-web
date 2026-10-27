import type { ComponentProps } from 'react'
import { buttonClass, type ButtonVariant } from '@/components/ui/buttonClass'

type ButtonProps = ComponentProps<'button'> & {
  /** primary: l'azione principale, una per schermata */
  variant?: ButtonVariant
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
      className={buttonClass(variant, className)}
      {...props}
    />
  )
}

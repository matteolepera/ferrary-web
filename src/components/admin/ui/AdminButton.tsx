import type { ComponentProps } from 'react'
import { adminButtonClass, type AdminButtonVariant } from './adminButtonClass'

type AdminButtonProps = ComponentProps<'button'> & {
  variant?: AdminButtonVariant
}

export function AdminButton({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={adminButtonClass(variant, className)}
      {...props}
    />
  )
}

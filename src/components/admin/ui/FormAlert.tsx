import type { ReactNode } from 'react'

type FormAlertProps = {
  children: ReactNode
  /** Lo spazio intorno, che dipende da dove sta: "mb-5", "mt-4" */
  className?: string
}

/**
 * L'errore generale di una finestra, in cima ai campi: ad esempio quando il server non risponde.
 * Gli errori di un campo restano sotto il campo.
 */
export function FormAlert({ children, className = '' }: FormAlertProps) {
  return (
    <p
      role="alert"
      className={`border-errore/40 bg-errore/10 text-errore rounded-2xl border px-4 py-3 text-[0.8125rem] ${className}`}
    >
      {children}
    </p>
  )
}

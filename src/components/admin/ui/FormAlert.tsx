import type { ReactNode } from 'react'

/**
 * L'errore generale di una finestra, in cima ai campi: ad esempio quando il server non risponde.
 * Gli errori di un campo restano sotto il campo.
 */
export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="border-errore/40 bg-errore/10 text-errore rounded-2xl border px-4 py-3 text-[0.8125rem]"
    >
      {children}
    </p>
  )
}

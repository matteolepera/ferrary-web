import { useId } from 'react'

/**
 * Gli id e gli attributi che collegano un campo alla sua etichetta, al suggerimento e all'errore.
 * Condivisa da tutti i campi dell'admin, così si comportano allo stesso modo.
 */
export function useFieldA11y(
  id: string | undefined,
  hint?: string,
  error?: string,
) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const hintId = `${fieldId}-suggerimento`
  const errorId = `${fieldId}-errore`

  return {
    fieldId,
    hintId,
    errorId,
    // I testi che il lettore di schermo legge insieme al campo
    describedBy:
      [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined,
    invalid: error ? true : undefined,
  }
}

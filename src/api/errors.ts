import { isAxiosError } from 'axios'
import type { ValidationError } from '@/types/api'

/**
 * Vero se l'API ha risposto 404: la risorsa non esiste, o non è pubblicata.
 */
export function isNotFound(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404
}

/**
 * Vero se l'API ha risposto 401: nessun utente collegato.
 */
export function isUnauthenticated(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 401
}

/**
 * Gli errori di validazione di una risposta 422, campo per campo; null se l'errore è di altro tipo.
 */
export function validationErrors(
  error: unknown,
): ValidationError['errors'] | null {
  if (isAxiosError<ValidationError>(error) && error.response?.status === 422) {
    return error.response.data.errors
  }

  return null
}

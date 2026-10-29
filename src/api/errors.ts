import { isAxiosError } from 'axios'

/**
 * Vero se l'API ha risposto 404: la risorsa non esiste, o non è pubblicata.
 */
export function isNotFound(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404
}

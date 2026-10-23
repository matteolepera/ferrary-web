import 'i18next'
import type it from './locales/it.json'

/**
 * Le chiavi delle traduzioni sono quelle del file italiano:
 * una chiave inesistente diventa un errore di TypeScript.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof it
    }
  }
}

import axios from 'axios'
import { i18n } from '@/i18n'

/**
 * Client HTTP per l'API di Ferrary.
 * Invia il cookie di sessione e il token CSRF, come richiesto da Sanctum.
 */
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    // Errori in JSON (es. 401) invece di redirect a pagine HTML
    Accept: 'application/json',
  },
})

/**
 * Ottiene il cookie CSRF: va chiamata prima del login.
 */
export function initCsrf() {
  // La rotta di Sanctum non sta sotto /api, quindi cambiamo la base solo per questa chiamata
  return api.get('/sanctum/csrf-cookie', {
    baseURL: import.meta.env.VITE_API_URL,
  })
}

// Ogni richiesta chiede i contenuti nella lingua scelta dal visitatore
api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.language

  return config
})

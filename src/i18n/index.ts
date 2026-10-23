import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import it from './locales/it.json'

/** Lingue del sito; la prima è quella predefinita */
export const languages = ['it', 'en'] as const
export type Language = (typeof languages)[number]

i18n.use(initReactI18next).init({
  resources: {
    it: { translation: it },
    en: { translation: en },
  },
  lng: 'it',
  // Se manca una traduzione, si usa l'italiano: la stessa regola del backend
  fallbackLng: 'it',
  interpolation: {
    // React protegge già dall'XSS: non serve un secondo escape
    escapeValue: false,
  },
})

export { i18n }

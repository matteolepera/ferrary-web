import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import it from './locales/it.json'

/** Lingue del sito; la prima è quella predefinita */
export const languages = ['it', 'en'] as const
export type Language = (typeof languages)[number]

const STORAGE_KEY = 'ferrary-language'

/**
 * Controlla che un valore sia una delle lingue del sito.
 */
function isLanguage(value: unknown): value is Language {
  return languages.includes(value as Language)
}

/**
 * Lingua iniziale: quella scelta in passato, altrimenti quella del browser, altrimenti l'italiano.
 */
function initialLanguage(): Language {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (isLanguage(saved)) {
    return saved
  }

  // "en-US" → "en"
  const browser = navigator.language.slice(0, 2)

  return isLanguage(browser) ? browser : 'it'
}

i18n.use(initReactI18next).init({
  resources: {
    it: { translation: it },
    en: { translation: en },
  },
  lng: initialLanguage(),
  // Se manca una traduzione, si usa l'italiano: la stessa regola del backend
  fallbackLng: 'it',
  interpolation: {
    // React protegge già dall'XSS: non serve un secondo escape
    escapeValue: false,
  },
})

// La pagina dichiara subito la sua lingua...
document.documentElement.lang = i18n.language

// ...e a ogni cambio la aggiorna e ricorda la scelta
i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
  localStorage.setItem(STORAGE_KEY, language)
})

export { i18n }

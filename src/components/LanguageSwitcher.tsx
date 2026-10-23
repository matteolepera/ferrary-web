import { useTranslation } from 'react-i18next'
import { languages, type Language } from '@/i18n'

// Ogni lingua scritta nella sua lingua: chi cerca l'italiano riconosce "Italiano"
const labels = {
  it: 'Italiano',
  en: 'English',
} satisfies Record<Language, string>

/**
 * Pulsanti per cambiare la lingua del sito.
 */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className="flex gap-1 text-sm"
    >
      {languages.map((language) => (
        <button
          key={language}
          type="button"
          lang={language}
          aria-label={labels[language]}
          aria-pressed={i18n.language === language}
          onClick={() => i18n.changeLanguage(language)}
          className={`rounded px-2 py-1 font-medium ${
            i18n.language === language
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

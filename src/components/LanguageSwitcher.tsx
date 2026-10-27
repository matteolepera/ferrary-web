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
    <div role="group" aria-label={t('language.label')} className="flex gap-4">
      {languages.map((language) => (
        <button
          key={language}
          type="button"
          lang={language}
          aria-label={labels[language]}
          aria-pressed={i18n.language === language}
          onClick={() => i18n.changeLanguage(language)}
          className={[
            'border-b py-1 text-xs font-semibold tracking-[0.18em] transition-colors',
            'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-4',
            i18n.language === language
              ? 'border-white text-white'
              : 'border-transparent text-neutral-400 hover:text-white',
          ].join(' ')}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

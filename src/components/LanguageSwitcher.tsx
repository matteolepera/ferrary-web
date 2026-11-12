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
            'relative py-1 text-xs font-semibold tracking-[0.18em] transition-colors',
            'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-4',
            // Il segno obliquo sotto la lingua, come nella barra della Y: visibile solo su quella scelta
            "after:absolute after:-bottom-1 after:left-1/2 after:h-[3px] after:w-3 after:-translate-x-1/2 after:-skew-x-[28deg] after:content-['']",
            i18n.language === language
              ? 'text-rosso-acceso after:bg-rosso-acceso after:shadow-[0_0_8px_rgba(255,59,48,0.6)]'
              : 'text-neutral-400 hover:text-white',
          ].join(' ')}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

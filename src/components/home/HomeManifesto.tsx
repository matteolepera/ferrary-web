import { useTranslation } from 'react-i18next'

/**
 * Il manifesto: cos'è Ferrary, in poche righe.
 */
export function HomeManifesto() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto max-w-[1360px] px-5 py-18 md:px-10 md:py-24 lg:py-36">
      <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
        {t('home.manifesto.eyebrow')}
      </p>
      <h2 className="font-display mt-3.5 text-[2.125rem] leading-[1.05] font-extrabold tracking-[-0.035em] md:mt-4 md:text-[3.25rem] lg:text-[clamp(2.5rem,5.4vw,5rem)] lg:leading-[1.02]">
        <span className="block">{t('home.manifesto.titleStart')}</span>
        <span className="block text-neutral-600">
          {t('home.manifesto.titleEnd')}
        </span>
      </h2>
      <p className="mt-5 text-[0.9375rem] leading-relaxed text-neutral-300 md:mt-6 md:max-w-[56ch] md:text-[1.0625rem] lg:mt-7">
        {t('home.manifesto.text')}
      </p>
    </section>
  )
}

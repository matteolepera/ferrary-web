import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import heroImage from '@/assets/images/sf90-stradale.webp'
import { buttonClass } from '@/components/ui/buttonClass'

/**
 * L'apertura della home: la Ferrari in copertina, il titolo e l'ingresso all'archivio.
 */
export function HomeHero() {
  const { t } = useTranslation()

  return (
    <section className="relative flex flex-col items-center overflow-hidden lg:min-h-[54rem] lg:items-stretch">
      <div aria-hidden="true" className="riflettore absolute inset-0" />

      {/* L'auto: più larga dello schermo su mobile, grande e a destra dal desktop */}
      <div className="relative mt-24 w-[112%] md:mt-28 md:w-[96%] lg:absolute lg:top-1/2 lg:right-[-4%] lg:mt-0 lg:w-[64%] lg:-translate-y-[42%]">
        <img
          src={heroImage}
          alt={t('home.hero.imageAlt')}
          fetchPriority="high"
          className="w-full"
        />
      </div>

      <div className="relative mx-auto mt-10 w-full max-w-[1360px] px-5 pb-8 md:mt-14 md:px-10 md:pb-14 lg:mt-auto lg:flex lg:items-end lg:justify-between lg:gap-8 lg:pb-20">
        <div className="lg:max-w-[36rem]">
          <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
            {t('home.hero.eyebrow')}
          </p>

          <h1 className="font-display mt-3.5 text-[2.625rem] leading-none font-extrabold tracking-[-0.035em] md:mt-4 md:text-[4.25rem] md:leading-[0.98] lg:text-[clamp(3rem,5vw,5rem)]">
            <span className="lg:block">{t('home.hero.titleStart')}</span>{' '}
            <span className="lg:block">{t('home.hero.titleEnd')}</span>
          </h1>

          <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-300 md:mt-5 md:max-w-[46ch] md:text-[1.0625rem]">
            {t('home.hero.text')}
          </p>

          <div className="mt-6 flex flex-col md:mt-8 md:flex-row md:items-center md:gap-6">
            <Link
              to="/modelli"
              className={buttonClass('primary', 'w-full md:w-auto')}
            >
              {t('home.hero.cta')}
            </Link>
            {/* Su mobile resta solo l'azione principale */}
            <Link
              to="/#ere"
              className="hover:text-rosso-acceso hidden text-xs font-semibold tracking-[0.18em] uppercase md:inline"
            >
              {t('home.hero.eras')} →
            </Link>
          </div>
        </div>

        <p className="mt-3.5 text-center text-xs text-neutral-400 md:text-left lg:mt-0 lg:text-sm">
          {t('home.hero.caption')}
        </p>
      </div>
    </section>
  )
}

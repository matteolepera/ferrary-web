import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import heroLarge from '@/assets/images/sf90-stradale-2400.webp'
import heroSmall from '@/assets/images/sf90-stradale-1200.webp'
import { buttonClass } from '@/components/ui/buttonClass'

/**
 * L'apertura della home: la Ferrari in copertina, il titolo e l'ingresso all'archivio.
 */
export function HomeHero() {
  const { t } = useTranslation()

  return (
    <section className="relative flex min-h-[44rem] flex-col overflow-hidden md:min-h-[54rem] lg:min-h-[54rem]">
      <div aria-hidden="true" className="riflettore absolute inset-0" />

      {/* L'auto: sopra il testo su mobile e tablet, a destra dal desktop in su */}
      <div className="absolute inset-x-4 top-28 md:inset-x-10 md:top-32 lg:inset-x-auto lg:top-1/2 lg:right-[-2%] lg:w-[62%] lg:-translate-y-[45%]">
        <div
          aria-hidden="true"
          className="ombra-pavimento absolute inset-x-[8%] -bottom-[6%] h-[22%]"
        />
        <img
          src={heroLarge}
          srcSet={`${heroSmall} 1200w, ${heroLarge} 2400w`}
          sizes="(min-width: 1024px) 62vw, 100vw"
          alt={t('home.hero.imageAlt')}
          fetchPriority="high"
          className="relative w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
        />
      </div>

      <div className="relative mx-auto mt-auto w-full max-w-[1360px] px-5 pb-8 md:px-10 md:pb-14 lg:flex lg:items-end lg:justify-between lg:gap-8 lg:pb-20">
        <div className="lg:max-w-[38rem]">
          <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
            {t('home.hero.eyebrow')}
          </p>

          <h1 className="font-display mt-3.5 text-[2.625rem] leading-none font-extrabold tracking-[-0.035em] md:mt-4 md:text-[4.25rem] md:leading-[0.98] lg:text-[clamp(3rem,5.6vw,5.5rem)]">
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

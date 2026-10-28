import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { buttonClass } from '@/components/ui/buttonClass'

/**
 * La chiusura della home: un invito diretto all'archivio.
 */
export function HomeInvite() {
  const { t } = useTranslation()

  return (
    <section className="border-linea border-y">
      <div className="mx-auto max-w-[1360px] px-5 py-18 text-center md:px-10 md:py-24 lg:py-32">
        <h2 className="font-display text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.035em] md:text-[3.5rem] lg:text-[clamp(2.5rem,5vw,4.75rem)] lg:leading-[1.02]">
          <span className="block">{t('home.invite.titleStart')}</span>
          <span className="block text-neutral-600">
            {t('home.invite.titleEnd')}
          </span>
        </h2>
        <Link
          to="/modelli"
          className={buttonClass(
            'primary',
            'mt-7 w-full md:mt-8 md:w-auto lg:mt-10',
          )}
        >
          {t('home.invite.cta')}
        </Link>
      </div>
    </section>
  )
}

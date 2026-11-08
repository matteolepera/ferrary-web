import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Logo } from '@/components/Logo'

const GITHUB = 'https://github.com/matteolepera'

const headingClass =
  'text-[0.6875rem] font-semibold tracking-[0.22em] text-neutral-400 uppercase md:text-xs'
const linkClass =
  'text-sm text-neutral-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosso-acceso'

/**
 * Piè di pagina del sito pubblico: il logo come firma, con il copyright, e tre colonne di link.
 */
export function SiteFooter() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  // I link esterni si aprono in una nuova scheda: chi usa un lettore di schermo lo sente annunciare
  const external = (href: string, label: string) => (
    <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
      {label}
      <span className="sr-only"> {t('footer.newTab')}</span>
    </a>
  )

  return (
    <footer className="border-linea border-t">
      {/* In fondo, su mobile e tablet, lo spazio per il dock */}
      <div className="mx-auto flex max-w-[1360px] flex-col gap-12 px-5 pt-12 pb-32 md:px-10 md:pt-16 lg:flex-row lg:justify-between lg:gap-16 lg:pb-16">
        <div>
          <Logo className="h-10 w-auto md:h-12" />
          <p className="mt-5 max-w-[34ch] text-xs leading-relaxed text-neutral-400">
            {t('footer.rights', { year })}
          </p>
        </div>

        {/* Telefono: Esplora e Cataloghi affiancati, Il progetto sotto; dal tablet tre colonne */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-x-16">
          <nav aria-label={t('footer.explore')}>
            <h2 className={headingClass}>{t('footer.explore')}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <Link to="/modelli" className={linkClass}>
                  {t('nav.archive')}
                </Link>
              </li>
              <li>
                <Link to="/#famiglie" className={linkClass}>
                  {t('nav.families')}
                </Link>
              </li>
              <li>
                <Link to="/storia" className={linkClass}>
                  {t('nav.story')}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label={t('catalogs.eyebrow')}>
            <h2 className={headingClass}>{t('catalogs.eyebrow')}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <Link to="/motori" className={linkClass}>
                  {t('catalogs.engines.title')}
                </Link>
              </li>
              <li>
                <Link to="/designer" className={linkClass}>
                  {t('catalogs.designers.title')}
                </Link>
              </li>
              <li>
                <Link to="/piloti" className={linkClass}>
                  {t('catalogs.drivers.title')}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label={t('footer.project')}>
            <h2 className={headingClass}>{t('footer.project')}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>{external(`${GITHUB}/ferrary-web`, t('footer.webCode'))}</li>
              <li>{external(`${GITHUB}/ferrary-api`, t('footer.apiCode'))}</li>
              <li>
                {external(
                  `${import.meta.env.VITE_API_URL}/docs/api`,
                  t('footer.apiDocs'),
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}

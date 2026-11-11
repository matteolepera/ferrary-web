import { useTranslation } from 'react-i18next'
import { Link, useRouteError } from 'react-router'
import { Logo } from '@/components/Logo'
import { ButtonArrow } from '@/components/ui/ButtonArrow'
import { buttonClass } from '@/components/ui/buttonClass'
import { StatePage } from '@/components/ui/StatePage'

/**
 * La pagina mostrata quando un componente si rompe durante il disegno.
 */
export function RouteErrorPage() {
  const { t } = useTranslation()
  const error = useRouteError()

  return (
    <main className="relative min-h-screen">
      <title>{`${t('errors.unexpected.eyebrow')} – Ferrary`}</title>

      {/* Il logo, in alto: questa pagina sta fuori dal layout, quindi senza barra né dock */}
      <Link
        to="/"
        aria-label={t('nav.home')}
        className="absolute top-6 left-5 z-10 md:top-8 md:left-10"
      >
        <Logo alt="" className="h-7 w-auto" />
      </Link>

      <StatePage
        watermark="!?"
        eyebrow={t('errors.unexpected.eyebrow')}
        title={t('errors.unexpected.title')}
        text={t('errors.unexpected.text')}
        className="min-h-screen md:min-h-screen"
      >
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={buttonClass('cta')}
        >
          {t('errors.unexpected.reload')}
        </button>
        {/* Un link "vero": ricarica tutto il sito, nel caso il problema fosse nello stato dell'app */}
        <a href="/" className={buttonClass('ctaGhost')}>
          {t('errors.unexpected.home')}
          <ButtonArrow />
        </a>
      </StatePage>

      {/* Solo in sviluppo: il dettaglio dell'errore, per capire cosa è successo */}
      {import.meta.env.DEV && error instanceof Error && (
        <pre className="bg-ombra mx-5 mb-12 overflow-x-auto p-4 text-xs leading-relaxed text-neutral-400 md:mx-10">
          {error.stack ?? error.message}
        </pre>
      )}
    </main>
  )
}

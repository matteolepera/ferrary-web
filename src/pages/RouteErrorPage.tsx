import { useTranslation } from 'react-i18next'
import { Link, useRouteError } from 'react-router'
import { Logo } from '@/components/Logo'
import { buttonClass } from '@/components/ui/buttonClass'

/**
 * La pagina mostrata quando un componente si rompe durante il disegno.
 */
export function RouteErrorPage() {
  const { t } = useTranslation()
  const error = useRouteError()

  return (
    <main className="mx-auto flex min-h-screen max-w-[1360px] flex-col justify-center px-5 py-24 md:px-10">
      <title>{`${t('errors.unexpected.eyebrow')} – Ferrary`}</title>

      <Link to="/" aria-label={t('nav.home')} className="self-start">
        <Logo alt="" className="h-7 w-auto" />
      </Link>

      <p className="text-rosso-acceso mt-16 text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
        {t('errors.unexpected.eyebrow')}
      </p>
      <h1 className="font-display mt-3 text-[2.625rem] leading-none font-extrabold tracking-[-0.035em] md:text-6xl">
        {t('errors.unexpected.title')}
      </h1>
      <p className="mt-4 max-w-[48ch] text-neutral-300 md:text-lg">
        {t('errors.unexpected.text')}
      </p>

      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={buttonClass('primary')}
        >
          {t('errors.unexpected.reload')}
        </button>
        {/* Un link "vero": ricarica tutto il sito, nel caso il problema fosse nello stato dell'app */}
        <a href="/" className={buttonClass('secondary')}>
          {t('errors.unexpected.home')}
        </a>
      </div>

      {/* Solo in sviluppo: il dettaglio dell'errore, per capire cosa è successo */}
      {import.meta.env.DEV && error instanceof Error && (
        <pre className="bg-ombra mt-12 overflow-x-auto p-4 text-xs leading-relaxed text-neutral-400">
          {error.stack ?? error.message}
        </pre>
      )}
    </main>
  )
}

import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

type NotFoundPageProps = {
  /** Dove riporta il pulsante: la home del sito o del pannello */
  backTo?: string
}

/**
 * Pagina mostrata per gli indirizzi che non esistono.
 */
export function NotFoundPage({ backTo = '/' }: NotFoundPageProps) {
  const { t } = useTranslation()

  return (
    <section className="py-16 text-center">
      <p className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
        {t('notFound.code')}
      </p>
      <h1 className="mt-2 text-3xl font-bold">{t('notFound.title')}</h1>
      <p className="mt-4 text-neutral-600">{t('notFound.description')}</p>
      <Link
        to={backTo}
        className="mt-8 inline-block rounded bg-neutral-900 px-4 py-2 text-white"
      >
        {t('notFound.back')}
      </Link>
    </section>
  )
}

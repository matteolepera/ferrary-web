import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { Button } from '@/components/ui/Button'
import { useModel } from '@/hooks/useModel'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function ModelPage() {
  const { t } = useTranslation()
  const { slug = '' } = useParams()
  const { data: model, isPending, isError, error, refetch } = useModel(slug)

  // Un indirizzo sbagliato o un modello ritirato: la stessa pagina degli indirizzi inesistenti
  if (isError && isNotFound(error)) {
    return <NotFoundPage />
  }

  if (isError) {
    return (
      <div role="alert" className="px-5 pt-36 pb-16 text-center">
        <p className="text-errore">{t('model.error')}</p>
        <Button variant="secondary" onClick={() => refetch()} className="mt-6">
          {t('archive.retry')}
        </Button>
      </div>
    )
  }

  if (isPending) {
    return (
      <div aria-busy="true" className="bg-ombra/40 min-h-[40rem] animate-pulse">
        <span className="sr-only">{t('model.loading')}</span>
      </div>
    )
  }

  return (
    <>
      {/* React 19 sposta da solo il titolo nella <head> della pagina */}
      <title>{`${model.name} – Ferrary`}</title>

      <section className="mx-auto max-w-[1360px] px-5 pt-28 md:px-10 md:pt-36">
        <h1 className="font-display text-[3.25rem] leading-none font-extrabold tracking-[-0.035em] md:text-7xl">
          {model.name}
        </h1>
      </section>
    </>
  )
}

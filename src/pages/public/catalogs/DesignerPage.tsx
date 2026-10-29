import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { VersionCard } from '@/components/catalog/VersionCard'
import { useDesigner } from '@/hooks/useDesigners'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function DesignerPage() {
  const { t } = useTranslation()
  const { slug = '' } = useParams()
  const { data: designer, isPending, isError, error } = useDesigner(slug)

  if (isError && isNotFound(error)) {
    return <NotFoundPage />
  }

  if (isError) {
    return (
      <p role="alert" className="text-errore px-5 pt-36 pb-16 text-center">
        {t('catalogs.error')}
      </p>
    )
  }

  if (isPending) {
    return (
      <div
        aria-busy="true"
        className="bg-ombra/40 min-h-[30rem] animate-pulse"
      />
    )
  }

  const versions = designer.versions ?? []

  return (
    <div className="mx-auto max-w-[1360px] px-5 pt-28 pb-18 md:px-10 md:pt-36 md:pb-24 lg:pt-40">
      <title>{`${designer.name} – Ferrary`}</title>

      <Link
        to="/designer"
        className="text-[0.6875rem] font-semibold tracking-[0.18em] text-neutral-300 uppercase hover:text-white md:text-xs"
      >
        ← {t('catalogs.designers.title')}
      </Link>

      <p className="text-rosso-acceso mt-8 text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
        {[t(`catalogs.designers.types.${designer.type}`), designer.country]
          .filter(Boolean)
          .join(' · ')}
      </p>
      <h1 className="font-display mt-3 text-[3rem] leading-[0.95] font-extrabold tracking-[-0.035em] md:text-7xl lg:text-[clamp(4rem,7vw,6.5rem)]">
        {designer.name}
      </h1>

      <section aria-labelledby="opere-titolo" className="mt-14 md:mt-18">
        <h2
          id="opere-titolo"
          className="font-display text-2xl font-extrabold tracking-[-0.02em] md:text-3xl"
        >
          {t('catalogs.works')}{' '}
          <span className="text-neutral-500">{versions.length}</span>
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {versions.map((version) => (
            <li key={version.id}>
              <VersionCard
                version={version}
                meta={
                  version.designer_role
                    ? t(`model.people.roles.${version.designer_role}`)
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

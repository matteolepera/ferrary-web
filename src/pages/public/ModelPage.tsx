import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { ModelHero } from '@/components/model/ModelHero'
import { Button } from '@/components/ui/Button'
import { useModel } from '@/hooks/useModel'
import { useVersion } from '@/hooks/useVersion'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { VersionSpecStrip } from '@/components/model/VersionSpecStrip'
import { VersionStory } from '@/components/model/VersionStory'
import { VersionGallery } from '@/components/model/VersionGallery'
import { ModelLineage } from '@/components/model/ModelLineage'
import { RelatedModels } from '@/components/model/RelatedModels'
import { TechSheet } from '@/components/model/TechSheet'

export function ModelPage() {
  const { t } = useTranslation()
  const { slug = '' } = useParams()
  const { data: model, isPending, isError, error, refetch } = useModel(slug)

  const [params, setParams] = useSearchParams()

  // La versione dell'indirizzo, se esiste; altrimenti la prima del modello
  const versions = model?.versions ?? []
  const selected =
    versions.find((version) => version.slug === params.get('versione')) ??
    versions[0]
  const { data: version } = useVersion(selected?.slug)

  // Le versioni sono schede della stessa pagina: l'indirizzo viene sostituito, non accumulato
  const selectVersion = (slug: string) =>
    setParams({ versione: slug }, { replace: true, preventScrollReset: true })

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
      <title>{`${selected?.name ?? model.name} – Ferrary`}</title>

      <ModelHero
        model={model}
        version={version}
        selectedSlug={selected?.slug}
        onSelect={selectVersion}
      />

      <VersionSpecStrip version={version} />
      <VersionStory version={version} />
      <TechSheet version={version} />
      <VersionGallery version={version} />
      <ModelLineage model={model} />
      <RelatedModels model={model} />
    </>
  )
}

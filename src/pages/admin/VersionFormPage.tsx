import { useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { VersionForm } from '@/components/admin/versions/VersionForm'
import { useAdminModel } from '@/hooks/useAdminModel'
import { useAdminVersion } from '@/hooks/useAdminVersion'
import { NotFoundPage } from '@/pages/NotFoundPage'

/** Un id dall'indirizzo, se è un intero positivo */
function toId(value: string | undefined) {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : undefined
}

/**
 * La pagina del form della versione:
 * /admin/modelli/2/versioni/nuova per crearne una, /admin/modelli/2/versioni/21 per modificarla.
 */
export function VersionFormPage() {
  const { id, versionId } = useParams()
  const modelId = toId(id)
  const isNew = versionId === undefined
  const validVersionId = toId(versionId)

  const { data: model, error: modelError } = useAdminModel(modelId)
  const { data: version, error: versionError } = useAdminVersion(
    isNew ? undefined : validVersionId,
  )

  const notFound =
    modelId === undefined ||
    (!model && isNotFound(modelError)) ||
    (!isNew && validVersionId === undefined) ||
    (!version && isNotFound(versionError)) ||
    // Una versione di un altro modello: l'indirizzo non è coerente
    (version !== undefined && version.car_model_id !== modelId)

  if (notFound) {
    return (
      <NotFoundPage
        backTo={modelId ? `/admin/modelli/${modelId}` : '/admin/modelli'}
      />
    )
  }

  if (!model || (!isNew && !version)) {
    return modelError || versionError ? (
      <p role="alert" className="text-[0.9375rem] text-neutral-300">
        Impossibile caricare la versione: il server non risponde.
      </p>
    ) : (
      <div aria-busy="true" className="grid grid-cols-6 gap-4 lg:grid-cols-12">
        <div className="bg-ombra col-span-6 h-20 animate-pulse rounded-3xl lg:col-span-12" />
        <div className="bg-ombra col-span-6 h-80 animate-pulse rounded-3xl lg:col-span-8" />
        <div className="bg-ombra col-span-6 h-80 animate-pulse rounded-3xl lg:col-span-4" />
      </div>
    )
  }

  return (
    <VersionForm
      key={version?.id ?? 'nuova'}
      modelId={model.id}
      modelName={model.name}
      version={version}
    />
  )
}

import { useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { VersionPage } from '@/components/admin/versions/VersionPage'
import { useAdminModel } from '@/hooks/useAdminModel'
import { useAdminVersion } from '@/hooks/useAdminVersion'
import { NotFoundPage } from '@/pages/NotFoundPage'

/** Un id dall'indirizzo, se è un intero positivo */
function toId(value: string | undefined) {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : undefined
}

/**
 * La pagina di una versione: /admin/modelli/2/versioni/21.
 * Le versioni nuove nascono da una finestra, nella pagina del loro modello.
 */
export function VersionFormPage() {
  const { id, versionId } = useParams()
  const modelId = toId(id)
  const validVersionId = toId(versionId)

  const { data: model, error: modelError } = useAdminModel(modelId)
  const { data: version, error: versionError } = useAdminVersion(validVersionId)

  const notFound =
    modelId === undefined ||
    validVersionId === undefined ||
    (!model && isNotFound(modelError)) ||
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

  if (!model || !version) {
    return modelError || versionError ? (
      <p role="alert" className="text-[0.9375rem] text-neutral-300">
        Impossibile caricare la versione: il server non risponde.
      </p>
    ) : (
      <div
        aria-busy="true"
        className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]"
      >
        <div className="bg-ombra h-96 animate-pulse rounded-3xl" />
        <div className="bg-ombra h-64 animate-pulse rounded-3xl" />
      </div>
    )
  }

  return (
    <VersionPage
      key={version.id}
      modelId={model.id}
      modelName={model.name}
      version={version}
    />
  )
}

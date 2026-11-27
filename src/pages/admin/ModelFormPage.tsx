import { useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { ModelPage } from '@/components/admin/models/ModelPage'
import { useAdminModel } from '@/hooks/useAdminModel'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * La pagina di un modello: /admin/modelli/2.
 * I modelli nuovi nascono da una finestra, nell'elenco dei modelli o nel pannello.
 */
export function ModelFormPage() {
  const { id } = useParams()
  const modelId = Number(id)
  const validId = Number.isInteger(modelId) && modelId > 0 ? modelId : undefined

  const { data: model, error } = useAdminModel(validId)

  // Un id che non è un numero, o un modello che non esiste
  if (validId === undefined || (!model && isNotFound(error))) {
    return <NotFoundPage backTo="/admin/modelli" />
  }

  if (!model) {
    return error ? (
      <p role="alert" className="text-[0.9375rem] text-neutral-300">
        Impossibile caricare il modello: il server non risponde.
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

  return <ModelPage key={model.id} model={model} />
}

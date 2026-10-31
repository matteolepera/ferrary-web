import { useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { ModelForm } from '@/components/admin/models/ModelForm'
import { useAdminModel } from '@/hooks/useAdminModel'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * La pagina del form: /admin/modelli/nuovo per crearne uno, /admin/modelli/2 per modificarlo.
 */
export function ModelFormPage() {
  const { id } = useParams()
  const isNew = id === undefined
  const modelId = Number(id)
  const validId = Number.isInteger(modelId) && modelId > 0 ? modelId : undefined

  const { data: model, error } = useAdminModel(isNew ? undefined : validId)

  if (isNew) {
    return <ModelForm />
  }

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
      <div aria-busy="true" className="grid grid-cols-6 gap-4 lg:grid-cols-12">
        <div className="bg-ombra col-span-6 h-20 animate-pulse rounded-3xl lg:col-span-12" />
        <div className="bg-ombra col-span-6 h-72 animate-pulse rounded-3xl lg:col-span-8" />
        <div className="bg-ombra col-span-6 h-72 animate-pulse rounded-3xl lg:col-span-4" />
      </div>
    )
  }

  return <ModelForm key={model.id} model={model} />
}

import { useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { EngineForm } from '@/components/admin/engines/EngineForm'
import { useAdminEngine } from '@/hooks/useAdminEngines'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * La pagina del form del motore: /admin/motori/nuovo, oppure /admin/motori/3.
 */
export function EngineFormPage() {
  const { id } = useParams()
  const isNew = id === undefined
  const engineId = Number(id)
  const validId =
    Number.isInteger(engineId) && engineId > 0 ? engineId : undefined

  const { data: engine, error } = useAdminEngine(isNew ? undefined : validId)

  if (isNew) {
    return <EngineForm />
  }

  if (validId === undefined || (!engine && isNotFound(error))) {
    return <NotFoundPage backTo="/admin/motori" />
  }

  if (!engine) {
    return error ? (
      <p role="alert" className="text-[0.9375rem] text-neutral-300">
        Impossibile caricare il motore: il server non risponde.
      </p>
    ) : (
      <div
        aria-busy="true"
        className="bg-ombra h-96 animate-pulse rounded-3xl"
      />
    )
  }

  return <EngineForm key={engine.id} engine={engine} />
}

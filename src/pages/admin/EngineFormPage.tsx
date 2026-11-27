import { useParams } from 'react-router'
import { isNotFound } from '@/api/errors'
import { EnginePage } from '@/components/admin/engines/EnginePage'
import { useAdminEngine } from '@/hooks/useAdminEngines'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * La pagina di un motore: /admin/motori/3.
 * I motori nuovi nascono da una finestra, nell'elenco dei motori.
 */
export function EngineFormPage() {
  const { id } = useParams()
  const engineId = Number(id)
  const validId =
    Number.isInteger(engineId) && engineId > 0 ? engineId : undefined

  const { data: engine, error } = useAdminEngine(validId)

  // Un id che non è un numero, o un motore che non esiste
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
        className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]"
      >
        <div className="bg-ombra h-96 animate-pulse rounded-3xl" />
        <div className="bg-ombra h-64 animate-pulse rounded-3xl" />
      </div>
    )
  }

  return <EnginePage key={engine.id} engine={engine} />
}

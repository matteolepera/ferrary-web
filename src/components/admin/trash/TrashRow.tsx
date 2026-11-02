import { useState } from 'react'
import { backendMessage } from '@/api/errors'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { useTrashActions } from '@/hooks/useTrash'

type TrashRowProps = {
  kind: 'model' | 'version'
  id: number
  name: string
  /** Una riga di dettaglio: la famiglia per un modello, il modello per una versione */
  detail: string
  /** Solo il Master elimina per sempre */
  canPurge: boolean
  onMessage: (message: string) => void
}

/**
 * Un elemento nel cestino: si ripristina, o il Master lo elimina per sempre.
 */
export function TrashRow({
  kind,
  id,
  name,
  detail,
  canPurge,
  onMessage,
}: TrashRowProps) {
  const actions = useTrashActions()
  const restore =
    kind === 'model' ? actions.restoreModel : actions.restoreVersion
  const purge = kind === 'model' ? actions.purgeModel : actions.purgeVersion
  const [confirming, setConfirming] = useState(false)

  const failure = restore.error ?? purge.error
  const busy = restore.isPending || purge.isPending

  return (
    <li className="border-linea border-b px-6 py-4 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold">{name}</p>
          <p className="mt-0.5 text-xs text-neutral-400">{detail}</p>
        </div>

        {!confirming && (
          <div className="flex gap-2">
            <AdminButton
              variant="light"
              disabled={busy}
              onClick={() =>
                restore.mutate(id, {
                  onSuccess: () =>
                    onMessage(`${name} è di nuovo al suo posto.`),
                })
              }
              className="h-9 px-4 text-xs"
            >
              Ripristina
            </AdminButton>
            {canPurge && (
              <AdminButton
                variant="outline"
                onClick={() => {
                  purge.reset()
                  setConfirming(true)
                }}
                className="h-9 px-4 text-xs"
              >
                Elimina per sempre
              </AdminButton>
            )}
          </div>
        )}
      </div>

      {confirming && (
        <div
          role="alertdialog"
          aria-labelledby={`elimina-${kind}-${id}`}
          className="mt-4 flex flex-wrap items-center gap-3"
        >
          <p id={`elimina-${kind}-${id}`} className="text-sm text-neutral-200">
            {kind === 'model'
              ? `Eliminare per sempre ${name}, con tutte le sue versioni, i dati e le foto? Non si può annullare.`
              : `Eliminare per sempre ${name}, con i suoi dati e le foto? Non si può annullare.`}
          </p>
          <AdminButton
            disabled={busy}
            onClick={() =>
              purge.mutate(id, {
                onSuccess: () =>
                  onMessage(`${name} è stato eliminato per sempre.`),
              })
            }
            className="h-9 px-4 text-xs"
          >
            Sì, elimina per sempre
          </AdminButton>
          <AdminButton
            variant="outline"
            onClick={() => setConfirming(false)}
            className="h-9 px-4 text-xs"
          >
            Annulla
          </AdminButton>
        </div>
      )}

      {failure && (
        <p role="alert" className="text-errore mt-3 text-[0.8125rem]">
          {backendMessage(failure) ??
            'Impossibile completare l’operazione. Riprova.'}
        </p>
      )}
    </li>
  )
}

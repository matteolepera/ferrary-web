import { useState } from 'react'
import { useNavigate } from 'react-router'
import { backendMessage } from '@/api/errors'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { useEngineActions } from '@/hooks/useAdminEngines'
import type { AdminEngine } from '@/types/admin'

type EngineUsageCardProps = {
  engine: AdminEngine
  delay?: number
}

/**
 * Quante versioni usano il motore, e la sua eliminazione con la conferma.
 * Qui non c'è cestino: l'eliminazione è definitiva, e il backend la rifiuta se il motore è usato.
 */
export function EngineUsageCard({ engine, delay }: EngineUsageCardProps) {
  const navigate = useNavigate()
  const { remove } = useEngineActions()
  const [confirming, setConfirming] = useState(false)
  const count = engine.versions_count ?? 0

  return (
    <AdminCard aria-labelledby="motore-utilizzo" delay={delay} className="p-6">
      <h2
        id="motore-utilizzo"
        className="font-display text-xl font-extrabold tracking-[-0.03em]"
      >
        Utilizzo
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-400">
        {count === 0
          ? 'Nessuna versione lo usa.'
          : `Lo usano ${count} ${count === 1 ? 'versione' : 'versioni'}.`}
      </p>

      {confirming ? (
        <div
          role="alertdialog"
          aria-labelledby="motore-domanda"
          className="mt-5 flex flex-col gap-3"
        >
          <p id="motore-domanda" className="text-sm text-neutral-200">
            Eliminare il motore {engine.code}? Non si potrà recuperare.
          </p>
          <div className="flex gap-2.5">
            {/* Il rosso pieno solo qui: è l'unica azione che non si annulla */}
            <AdminButton
              variant="danger"
              disabled={remove.isPending}
              onClick={() =>
                remove.mutate(engine.id, {
                  onSuccess: () => navigate('/admin/motori', { replace: true }),
                })
              }
            >
              {remove.isPending ? 'Eliminazione…' : 'Sì, elimina'}
            </AdminButton>
            <AdminButton variant="outline" onClick={() => setConfirming(false)}>
              Annulla
            </AdminButton>
          </div>
        </div>
      ) : (
        <AdminButton
          variant="dangerSoft"
          onClick={() => {
            // Un errore di un tentativo precedente non resta sulla nuova conferma
            remove.reset()
            setConfirming(true)
          }}
          className="mt-5"
        >
          Elimina motore
        </AdminButton>
      )}

      {remove.isError && (
        <p role="alert" className="text-errore mt-4 text-[0.8125rem]">
          {backendMessage(remove.error) ??
            'Impossibile eliminare il motore. Riprova.'}
        </p>
      )}
    </AdminCard>
  )
}

import { useState } from 'react'
import { isForbidden } from '@/api/errors'
import { TrashRow } from '@/components/admin/trash/TrashRow'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { useCurrentUser } from '@/hooks/useAuth'
import { useTrash } from '@/hooks/useTrash'

const sectionTitle = 'font-display text-xl font-extrabold tracking-[-0.03em]'

/**
 * Il cestino: i modelli e le versioni spostati, da ripristinare o, per il Master, da eliminare per sempre.
 */
export function TrashPage() {
  const { data: me } = useCurrentUser()
  const { data: trash, isPending, error } = useTrash()
  const [message, setMessage] = useState('')

  const canPurge = me?.role === 'master'
  const empty =
    trash && trash.models.length === 0 && trash.versions.length === 0

  return (
    <>
      <title>Cestino – Ferrary</title>

      <header>
        <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
          Catalogo
        </p>
        <h1 className="font-display mt-2.5 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
          Cestino
        </h1>
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-neutral-400">
          Quello che è stato spostato qui non compare sul sito, ma si può
          ripristinare.
          {canPurge && ' Solo il Master può eliminare per sempre.'}
        </p>
        <p role="status" className="mt-2 min-h-5 text-sm text-neutral-300">
          {message}
        </p>
      </header>

      {isForbidden(error) && (
        <p
          role="alert"
          className="border-linea bg-ombra mt-5 rounded-3xl border p-6 text-[0.9375rem] text-neutral-300"
        >
          Il cestino è riservato ad Admin e Master.
        </p>
      )}

      {isPending && (
        <div
          aria-busy="true"
          className="bg-ombra mt-5 h-64 animate-pulse rounded-3xl"
        />
      )}

      {empty && (
        <p className="border-linea mt-5 rounded-3xl border border-dashed px-6 py-12 text-center text-sm text-neutral-400">
          Il cestino è vuoto.
        </p>
      )}

      {trash && !empty && (
        <div className="mt-5 flex flex-col gap-4">
          {trash.models.length > 0 && (
            <AdminCard aria-labelledby="cestino-modelli">
              <h2
                id="cestino-modelli"
                className={`${sectionTitle} px-6 pt-6 pb-2`}
              >
                Modelli
              </h2>
              <ul aria-labelledby="cestino-modelli">
                {trash.models.map((model) => (
                  <TrashRow
                    key={model.id}
                    kind="model"
                    id={model.id}
                    name={model.name}
                    detail={[
                      model.category?.name.it,
                      model.versions_count === 1
                        ? '1 versione'
                        : `${model.versions_count ?? 0} versioni`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                    canPurge={canPurge}
                    onMessage={setMessage}
                  />
                ))}
              </ul>
            </AdminCard>
          )}

          {trash.versions.length > 0 && (
            <AdminCard aria-labelledby="cestino-versioni" delay={60}>
              <h2
                id="cestino-versioni"
                className={`${sectionTitle} px-6 pt-6 pb-2`}
              >
                Versioni
              </h2>
              <ul aria-labelledby="cestino-versioni">
                {trash.versions.map((version) => (
                  <TrashRow
                    key={version.id}
                    kind="version"
                    id={version.id}
                    name={version.name}
                    detail={
                      version.model
                        ? `Versione di ${version.model.name}`
                        : 'Versione'
                    }
                    canPurge={canPurge}
                    onMessage={setMessage}
                  />
                ))}
              </ul>
            </AdminCard>
          )}
        </div>
      )}
    </>
  )
}

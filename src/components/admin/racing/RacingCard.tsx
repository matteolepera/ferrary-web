import { useState } from 'react'
import { PlusIcon } from '@phosphor-icons/react'
import { RacingModal } from '@/components/admin/racing/RacingModal'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { sectionButtonClass } from '@/components/admin/ui/adminButtonClass'
import { Icon } from '@/components/admin/ui/Icon'
import { useRacingActions, useVersionRacing } from '@/hooks/useVersionRacing'
import type { AdminRacingRecord } from '@/types/admin'

const columns = [
  'Campionato',
  'Stagioni',
  'Gare',
  'Vittorie',
  'Pole',
  'Podi',
  'Giri veloci',
  'Titoli',
  '',
]

const iconButton =
  'flex size-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white'

/** Le stagioni: "2004", oppure "2004–2006" */
function seasons(record: AdminRacingRecord) {
  return record.season_end && record.season_end !== record.season_start
    ? `${record.season_start}–${record.season_end}`
    : String(record.season_start)
}

/** I titoli insieme: "1 piloti, 1 costruttori" */
function titles(record: AdminRacingRecord) {
  const parts = [
    record.drivers_titles ? `${record.drivers_titles} piloti` : null,
    record.constructors_titles
      ? `${record.constructors_titles} costruttori`
      : null,
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(', ') : '—'
}

type RacingCardProps = {
  versionId: number
  delay?: number
  className?: string
}

/**
 * I risultati sportivi della versione, campionato per campionato. Si salvano subito.
 */
export function RacingCard({
  versionId,
  delay,
  className = '',
}: RacingCardProps) {
  const { data: records, isPending, isError } = useVersionRacing(versionId)
  const { remove } = useRacingActions(versionId)
  // La finestra aperta: "new" per un campionato nuovo, l'id per modificarne uno, null se chiusa
  const [editing, setEditing] = useState<number | 'new' | null>(null)
  const [confirming, setConfirming] = useState<number | null>(null)

  const current = records?.find((record) => record.id === editing)

  return (
    <AdminCard
      aria-labelledby="versione-risultati"
      delay={delay}
      className={`p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id="versione-risultati"
          className="font-display text-xl font-extrabold tracking-[-0.03em]"
        >
          Risultati sportivi
        </h2>
        <button
          type="button"
          aria-label="Aggiungi un campionato"
          onClick={() => setEditing('new')}
          className={sectionButtonClass}
        >
          <PlusIcon aria-hidden="true" size={14} />
          Campionato
        </button>
      </div>

      {isPending && (
        <div
          aria-busy="true"
          className="mt-5 h-32 animate-pulse rounded-2xl bg-white/5"
        />
      )}
      {isError && (
        <p className="mt-5 text-sm text-neutral-400">
          Impossibile caricare i risultati.
        </p>
      )}

      {records && records.length === 0 && (
        <p className="mt-5 text-sm text-neutral-400">
          Nessun risultato: la versione non ha corso, o i dati non ci sono
          ancora.
        </p>
      )}

      {records && records.length > 0 && (
        <div className="border-linea mt-5 overflow-x-auto rounded-[1.125rem] border">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <caption className="sr-only">
              Risultati sportivi della versione
            </caption>
            <thead>
              <tr className="border-linea border-b">
                {columns.map((column, index) => (
                  <th
                    key={column || index}
                    scope="col"
                    className="px-4 py-3 text-[0.6875rem] font-semibold tracking-[0.16em] whitespace-nowrap text-neutral-400 uppercase first:pl-5"
                  >
                    {column || <span className="sr-only">Azioni</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  aria-current={record.id === editing ? 'true' : undefined}
                  className={[
                    'border-linea border-b last:border-b-0',
                    record.id === editing ? 'bg-white/[0.04]' : '',
                  ].join(' ')}
                >
                  <th scope="row" className="py-3 pr-4 pl-5 font-semibold">
                    {record.championship}
                  </th>
                  <td className="px-4 py-3 text-neutral-300 tabular-nums">
                    {seasons(record)}
                  </td>
                  {(
                    [
                      'races',
                      'wins',
                      'poles',
                      'podiums',
                      'fastest_laps',
                    ] as const
                  ).map((field) => (
                    <td
                      key={field}
                      className="px-4 py-3 text-neutral-300 tabular-nums"
                    >
                      {record[field] ?? '—'}
                    </td>
                  ))}
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-300">
                    {titles(record)}
                  </td>
                  <td className="px-4 py-3">
                    {confirming === record.id ? (
                      <div
                        role="alertdialog"
                        aria-label={`Eliminare ${record.championship}?`}
                        className="flex gap-2"
                      >
                        <AdminButton
                          variant="danger"
                          disabled={remove.isPending}
                          onClick={() =>
                            remove.mutate(record.id, {
                              onSuccess: () => setConfirming(null),
                            })
                          }
                          className="h-8 px-3 text-xs"
                        >
                          Elimina
                        </AdminButton>
                        <AdminButton
                          variant="outline"
                          onClick={() => setConfirming(null)}
                          className="h-8 px-3 text-xs"
                        >
                          Annulla
                        </AdminButton>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          aria-label={`Modifica ${record.championship}`}
                          onClick={() => setEditing(record.id)}
                          className={iconButton}
                        >
                          <Icon path="M4 20l4-1 11-11-3-3L5 16z" size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Elimina ${record.championship}`}
                          onClick={() => setConfirming(record.id)}
                          className={`${iconButton} hover:bg-rosso`}
                        >
                          <Icon
                            path="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"
                            size={15}
                          />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Montata solo quando serve, con la sua chiave: riparte sempre dai dati salvati */}
      {editing !== null && (
        <RacingModal
          key={editing}
          versionId={versionId}
          record={current}
          onClose={() => setEditing(null)}
        />
      )}
    </AdminCard>
  )
}

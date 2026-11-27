import { useState } from 'react'
import { PlusIcon } from '@phosphor-icons/react'
import { isForbidden } from '@/api/errors'
import { NewMemberModal } from '@/components/admin/staff/NewMemberModal'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { assignableRoles } from '@/components/admin/staff/permissions'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { ListHeader } from '@/components/admin/ui/ListHeader'
import { useCurrentUser } from '@/hooks/useAuth'
import { useStaff } from '@/hooks/useStaff'
import { StaffRow } from '@/components/admin/staff/StaffRow'
import { TransferMasterCard } from '@/components/admin/staff/TransferMasterCard'

/**
 * Le persone dello staff: l'elenco, con il Master per primo, e la finestra per aggiungerne una.
 */
export function StaffPage() {
  const { data: me } = useCurrentUser()
  const { data: staff, isPending, error } = useStaff()
  // La finestra per aggiungere una persona
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')

  const roles = me ? assignableRoles(me) : []

  return (
    <>
      <title>Staff – Ferrary</title>

      <ListHeader
        eyebrow="Persone"
        title="Staff"
        count={
          staff
            ? staff.length === 1
              ? '1 persona'
              : `${staff.length} persone`
            : undefined
        }
        action={
          <div className="flex flex-wrap items-center justify-end gap-4">
            {/* L'esito delle azioni sullo staff, accanto al pulsante come nelle pagine di dettaglio */}
            <p role="status" className="text-sm text-neutral-300">
              {message}
            </p>
            {/* Solo chi può assegnare almeno un ruolo può aggiungere qualcuno */}
            {roles.length > 0 && !isForbidden(error) && (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className={adminButtonClass('primary')}
              >
                <PlusIcon aria-hidden="true" size={16} />
                Nuovo membro
              </button>
            )}
          </div>
        }
      />

      {isForbidden(error) ? (
        <p
          role="alert"
          className="border-linea bg-ombra mt-7 rounded-3xl border p-6 text-[0.9375rem] text-neutral-300"
        >
          La gestione dello staff è riservata ad Admin e Master.
        </p>
      ) : (
        <div className="mt-7 flex flex-col gap-4">
          <AdminCard className="overflow-hidden">
            {isPending && (
              <div
                aria-busy="true"
                className="m-6 h-48 animate-pulse rounded-2xl bg-white/5"
              />
            )}
            {error && (
              <p className="p-6 text-sm text-neutral-400">
                Impossibile caricare lo staff.
              </p>
            )}

            {staff && me && (
              <ul aria-label="Persone dello staff">
                {staff.map((person) => (
                  <StaffRow
                    key={person.id}
                    person={person}
                    me={me}
                    onMessage={setMessage}
                  />
                ))}
              </ul>
            )}
          </AdminCard>

          {me?.role === 'master' && staff && (
            <TransferMasterCard me={me} staff={staff} onMessage={setMessage} />
          )}
        </div>
      )}

      {adding && (
        <NewMemberModal
          roles={roles}
          onCreated={(name) =>
            setMessage(`${name} è stato aggiunto allo staff.`)
          }
          onClose={() => setAdding(false)}
        />
      )}
    </>
  )
}

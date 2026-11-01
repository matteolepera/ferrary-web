import { useState } from 'react'
import { isForbidden } from '@/api/errors'
import { roleLabels } from '@/components/admin/adminNav'
import { NewMemberForm } from '@/components/admin/staff/NewMemberForm'
import { assignableRoles } from '@/components/admin/staff/permissions'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { Avatar } from '@/components/admin/ui/Avatar'
import { useCurrentUser } from '@/hooks/useAuth'
import { useStaff } from '@/hooks/useStaff'

/**
 * Le persone dello staff: l'elenco, con il Master per primo, e il form per aggiungerne una.
 */
export function StaffPage() {
  const { data: me } = useCurrentUser()
  const { data: staff, isPending, error } = useStaff()
  // Cambia a ogni aggiunta: il form riparte vuoto
  const [formKey, setFormKey] = useState(0)
  const [message, setMessage] = useState('')

  const roles = me ? assignableRoles(me) : []

  return (
    <>
      <title>Staff – Ferrary</title>

      <header>
        <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
          Persone
        </p>
        <h1 className="font-display mt-2.5 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
          Staff
        </h1>
        <p role="status" className="mt-3 min-h-5 text-sm text-neutral-300">
          {message}
        </p>
      </header>

      {isForbidden(error) ? (
        <p
          role="alert"
          className="border-linea bg-ombra mt-7 rounded-3xl border p-6 text-[0.9375rem] text-neutral-300"
        >
          La gestione dello staff è riservata ad Admin e Master.
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-6 gap-4 lg:grid-cols-12">
          <AdminCard className="col-span-6 overflow-hidden lg:col-span-8">
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

            {staff && (
              <ul>
                {staff.map((person) => (
                  <li
                    key={person.id}
                    className="border-linea flex items-center gap-4 border-b px-6 py-4 last:border-b-0"
                  >
                    <Avatar
                      name={person.name}
                      highlighted={person.id === me?.id}
                      className="size-11 text-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">
                        {person.name}
                        {person.id === me?.id && (
                          <span className="ml-2 text-xs font-normal text-neutral-400">
                            (tu)
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-neutral-400">
                        {person.email}
                      </p>
                    </div>
                    <span
                      className={[
                        'rounded-full px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.06em] uppercase',
                        person.role === 'master'
                          ? 'bg-rosso text-white'
                          : 'border border-white/15 text-neutral-200',
                      ].join(' ')}
                    >
                      {roleLabels[person.role]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>

          {roles.length > 0 && (
            <AdminCard
              aria-labelledby="staff-nuovo"
              delay={60}
              className="col-span-6 self-start p-6 lg:col-span-4"
            >
              <h2
                id="staff-nuovo"
                className="font-display text-xl font-extrabold tracking-[-0.03em]"
              >
                Nuovo membro
              </h2>
              <NewMemberForm
                key={formKey}
                roles={roles}
                onCreated={(name) => {
                  setMessage(`${name} è stato aggiunto allo staff.`)
                  setFormKey((current) => current + 1)
                }}
              />
            </AdminCard>
          )}
        </div>
      )}
    </>
  )
}

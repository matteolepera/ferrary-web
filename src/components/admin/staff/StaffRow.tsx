import { useState, type FormEvent } from 'react'
import { backendMessage, validationErrors } from '@/api/errors'
import { roleLabels } from '@/components/admin/adminNav'
import {
  assignableRoles,
  canManage,
} from '@/components/admin/staff/permissions'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminField } from '@/components/admin/ui/AdminField'
import { Avatar } from '@/components/admin/ui/Avatar'
import { Icon } from '@/components/admin/ui/Icon'
import { PasswordField } from '@/components/admin/ui/PasswordField'
import { useStaffActions } from '@/hooks/useStaff'
import type { User, UserRole } from '@/types/auth'

const iconButton =
  'flex size-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white'

type StaffRowProps = {
  person: User
  me: User
  /** Un messaggio per la pagina, annunciato dalla zona di stato in alto */
  onMessage: (message: string) => void
}

/**
 * Una persona dello staff, con le azioni che chi guarda può fare su di lei.
 */
export function StaffRow({ person, me, onMessage }: StaffRowProps) {
  const { update, changeRole, remove } = useStaffActions()
  const [panel, setPanel] = useState<'edit' | 'delete' | null>(null)
  const [values, setValues] = useState({
    name: person.name,
    email: person.email,
    password: '',
  })

  const manageable = canManage(me, person)
  const roles = assignableRoles(me)
  const errors = validationErrors(update.error)
  const failure = changeRole.error ?? remove.error

  function openEdit() {
    update.reset()
    setValues({ name: person.name, email: person.email, password: '' })
    setPanel('edit')
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    update.mutate(
      {
        id: person.id,
        name: values.name.trim(),
        email: values.email.trim(),
        // Vuota: la password resta quella di prima
        ...(values.password ? { password: values.password } : {}),
      },
      {
        onSuccess: (user) => {
          setPanel(null)
          onMessage(`Dati di ${user.name} aggiornati.`)
        },
      },
    )
  }

  return (
    <li className="border-linea border-b last:border-b-0">
      <div className="flex items-center gap-4 px-6 py-4">
        <Avatar
          name={person.name}
          highlighted={person.id === me.id}
          className="size-11 text-sm"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            {person.name}
            {person.id === me.id && (
              <span className="ml-2 text-xs font-normal text-neutral-400">
                (tu)
              </span>
            )}
          </p>
          <p className="truncate text-xs text-neutral-400">{person.email}</p>
        </div>

        {manageable && roles.length > 1 ? (
          <>
            <label htmlFor={`ruolo-${person.id}`} className="sr-only">
              Ruolo di {person.name}
            </label>
            <select
              id={`ruolo-${person.id}`}
              value={person.role}
              disabled={changeRole.isPending}
              onChange={(event) => {
                const role = event.target.value as UserRole
                changeRole.mutate(
                  { id: person.id, role },
                  {
                    onSuccess: () =>
                      onMessage(`${person.name} ora è ${roleLabels[role]}.`),
                  },
                )
              }}
              className="bg-notte h-9 rounded-full border border-white/15 px-3 text-xs font-semibold text-neutral-100 focus:border-neutral-300"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>
          </>
        ) : (
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
        )}

        {manageable && (
          <div className="flex gap-1">
            <button
              type="button"
              aria-label={`Modifica ${person.name}`}
              onClick={openEdit}
              className={iconButton}
            >
              <Icon path="M4 20l4-1 11-11-3-3L5 16z" size={15} />
            </button>
            <button
              type="button"
              aria-label={`Elimina ${person.name}`}
              onClick={() => {
                remove.reset()
                setPanel('delete')
              }}
              className={`${iconButton} hover:bg-rosso`}
            >
              <Icon path="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" size={15} />
            </button>
          </div>
        )}
      </div>

      {panel === 'edit' && (
        <form
          onSubmit={save}
          noValidate
          className="grid gap-4 px-6 pb-5 md:grid-cols-3"
        >
          <AdminField
            label="Nome"
            value={values.name}
            onChange={(event) =>
              setValues((current) => ({ ...current, name: event.target.value }))
            }
            error={errors?.name?.[0]}
          />
          <AdminField
            label="Email"
            type="email"
            value={values.email}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            error={errors?.email?.[0]}
          />
          <PasswordField
            label="Nuova password"
            autoComplete="new-password"
            value={values.password}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            hint="Vuota: resta quella di prima."
            error={errors?.password?.[0]}
          />
          <div className="flex gap-2.5 md:col-span-3">
            <AdminButton type="submit" disabled={update.isPending}>
              {update.isPending ? 'Salvataggio…' : 'Salva'}
            </AdminButton>
            <AdminButton variant="outline" onClick={() => setPanel(null)}>
              Annulla
            </AdminButton>
          </div>
        </form>
      )}

      {panel === 'delete' && (
        <div
          role="alertdialog"
          aria-labelledby={`elimina-${person.id}`}
          className="flex flex-wrap items-center gap-3 px-6 pb-5"
        >
          <p id={`elimina-${person.id}`} className="text-sm text-neutral-200">
            Eliminare {person.name} dallo staff? Non potrà più accedere, e non
            si può annullare.
          </p>
          <AdminButton
            disabled={remove.isPending}
            onClick={() =>
              remove.mutate(person.id, {
                onSuccess: () =>
                  onMessage(`${person.name} non fa più parte dello staff.`),
              })
            }
            className="h-9 px-3.5 text-xs"
          >
            Sì, elimina
          </AdminButton>
          <AdminButton
            variant="outline"
            onClick={() => setPanel(null)}
            className="h-9 px-3.5 text-xs"
          >
            Annulla
          </AdminButton>
        </div>
      )}

      {failure && (
        <p role="alert" className="text-errore px-6 pb-4 text-[0.8125rem]">
          {backendMessage(failure) ??
            'Impossibile completare l’operazione. Riprova.'}
        </p>
      )}
    </li>
  )
}

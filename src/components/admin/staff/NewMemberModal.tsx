import { useState, type FormEvent } from 'react'
import { validationErrors } from '@/api/errors'
import { roleLabels } from '@/components/admin/adminNav'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { PasswordField } from '@/components/admin/ui/PasswordField'
import { useStaffActions } from '@/hooks/useStaff'
import type { UserRole } from '@/types/auth'

type NewMemberModalProps = {
  /** I ruoli che chi guarda può assegnare */
  roles: UserRole[]
  onCreated: (name: string) => void
  onClose: () => void
}

/**
 * La finestra per aggiungere una persona allo staff: nome, email, password iniziale e ruolo.
 * Si apre già aperta: chi la usa la mostra solo quando serve, e la toglie alla chiusura.
 */
export function NewMemberModal({
  roles,
  onCreated,
  onClose,
}: NewMemberModalProps) {
  const { create } = useStaffActions()
  // I valori di partenza, per capire se qualcosa è cambiato
  const [initial] = useState({
    name: '',
    email: '',
    password: '',
    // Se si può assegnare un solo ruolo, è già scelto
    role: roles.length === 1 ? roles[0] : ('' as UserRole | ''),
  })
  const [values, setValues] = useState(initial)

  const errors = validationErrors(create.error)
  const dirty = JSON.stringify(values) !== JSON.stringify(initial)

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    create.mutate(
      {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: values.role || null,
      },
      {
        onSuccess: (user) => {
          onCreated(user.name)
          onClose()
        },
      },
    )
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title="Nuovo membro"
      description="Potrà accedere all'area staff con l'email e la password che scegli qui."
      dirty={dirty}
      onSubmit={handleSubmit}
      submitLabel="Aggiungi allo staff"
      pending={create.isPending}
    >
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField
            label="Nome"
            required
            value={values.name}
            onChange={(event) => update('name', event.target.value)}
            error={errors?.name?.[0]}
          />
          <AdminField
            label="Email"
            required
            type="email"
            autoComplete="off"
            value={values.email}
            onChange={(event) => update('email', event.target.value)}
            error={errors?.email?.[0]}
          />
        </div>
        <PasswordField
          label="Password iniziale"
          required
          autoComplete="new-password"
          value={values.password}
          onChange={(event) => update('password', event.target.value)}
          hint="Almeno 8 caratteri. Comunicala alla persona in modo sicuro: potrà essere cambiata."
          error={errors?.password?.[0]}
        />
        <AdminSelect
          label="Ruolo"
          required
          value={values.role}
          onChange={(event) => update('role', event.target.value)}
          error={errors?.role?.[0]}
          className="max-w-xs"
        >
          {roles.length > 1 && <option value="">Scegli un ruolo</option>}
          {roles.map((role) => (
            <option key={role} value={role}>
              {roleLabels[role]}
            </option>
          ))}
        </AdminSelect>

        {create.isError && !errors && (
          <p role="alert" className="text-errore text-[0.8125rem]">
            Impossibile aggiungere la persona in questo momento. Riprova.
          </p>
        )}
      </div>
    </AdminModal>
  )
}

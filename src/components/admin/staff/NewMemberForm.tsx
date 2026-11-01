import { useState, type FormEvent } from 'react'
import { validationErrors } from '@/api/errors'
import { roleLabels } from '@/components/admin/adminNav'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { PasswordField } from '@/components/admin/ui/PasswordField'
import { useStaffActions } from '@/hooks/useStaff'
import type { UserRole } from '@/types/auth'

type NewMemberFormProps = {
  /** I ruoli che chi guarda può assegnare */
  roles: UserRole[]
  onCreated: (name: string) => void
}

/**
 * Il form per aggiungere una persona allo staff: nome, email, password iniziale e ruolo.
 */
export function NewMemberForm({ roles, onCreated }: NewMemberFormProps) {
  const { create } = useStaffActions()
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    // Se si può assegnare un solo ruolo, è già scelto
    role: roles.length === 1 ? roles[0] : ('' as UserRole | ''),
  })

  const errors = validationErrors(create.error)

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
      { onSuccess: (user) => onCreated(user.name) },
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-5 flex flex-col gap-4"
    >
      <AdminField
        label="Nome"
        value={values.name}
        onChange={(event) => update('name', event.target.value)}
        error={errors?.name?.[0]}
      />
      <AdminField
        label="Email"
        type="email"
        autoComplete="off"
        value={values.email}
        onChange={(event) => update('email', event.target.value)}
        error={errors?.email?.[0]}
      />
      <PasswordField
        label="Password iniziale"
        autoComplete="new-password"
        value={values.password}
        onChange={(event) => update('password', event.target.value)}
        hint="Almeno 8 caratteri. Comunicala alla persona in modo sicuro: potrà essere cambiata."
        error={errors?.password?.[0]}
      />
      <AdminSelect
        label="Ruolo"
        value={values.role}
        onChange={(event) => update('role', event.target.value)}
        error={errors?.role?.[0]}
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

      <AdminButton
        type="submit"
        disabled={create.isPending}
        className="self-start"
      >
        {create.isPending ? 'Salvataggio…' : 'Aggiungi allo staff'}
      </AdminButton>
    </form>
  )
}

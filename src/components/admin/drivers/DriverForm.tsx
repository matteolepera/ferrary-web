import { useState, type FormEvent } from 'react'
import { validationErrors } from '@/api/errors'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminField } from '@/components/admin/ui/AdminField'
import { useDriverActions } from '@/hooks/useAdminDrivers'
import { todayInput } from '@/lib/birthDate'
import { countryName } from '@/lib/countryName'
import { slugify } from '@/lib/slugify'
import type { AdminDriver } from '@/types/admin'

type DriverFormProps = {
  driver?: AdminDriver
  onDone: () => void
}

/**
 * Il form di un pilota: nome, cognome, nazionalità, data di nascita e slug.
 */
export function DriverForm({ driver, onDone }: DriverFormProps) {
  const { save } = useDriverActions()
  const [values, setValues] = useState({
    first_name: driver?.first_name ?? '',
    last_name: driver?.last_name ?? '',
    nationality: driver?.nationality ?? '',
    birth_date: driver?.birth_date ?? '',
    slug: driver?.slug ?? '',
  })

  const errors = validationErrors(save.error)
  const nationality = countryName(values.nationality)

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    save.mutate(
      {
        id: driver?.id,
        payload: {
          first_name: values.first_name.trim(),
          last_name: values.last_name.trim(),
          slug: values.slug.trim() || undefined,
          nationality: values.nationality.trim().toUpperCase() || null,
          birth_date: values.birth_date || null,
        },
      },
      { onSuccess: onDone },
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
        value={values.first_name}
        placeholder="Charles"
        onChange={(event) => update('first_name', event.target.value)}
        error={errors?.first_name?.[0]}
      />
      <AdminField
        label="Cognome"
        value={values.last_name}
        placeholder="Leclerc"
        onChange={(event) => update('last_name', event.target.value)}
        error={errors?.last_name?.[0]}
      />
      <AdminField
        label="Nazionalità"
        value={values.nationality}
        maxLength={2}
        placeholder="MC"
        autoCapitalize="characters"
        onChange={(event) => update('nationality', event.target.value)}
        hint={
          nationality
            ? `Il codice di due lettere: ${nationality}.`
            : 'Il codice di due lettere: MC per Monaco.'
        }
        error={errors?.nationality?.[0]}
      />
      <AdminField
        label="Data di nascita"
        type="date"
        max={todayInput()}
        value={values.birth_date}
        onChange={(event) => update('birth_date', event.target.value)}
        error={errors?.birth_date?.[0]}
      />
      <AdminField
        label="Slug"
        value={values.slug}
        placeholder={slugify(`${values.first_name} ${values.last_name}`)}
        onChange={(event) => update('slug', event.target.value)}
        hint="Vuoto: lo generiamo da nome e cognome."
        error={errors?.slug?.[0]}
      />

      {save.isError && !errors && (
        <p role="alert" className="text-errore text-[0.8125rem]">
          Impossibile salvare in questo momento. Riprova.
        </p>
      )}

      <div className="flex gap-2.5">
        <AdminButton type="submit" disabled={save.isPending}>
          {save.isPending
            ? 'Salvataggio…'
            : driver
              ? 'Salva modifiche'
              : 'Crea pilota'}
        </AdminButton>
        {driver && (
          <AdminButton variant="outline" onClick={onDone}>
            Annulla
          </AdminButton>
        )}
      </div>
    </form>
  )
}

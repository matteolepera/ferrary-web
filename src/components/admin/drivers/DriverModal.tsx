import { useState, type FormEvent } from 'react'
import { validationErrors } from '@/api/errors'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { FormAlert } from '@/components/admin/ui/FormAlert'
import { useDriverActions } from '@/hooks/useAdminDrivers'
import { todayInput } from '@/lib/birthDate'
import { countryName } from '@/lib/format'
import { slugify } from '@/lib/slugify'
import type { AdminDriver } from '@/types/admin'

type DriverModalProps = {
  /** Il pilota da modificare; senza, la finestra ne crea uno nuovo */
  driver?: AdminDriver
  onClose: () => void
}

/**
 * La finestra di un pilota: nome, cognome, nazionalità, data di nascita e slug.
 * Si apre già aperta: chi la usa la mostra solo quando serve, e la toglie alla chiusura.
 */
export function DriverModal({ driver, onClose }: DriverModalProps) {
  const { save } = useDriverActions()
  // I valori di partenza, per capire se qualcosa è cambiato
  const [initial] = useState({
    first_name: driver?.first_name ?? '',
    last_name: driver?.last_name ?? '',
    nationality: driver?.nationality ?? '',
    birth_date: driver?.birth_date ?? '',
    slug: driver?.slug ?? '',
  })
  const [values, setValues] = useState(initial)

  const errors = validationErrors(save.error)
  const dirty = JSON.stringify(values) !== JSON.stringify(initial)
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
          // Il backend vuole il codice in maiuscolo
          nationality: values.nationality.trim().toUpperCase() || null,
          birth_date: values.birth_date || null,
        },
      },
      { onSuccess: onClose },
    )
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title={
        driver ? `${driver.first_name} ${driver.last_name}` : 'Nuovo pilota'
      }
      description="Si collega alle versioni dalla loro pagina."
      dirty={dirty}
      onSubmit={handleSubmit}
      submitLabel={driver ? 'Salva modifiche' : 'Crea pilota'}
      pending={save.isPending}
    >
      <div className="flex flex-col gap-5">
        {save.isError && !errors && (
          <FormAlert>Impossibile salvare in questo momento. Riprova.</FormAlert>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField
            label="Nome"
            required
            maxLength={100}
            value={values.first_name}
            placeholder="Charles"
            onChange={(event) => update('first_name', event.target.value)}
            error={errors?.first_name?.[0]}
          />
          <AdminField
            label="Cognome"
            required
            maxLength={100}
            value={values.last_name}
            placeholder="Leclerc"
            onChange={(event) => update('last_name', event.target.value)}
            error={errors?.last_name?.[0]}
          />
          <AdminField
            label="Nazionalità"
            optional
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
            optional
            type="date"
            max={todayInput()}
            value={values.birth_date}
            onChange={(event) => update('birth_date', event.target.value)}
            error={errors?.birth_date?.[0]}
          />
        </div>
        <AdminField
          label="Slug"
          optional
          maxLength={200}
          value={values.slug}
          placeholder={slugify(`${values.first_name} ${values.last_name}`)}
          onChange={(event) => update('slug', event.target.value)}
          hint="Vuoto: si crea da nome e cognome."
          error={errors?.slug?.[0]}
        />
      </div>
    </AdminModal>
  )
}

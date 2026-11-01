import { useState, type FormEvent } from 'react'
import { validationErrors } from '@/api/errors'
import { designerTypes } from '@/components/admin/designers/options'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { useDesignerActions } from '@/hooks/useAdminDesigners'
import { countryName } from '@/lib/countryName'
import { slugify } from '@/lib/slugify'
import type { AdminDesigner, DesignerType } from '@/types/admin'

type DesignerFormProps = {
  designer?: AdminDesigner
  onDone: () => void
}

/**
 * Il form di un designer: nome, tipo, paese e slug.
 */
export function DesignerForm({ designer, onDone }: DesignerFormProps) {
  const { save } = useDesignerActions()
  const [values, setValues] = useState({
    name: designer?.name ?? '',
    type: (designer?.type ?? '') as DesignerType | '',
    country: designer?.country ?? '',
    slug: designer?.slug ?? '',
  })

  const errors = validationErrors(save.error)
  const country = countryName(values.country)

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    save.mutate(
      {
        id: designer?.id,
        payload: {
          name: values.name.trim(),
          slug: values.slug.trim() || undefined,
          type: values.type || null,
          // Il backend vuole il codice in maiuscolo
          country: values.country.trim().toUpperCase() || null,
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
        value={values.name}
        placeholder="Pininfarina"
        onChange={(event) => update('name', event.target.value)}
        error={errors?.name?.[0]}
      />
      <AdminSelect
        label="Tipo"
        value={values.type}
        onChange={(event) => update('type', event.target.value)}
        error={errors?.type?.[0]}
      >
        <option value="">Scegli un tipo</option>
        {designerTypes.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </AdminSelect>
      <AdminField
        label="Paese"
        value={values.country}
        maxLength={2}
        placeholder="IT"
        autoCapitalize="characters"
        onChange={(event) => update('country', event.target.value)}
        hint={
          country
            ? `Il codice di due lettere: ${country}.`
            : 'Il codice di due lettere: IT per l’Italia.'
        }
        error={errors?.country?.[0]}
      />
      <AdminField
        label="Slug"
        value={values.slug}
        placeholder={slugify(values.name)}
        onChange={(event) => update('slug', event.target.value)}
        hint="Vuoto: lo generiamo dal nome."
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
            : designer
              ? 'Salva modifiche'
              : 'Crea designer'}
        </AdminButton>
        {designer && (
          <AdminButton variant="outline" onClick={onDone}>
            Annulla
          </AdminButton>
        )}
      </div>
    </form>
  )
}

import { useState, type FormEvent } from 'react'
import { validationErrors } from '@/api/errors'
import { designerTypes } from '@/components/admin/designers/options'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { useDesignerActions } from '@/hooks/useAdminDesigners'
import { countryName } from '@/lib/format'
import { slugify } from '@/lib/slugify'
import type { AdminDesigner, DesignerType } from '@/types/admin'

type DesignerModalProps = {
  /** Il designer da modificare; senza, la finestra ne crea uno nuovo */
  designer?: AdminDesigner
  onClose: () => void
}

/**
 * La finestra di un designer: nome, tipo, paese e slug.
 * Si apre già aperta: chi la usa la mostra solo quando serve, e la toglie alla chiusura.
 */
export function DesignerModal({ designer, onClose }: DesignerModalProps) {
  const { save } = useDesignerActions()
  // I valori di partenza, per capire se qualcosa è cambiato
  const [initial] = useState({
    name: designer?.name ?? '',
    type: (designer?.type ?? '') as DesignerType | '',
    country: designer?.country ?? '',
    slug: designer?.slug ?? '',
  })
  const [values, setValues] = useState(initial)

  const errors = validationErrors(save.error)
  const dirty = JSON.stringify(values) !== JSON.stringify(initial)
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
      { onSuccess: onClose },
    )
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title={designer ? designer.name : 'Nuovo designer'}
      description="Si collega alle versioni dalla loro pagina, con il suo ruolo."
      dirty={dirty}
      onSubmit={handleSubmit}
      submitLabel={designer ? 'Salva modifiche' : 'Crea designer'}
      pending={save.isPending}
    >
      <div className="flex flex-col gap-5">
        <AdminField
          label="Nome"
          required
          value={values.name}
          placeholder="Pininfarina"
          onChange={(event) => update('name', event.target.value)}
          error={errors?.name?.[0]}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminSelect
            label="Tipo"
            optional
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
            optional
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
        </div>
        <AdminField
          label="Slug"
          optional
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
      </div>
    </AdminModal>
  )
}

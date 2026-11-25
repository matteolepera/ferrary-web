import { useState, type FormEvent } from 'react'
import { validationErrors } from '@/api/errors'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { useCategoryActions } from '@/hooks/useCategoryActions'
import { slugify } from '@/lib/slugify'
import type { AdminCategory } from '@/types/admin'

type CategoryModalProps = {
  /** La famiglia da modificare; senza, la finestra ne crea una nuova */
  category?: AdminCategory
  /** La posizione proposta per una famiglia nuova: in fondo all'elenco */
  nextPosition: number
  onClose: () => void
}

/**
 * La finestra di una famiglia: nome nelle due lingue, indirizzo e posizione.
 * Si apre già aperta: chi la usa la mostra solo quando serve, e la toglie alla chiusura.
 */
export function CategoryModal({
  category,
  nextPosition,
  onClose,
}: CategoryModalProps) {
  const { save } = useCategoryActions()
  // I valori di partenza, per capire se qualcosa è cambiato
  const [initial] = useState({
    it: category?.name.it ?? '',
    en: category?.name.en ?? '',
    slug: category?.slug ?? '',
    position: String(category?.sort_order ?? nextPosition),
  })
  const [values, setValues] = useState(initial)

  const errors = validationErrors(save.error)
  const dirty = JSON.stringify(values) !== JSON.stringify(initial)

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    save.mutate(
      {
        id: category?.id,
        payload: {
          name: { it: values.it.trim(), en: values.en.trim() || undefined },
          slug: values.slug.trim() || undefined,
          sort_order: Number(values.position) || 0,
        },
      },
      { onSuccess: onClose },
    )
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title={category ? category.name.it : 'Nuova famiglia'}
      description={
        category
          ? 'Le modifiche valgono per il sito appena le salvi.'
          : 'Compare nei filtri dell’archivio e nella home.'
      }
      dirty={dirty}
      onSubmit={handleSubmit}
      submitLabel={category ? 'Salva modifiche' : 'Crea famiglia'}
      pending={save.isPending}
    >
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField
            label="Nome in italiano"
            required
            value={values.it}
            onChange={(event) => update('it', event.target.value)}
            error={errors?.['name.it']?.[0]}
          />
          <AdminField
            label="Nome in inglese"
            optional
            value={values.en}
            placeholder={values.it}
            onChange={(event) => update('en', event.target.value)}
            hint="Vuoto: sul sito in inglese resta il nome italiano."
            error={errors?.['name.en']?.[0]}
          />
        </div>
        <AdminField
          label="Slug"
          optional
          value={values.slug}
          placeholder={slugify(values.it)}
          onChange={(event) => update('slug', event.target.value)}
          hint={`Vuoto: si crea dal nome. Nell'indirizzo dell'archivio: ?category=${values.slug || slugify(values.it) || '…'}`}
          error={errors?.slug?.[0]}
        />
        <AdminField
          label="Posizione"
          type="number"
          inputMode="numeric"
          min={0}
          value={values.position}
          onChange={(event) => update('position', event.target.value)}
          hint="L'ordine nella home, nel piè di pagina e nei filtri."
          error={errors?.sort_order?.[0]}
          className="max-w-48"
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

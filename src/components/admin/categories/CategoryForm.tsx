import { useState, type FormEvent } from 'react'
import { validationErrors } from '@/api/errors'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminField } from '@/components/admin/ui/AdminField'
import { useCategoryActions } from '@/hooks/useCategoryActions'
import { slugify } from '@/lib/slugify'
import type { AdminCategory } from '@/types/admin'

type CategoryFormProps = {
  /** La famiglia da modificare; senza, il form ne crea una nuova */
  category?: AdminCategory
  /** La posizione proposta per una famiglia nuova: in fondo all'elenco */
  nextPosition: number
  onDone: () => void
}

/**
 * Il form di una famiglia: nome nelle due lingue, slug e posizione.
 */
export function CategoryForm({
  category,
  nextPosition,
  onDone,
}: CategoryFormProps) {
  const { save } = useCategoryActions()
  const [values, setValues] = useState({
    it: category?.name.it ?? '',
    en: category?.name.en ?? '',
    slug: category?.slug ?? '',
    position: String(category?.sort_order ?? nextPosition),
  })

  const errors = validationErrors(save.error)

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
        label="Nome in italiano"
        value={values.it}
        onChange={(event) => update('it', event.target.value)}
        error={errors?.['name.it']?.[0]}
      />
      <AdminField
        label="Nome in inglese"
        value={values.en}
        onChange={(event) => update('en', event.target.value)}
        error={errors?.['name.en']?.[0]}
      />
      <AdminField
        label="Slug"
        value={values.slug}
        placeholder={slugify(values.it)}
        onChange={(event) => update('slug', event.target.value)}
        hint={`Nell'indirizzo dell'archivio: ?category=${values.slug || slugify(values.it) || '…'}`}
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
            : category
              ? 'Salva modifiche'
              : 'Crea famiglia'}
        </AdminButton>
        {category && (
          <AdminButton variant="outline" onClick={onDone}>
            Annulla
          </AdminButton>
        )}
      </div>
    </form>
  )
}

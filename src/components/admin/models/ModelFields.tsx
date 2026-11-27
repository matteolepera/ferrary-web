import { PredecessorPicker } from '@/components/admin/models/PredecessorPicker'
import type { ModelFieldsProps } from '@/components/admin/models/modelValues'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea'
import { useAdminCategories } from '@/hooks/useAdminModels'
import { slugify } from '@/lib/slugify'

/**
 * I dati principali del modello: nome, famiglia, indirizzo e predecessore.
 * modelId è il modello che si modifica: non può precedere se stesso.
 */
export function ModelMainFields({
  values,
  onChange,
  errors,
  modelId,
}: ModelFieldsProps & { modelId?: number }) {
  const { data: categories } = useAdminCategories()
  const slugPreview = values.slug || slugify(values.name)

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <AdminField
        label="Nome"
        required
        value={values.name}
        onChange={(event) => onChange('name', event.target.value)}
        error={errors?.name?.[0]}
      />
      <AdminSelect
        label="Famiglia"
        required
        value={values.category_id}
        onChange={(event) => onChange('category_id', event.target.value)}
        error={errors?.category_id?.[0]}
      >
        <option value="">Scegli una famiglia</option>
        {categories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name.it}
          </option>
        ))}
      </AdminSelect>
      <AdminField
        label="Slug"
        optional
        value={values.slug}
        placeholder={slugify(values.name)}
        onChange={(event) => onChange('slug', event.target.value)}
        hint={`Nell'indirizzo del sito: /modelli/${slugPreview || '…'}`}
        error={errors?.slug?.[0]}
      />
      <PredecessorPicker
        value={values.predecessor}
        onChange={(predecessor) => onChange('predecessor', predecessor)}
        excludeId={modelId}
        error={errors?.predecessor_id?.[0]}
      />
    </div>
  )
}

/** La descrizione del modello: l'italiano è obbligatorio, l'inglese si aggiunge quando c'è */
export function ModelDescriptionFields({
  values,
  onChange,
  errors,
}: ModelFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <AdminTextarea
        label="In italiano"
        required
        value={values.description_it}
        onChange={(event) => onChange('description_it', event.target.value)}
        error={errors?.['description.it']?.[0]}
      />
      <AdminTextarea
        label="In inglese"
        optional
        value={values.description_en}
        onChange={(event) => onChange('description_en', event.target.value)}
        error={errors?.['description.en']?.[0]}
      />
    </div>
  )
}

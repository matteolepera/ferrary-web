import { AdminTextarea } from '@/components/admin/ui/AdminTextarea'
import type { VersionFieldsProps } from '@/components/admin/versions/versionValues'

/** I campi della descrizione: italiano sopra, inglese sotto */
export function DescriptionFields({
  values,
  onChange,
  errors,
}: VersionFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <AdminTextarea
        label="In italiano"
        value={values.description_it}
        onChange={(event) => onChange('description_it', event.target.value)}
        error={errors?.['description.it']?.[0]}
      />
      <AdminTextarea
        label="In inglese"
        value={values.description_en}
        onChange={(event) => onChange('description_en', event.target.value)}
        error={errors?.['description.en']?.[0]}
      />
    </div>
  )
}

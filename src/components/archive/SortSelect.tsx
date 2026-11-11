import { useTranslation } from 'react-i18next'
import type { ModelFilters } from '@/api/models'
import { ArchiveSelect } from '@/components/archive/ArchiveSelect'

type SortSelectProps = {
  value: ModelFilters['sort']
  onChange: (sort: ModelFilters['sort']) => void
  className?: string
}

/**
 * L'ordinamento dell'archivio, nella barra: il valore scelto dice già cosa fa.
 */
export function SortSelect({ value, onChange, className }: SortSelectProps) {
  const { t } = useTranslation()

  return (
    <ArchiveSelect
      label={t('archive.filters.sort')}
      prefix={t('archive.filters.sortShort')}
      value={value ?? ''}
      onChange={(sort) =>
        onChange(sort === '' ? undefined : (sort as ModelFilters['sort']))
      }
      className={className}
    >
      {/* Il valore vuoto è il predefinito dell'API: nome dalla A alla Z */}
      <option value="">{t('archive.filters.sorts.nameAsc')}</option>
      <option value="-name">{t('archive.filters.sorts.nameDesc')}</option>
      <option value="-year">{t('archive.filters.sorts.newest')}</option>
      <option value="year">{t('archive.filters.sorts.oldest')}</option>
    </ArchiveSelect>
  )
}

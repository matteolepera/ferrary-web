import { useTranslation } from 'react-i18next'
import { ArchiveSelect } from '@/components/archive/ArchiveSelect'
import { groupCategories } from '@/components/archive/categoryGroups'
import { useCategories } from '@/hooks/useCategories'

type FamilySelectProps = {
  /** Lo slug della famiglia scelta, o nessuno per vederle tutte */
  value: string | undefined
  onChange: (slug: string | undefined) => void
  className?: string
}

/**
 * Le famiglie in un menu, raggruppate in Stradali, Corsa e Concept.
 */
export function FamilySelect({
  value,
  onChange,
  className,
}: FamilySelectProps) {
  const { t } = useTranslation()
  const { data: families } = useCategories()

  if (!families || families.length === 0) {
    return null
  }

  return (
    <ArchiveSelect
      label={t('archive.family')}
      prefix={t('archive.family')}
      value={value ?? ''}
      // L'opzione vuota è "Tutte le famiglie": il filtro sparisce dall'indirizzo
      onChange={(slug) => onChange(slug || undefined)}
      className={className}
    >
      <option value="">{t('archive.allFamilies')}</option>
      {groupCategories(families).map((group) => (
        <optgroup key={group.key} label={t(`archive.groups.${group.key}`)}>
          {group.categories.map((family) => (
            <option key={family.slug} value={family.slug}>
              {family.name}
            </option>
          ))}
        </optgroup>
      ))}
    </ArchiveSelect>
  )
}

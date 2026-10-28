import { useTranslation } from 'react-i18next'
import { useCategories } from '@/hooks/useCategories'

type FamilyFilterProps = {
  /** Lo slug della famiglia scelta, o nessuno per vederle tutte */
  value: string | undefined
  onChange: (slug: string | undefined) => void
}

const pillClass = [
  'shrink-0 border px-4 py-2.5 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosso-acceso',
].join(' ')

/**
 * Le famiglie come pillole: una sola scelta alla volta, più "Tutte".
 */
export function FamilyFilter({ value, onChange }: FamilyFilterProps) {
  const { t } = useTranslation()
  const { data: families } = useCategories()

  if (!families || families.length === 0) {
    return null
  }

  const options = [
    { slug: undefined, name: t('archive.allFamilies') },
    ...families.map((family) => ({ slug: family.slug, name: family.name })),
  ]

  return (
    <div
      role="group"
      aria-label={t('archive.family')}
      className="senza-barra -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0"
    >
      {options.map((option) => {
        const active = option.slug === value

        return (
          <button
            key={option.slug ?? 'tutte'}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.slug)}
            className={`${pillClass} ${
              active
                ? 'text-notte border-white bg-white'
                : 'border-linea text-neutral-300 hover:border-neutral-500 hover:text-white'
            }`}
          >
            {option.name}
          </button>
        )
      })}
    </div>
  )
}

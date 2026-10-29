import { useTranslation } from 'react-i18next'
import { ModelCard } from '@/components/catalog/ModelCard'
import { useModels } from '@/hooks/useModels'
import type { CarModel } from '@/types/catalog'

type RelatedModelsProps = {
  model: CarModel
}

/** Quanti modelli della stessa famiglia proporre */
const RELATED_COUNT = 3

/**
 * Altri modelli della stessa famiglia, con le card dell'archivio.
 */
export function RelatedModels({ model }: RelatedModelsProps) {
  const { t } = useTranslation()
  const { data } = useModels({ category: model.category?.slug })

  // Il modello che si sta guardando non si propone a sé stesso
  const related = (data?.data ?? [])
    .filter((item) => item.id !== model.id)
    .slice(0, RELATED_COUNT)

  if (!model.category || related.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby="famiglia-titolo"
      className="mx-auto max-w-[1360px] px-5 pb-18 md:px-10 md:pb-24 lg:pb-32"
    >
      <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
        {model.category.name}
      </p>
      <h2
        id="famiglia-titolo"
        className="font-display mt-2.5 text-[2.125rem] leading-none font-extrabold tracking-[-0.035em] md:text-[2.75rem] lg:text-[3.5rem]"
      >
        {t('model.related')}
      </h2>

      <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => (
          <li key={item.id}>
            <ModelCard model={item} />
          </li>
        ))}
      </ul>
    </section>
  )
}

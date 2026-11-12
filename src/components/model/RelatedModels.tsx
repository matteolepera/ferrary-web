import { useTranslation } from 'react-i18next'
import { ModelCard } from '@/components/catalog/ModelCard'
import { useModels } from '@/hooks/useModels'
import type { CarModel } from '@/types/catalog'

type RelatedModelsProps = {
  model: CarModel
}

/** Quanti modelli della stessa famiglia proporre */
const RELATED_COUNT = 3

/** Quanti anni prima e dopo il modello cercare i suoi vicini */
const YEARS_AROUND = 15

/**
 * Altri modelli della stessa famiglia, i più vicini per anno,
 * con le carte dell'archivio. Quelli già nella discendenza non si ripetono.
 */
export function RelatedModels({ model }: RelatedModelsProps) {
  const { t } = useTranslation()
  const year = model.first_year

  // I modelli della famiglia negli anni intorno a questo: la finestra tiene la richiesta piccola
  const { data } = useModels({
    category: model.category?.slug,
    ...(year
      ? { year_from: year - YEARS_AROUND, year_to: year + YEARS_AROUND }
      : {}),
    sort: '-year',
  })

  // Il modello stesso e quelli già nella discendenza non si propongono di nuovo
  const shown = new Set([
    model.id,
    model.predecessor?.id,
    ...(model.successors ?? []).map((successor) => successor.id),
  ])

  const related = (data?.data ?? [])
    .filter((item) => !shown.has(item.id))
    // I più vicini per anno per primi; senza anno, l'ordine dell'API
    .sort((a, b) =>
      year
        ? Math.abs((a.first_year ?? year) - year) -
          Math.abs((b.first_year ?? year) - year)
        : 0,
    )
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

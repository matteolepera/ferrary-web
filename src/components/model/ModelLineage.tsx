import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { CarModel } from '@/types/catalog'

type ModelLineageProps = {
  model: CarModel
}

const labelClass = 'text-[0.625rem] font-semibold tracking-[0.2em] uppercase'
const nameClass =
  'mt-1.5 font-display text-2xl leading-tight font-extrabold tracking-[-0.035em]'

/**
 * La discendenza: predecessore, il modello corrente e i successori, collegati da una linea rossa.
 */
export function ModelLineage({ model }: ModelLineageProps) {
  const { t } = useTranslation()
  const successors = model.successors ?? []

  if (!model.predecessor && successors.length === 0) {
    return null
  }

  const steps = [
    ...(model.predecessor
      ? [
          {
            model: model.predecessor,
            label: t('model.predecessor'),
            current: false,
          },
        ]
      : []),
    { model, label: t('model.thisModel'), current: true },
    ...successors.map((successor) => ({
      model: successor,
      label: t('model.successor'),
      current: false,
    })),
  ]

  return (
    <section
      aria-labelledby="discendenza-titolo"
      className="border-linea border-t"
    >
      <div className="mx-auto max-w-[1360px] px-5 py-18 md:px-10 md:py-24">
        <h2
          id="discendenza-titolo"
          className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs"
        >
          {t('model.lineage')}
        </h2>

        {/* Una lista ordinata: l'ordine qui è il significato, dal più vecchio al più nuovo */}
        <ol className="mt-8 flex flex-col md:flex-row md:items-stretch">
          {steps.map((step, index) => (
            <li
              key={step.model.id}
              className="flex flex-col md:flex-1 md:flex-row md:items-center"
            >
              {/* Il segmento che collega al passaggio precedente: verticale su mobile, orizzontale dal tablet */}
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="bg-rosso ml-6 h-6 w-px md:ml-0 md:h-px md:w-10 md:shrink-0"
                />
              )}

              {step.current ? (
                <div
                  aria-current="page"
                  className="border-rosso bg-ombra flex-1 border px-5 py-4"
                >
                  <p className={`${labelClass} text-rosso-acceso`}>
                    {step.label}
                  </p>
                  <p className={nameClass}>{step.model.name}</p>
                </div>
              ) : (
                <Link
                  to={`/modelli/${step.model.slug}`}
                  className={[
                    'border-linea flex-1 border px-5 py-4 transition-colors hover:border-neutral-500',
                    'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-2',
                  ].join(' ')}
                >
                  <p className={`${labelClass} text-neutral-400`}>
                    {step.label}
                  </p>
                  <p className={nameClass}>{step.model.name}</p>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

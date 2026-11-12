import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { CarModel } from '@/types/catalog'
import { Eyebrow } from '@/components/ui/Eyebrow'

type ModelLineageProps = {
  model: CarModel
}

/** La targhetta di un passaggio: la forma della Y, piccola, con il bordo come ombra interna */
const plateClass = [
  'relative flex flex-1 flex-col justify-center rounded-[3px] rounded-tl-[16px] px-6 py-5',
  '[clip-path:polygon(0_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%)]',
].join(' ')

const labelClass = 'text-[0.625rem] font-semibold tracking-[0.2em] uppercase'
const nameClass =
  'font-display mt-1.5 text-2xl leading-tight font-extrabold tracking-[-0.035em] md:text-[1.75rem]'

/**
 * La discendenza: il predecessore, il modello corrente e i successori, come targhette della Y in fila.
 * Il modello corrente è sotto il riflettore, con il segno rosso.
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
            arrow: '←',
          },
        ]
      : []),
    { model, label: t('model.thisModel'), current: true, arrow: '' },
    ...successors.map((successor) => ({
      model: successor,
      label: t('model.successor'),
      current: false,
      arrow: '→',
    })),
  ]

  return (
    <section
      aria-labelledby="discendenza-titolo"
      className="border-linea border-t"
    >
      <div className="mx-auto max-w-[1360px] px-5 py-18 md:px-10 md:py-24">
        <Eyebrow as="h2" id="discendenza-titolo">
          {t('model.lineage')}
        </Eyebrow>

        {/* Una lista ordinata: l'ordine qui è il significato, dal più vecchio al più nuovo */}
        <ol className="mt-8 flex flex-col md:flex-row md:items-stretch">
          {steps.map((step, index) => (
            <li
              key={step.model.id}
              className="flex flex-col md:flex-1 md:flex-row md:items-center"
            >
              {/* Il filo che collega al passaggio precedente: verticale su telefono, orizzontale dal tablet */}
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="ml-8 h-6 w-px bg-white/15 md:ml-0 md:h-px md:w-8 md:shrink-0 lg:w-12"
                />
              )}

              {step.current ? (
                // Il modello che si sta guardando: non un link, ma la targhetta sotto il riflettore
                <div
                  aria-current="page"
                  className={[
                    plateClass,
                    'bg-neutral-900 bg-[radial-gradient(ellipse_70%_90%_at_50%_0%,rgba(255,255,255,0.12),transparent_75%)]',
                    'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]',
                  ].join(' ')}
                >
                  <p
                    className={`${labelClass} text-rosso-acceso flex items-center gap-2.5`}
                  >
                    <span
                      aria-hidden="true"
                      className="bg-rosso-acceso h-[3px] w-3 -skew-x-[28deg] shadow-[0_0_8px_rgba(255,59,48,0.7)]"
                    />
                    {step.label}
                  </p>
                  <p className={nameClass}>{step.model.name}</p>
                  {step.model.first_year && (
                    <p className="mt-1 text-sm text-neutral-400 tabular-nums">
                      {step.model.first_year}
                    </p>
                  )}
                </div>
              ) : (
                <Link
                  to={`/modelli/${step.model.slug}`}
                  className={[
                    plateClass,
                    'group bg-neutral-900/50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] transition-shadow duration-300',
                    'hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]',
                    // Il contorno del focus disegnato dentro: il ritaglio taglierebbe quello di fuori
                    'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:-outline-offset-4',
                  ].join(' ')}
                >
                  <p className={`${labelClass} text-neutral-500`}>
                    {step.label}
                  </p>
                  <p className={nameClass}>{step.model.name}</p>
                  {step.model.first_year && (
                    <p className="mt-1 text-sm text-neutral-500 tabular-nums">
                      {step.model.first_year}
                    </p>
                  )}
                  {/* La freccia dice la direzione nel tempo: indietro verso il predecessore, avanti verso i successori */}
                  <span
                    aria-hidden="true"
                    className="group-hover:text-rosso-acceso absolute top-1/2 right-7 -translate-y-1/2 text-lg text-neutral-600 transition-colors"
                  >
                    {step.arrow}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

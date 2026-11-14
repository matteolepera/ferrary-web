import type { CSSProperties } from 'react'

/** Un dato: il valore, e per i numeri protagonisti l'unità a parte, più piccola */
export type Fact = {
  key: string
  label: string
  value: string | null
  unit?: string
}

type FactStripProps = {
  /** Il nome della fascia, per chi usa un lettore di schermo */
  label: string
  /** I numeri protagonisti, grandi, con il segno rosso */
  stars: Fact[]
  /** La didascalia accanto, più piccola */
  caption: Fact[]
}

/** Solo i dati che esistono */
const present = (facts: Fact[]) =>
  facts.filter((fact): fact is Fact & { value: string } => fact.value !== null)

/**
 * La fascia dei dati, come la didascalia di un'opera: i numeri protagonisti grandi
 * e il resto più piccolo accanto. Un dato senza valore non compare, e senza dati
 * la fascia non c'è.
 */
export function FactStrip({
  label,
  stars: allStars,
  caption: allCaption,
}: FactStripProps) {
  const stars = present(allStars)
  const caption = present(allCaption)

  if (stars.length === 0 && caption.length === 0) {
    return null
  }

  return (
    <section aria-label={label} className="border-linea border-y">
      {/* Telefono e tablet: i protagonisti in fila, la didascalia sotto. Dal desktop: tutto su una riga */}
      <div className="mx-auto max-w-[1360px] px-5 md:px-10 lg:flex">
        {stars.length > 0 && (
          <dl
            className="divide-linea grid grid-cols-[repeat(var(--stars),minmax(0,1fr))] divide-x"
            // I protagonisti si dividono lo spazio: dal desktop, uno ciascuno, e la didascalia un po' di più
            style={
              {
                '--stars': stars.length,
                flex: `${stars.length} 1 0%`,
              } as CSSProperties
            }
          >
            {stars.map((item) => (
              <div
                key={item.key}
                className="py-6 pr-3 pl-3 first:pl-0 md:py-9 md:pr-8 md:pl-8"
              >
                <dt className="flex items-center gap-2.5 text-[0.5625rem] font-semibold tracking-[0.16em] text-neutral-400 uppercase md:text-[0.625rem] md:tracking-[0.22em]">
                  {/* Il segno rosso obliquo, come nella barra della Y */}
                  <span
                    aria-hidden="true"
                    className="bg-rosso-acceso h-[3px] w-2.5 shrink-0 -skew-x-[28deg] shadow-[0_0_8px_rgba(255,59,48,0.6)] md:w-3.5"
                  />
                  {item.label}
                </dt>
                <dd className="font-display mt-3 text-[2rem] leading-[0.9] font-extrabold tracking-[-0.04em] md:mt-4 md:text-5xl lg:text-[4rem]">
                  {item.value}
                  {item.unit && (
                    <span className="font-sans text-[0.6875rem] font-semibold tracking-[0.02em] text-neutral-400 md:text-[0.9375rem]">
                      {' '}
                      {item.unit}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {caption.length > 0 && (
          <dl
            className={[
              'grid grid-cols-2 content-center gap-x-5 gap-y-4 py-5 md:gap-x-7 md:py-6',
              'lg:border-linea lg:border-l lg:py-8 lg:pl-10',
              // Sotto i protagonisti, una linea li separa; dal desktop la linea è a sinistra
              stars.length > 0 ? 'border-linea border-t lg:border-t-0' : '',
            ].join(' ')}
            style={{ flex: '1.25 1 0%' }}
          >
            {caption.map((item) => (
              <div key={item.key}>
                <dt className="text-[0.625rem] font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                  {item.label}
                </dt>
                <dd className="font-display mt-1.5 text-[0.9375rem] font-bold tracking-[-0.02em] md:text-lg">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}

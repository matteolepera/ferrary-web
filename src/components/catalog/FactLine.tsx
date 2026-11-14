import type { Fact } from '@/components/ui/FactStrip'

/**
 * Pochi dati brevi in una riga sotto il nome, separati dal segno inclinato della Y:
 * per designer e piloti, dove una fascia grande resterebbe mezza vuota.
 * Un dato senza valore non compare.
 */
export function FactLine({ facts }: { facts: Fact[] }) {
  const shown = facts.filter(
    (fact): fact is Fact & { value: string } => fact.value !== null,
  )

  if (shown.length === 0) {
    return null
  }

  return (
    <dl className="mt-7 flex flex-wrap gap-y-5 md:mt-9">
      {shown.map((fact) => (
        <div
          key={fact.key}
          // Dal secondo dato in poi, il separatore inclinato a sinistra: un ::before,
          // perché dentro un <dl> stanno solo <dt> e <dd>
          className="relative pr-6 not-first:pl-6 not-first:before:absolute not-first:before:inset-y-0 not-first:before:left-0 not-first:before:w-px not-first:before:-skew-x-[20deg] not-first:before:bg-white/14 not-first:before:content-[''] md:pr-9 md:not-first:pl-9"
        >
          <dt className="flex items-center gap-2.5 text-[0.5625rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase md:text-[0.625rem]">
            {/* Il segno rosso obliquo, come nella barra della Y */}
            <span
              aria-hidden="true"
              className="bg-rosso-acceso h-[3px] w-3 shrink-0 -skew-x-[28deg] shadow-[0_0_8px_rgba(255,59,48,0.6)]"
            />
            {fact.label}
          </dt>
          <dd className="font-display mt-2.5 text-2xl leading-none font-extrabold tracking-[-0.03em] md:text-[2rem]">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

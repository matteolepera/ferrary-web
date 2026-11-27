import { PencilSimpleIcon } from '@phosphor-icons/react'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import {
  missingCount,
  type SummaryItem,
} from '@/components/admin/versions/versionSummary'
import { sectionButtonClass } from '@/components/admin/ui/adminButtonClass'

type SectionCardProps = {
  id: string
  title: string
  items: SummaryItem[]
  /** Il testo quando la sezione non ha nessun dato */
  empty?: string
  onEdit: () => void
  delay?: number
  className?: string
}

/**
 * Una sezione da leggere, nelle pagine di versioni, modelli e motori: i dati in griglia,
 * quelli mancanti con un trattino, e «Modifica» che apre la finestra della sezione.
 */
export function SectionCard({
  id,
  title,
  items,
  empty = 'Ancora nessun dato.',
  onEdit,
  delay,
  className = '',
}: SectionCardProps) {
  const missing = missingCount(items)

  return (
    <AdminCard
      aria-labelledby={id}
      delay={delay}
      className={`p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2
            id={id}
            className="font-display text-xl font-extrabold tracking-[-0.03em]"
          >
            {title}
          </h2>
          {/* Fuori dal titolo: il nome della sezione resta "Scheda tecnica" */}
          {items.length > 0 && missing > 0 && (
            <span className="rounded-full bg-amber-400/12 px-2.5 py-1 text-[0.6875rem] font-semibold text-amber-300">
              {missing === 1 ? '1 dato mancante' : `${missing} dati mancanti`}
            </span>
          )}
        </div>
        {/* Per il lettore di schermo: "Modifica scheda tecnica", non solo "Modifica" */}
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Modifica ${title.toLowerCase()}`}
          className={sectionButtonClass}
        >
          <PencilSimpleIcon aria-hidden="true" size={14} />
          Modifica
        </button>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-400">{empty}</p>
      ) : (
        // Le colonne si riempiono da sole: quattro dati stanno in una riga, dodici in tre
        <dl className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-x-6 gap-y-4">
          {items.map((item) => (
            <div
              key={item.label}
              className={item.wide ? 'col-span-full' : undefined}
            >
              <dt className="text-xs text-neutral-500">{item.label}</dt>
              {item.value === null ? (
                <dd className="mt-1 text-[0.9375rem] text-neutral-600">
                  <span aria-hidden="true">—</span>
                  <span className="sr-only">Non indicato</span>
                </dd>
              ) : (
                <dd
                  className={
                    item.wide
                      ? 'mt-1 line-clamp-4 text-sm leading-relaxed whitespace-pre-line text-neutral-300'
                      : 'mt-1 text-[0.9375rem] font-semibold text-neutral-100'
                  }
                >
                  {item.value}
                </dd>
              )}
            </div>
          ))}
        </dl>
      )}
    </AdminCard>
  )
}

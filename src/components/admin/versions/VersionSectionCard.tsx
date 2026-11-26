import { PencilSimpleIcon } from '@phosphor-icons/react'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import type { SummaryItem } from '@/components/admin/versions/versionSummary'

type VersionSectionCardProps = {
  id: string
  title: string
  items: SummaryItem[]
  /** Il testo quando la sezione non ha nessun dato */
  empty?: string
  onEdit: () => void
  delay?: number
  className?: string
}

const editButton = [
  'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-4',
  'text-[0.8125rem] font-semibold transition-colors hover:border-white/50',
  'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-2',
].join(' ')

/**
 * Una sezione della versione da leggere: i dati in griglia, quelli mancanti con un trattino,
 * e «Modifica» che apre la finestra della sezione.
 */
export function VersionSectionCard({
  id,
  title,
  items,
  empty = 'Ancora nessun dato.',
  onEdit,
  delay,
  className = '',
}: VersionSectionCardProps) {
  return (
    <AdminCard
      aria-labelledby={id}
      delay={delay}
      className={`p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id={id}
          className="font-display text-xl font-extrabold tracking-[-0.03em]"
        >
          {title}
        </h2>
        {/* Per il lettore di schermo: "Modifica scheda tecnica", non solo "Modifica" */}
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Modifica ${title.toLowerCase()}`}
          className={editButton}
        >
          <PencilSimpleIcon aria-hidden="true" size={14} />
          Modifica
        </button>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-400">{empty}</p>
      ) : (
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 xl:grid-cols-4">
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

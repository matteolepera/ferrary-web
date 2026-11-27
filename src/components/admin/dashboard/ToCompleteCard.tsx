import { useState } from 'react'
import { Link } from 'react-router'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import {
  FilterPills,
  type FilterOption,
} from '@/components/admin/ui/FilterPills'
import { Icon } from '@/components/admin/ui/Icon'
import { timeAgo } from '@/lib/timeAgo'
import type { CompletionIssue, ToCompleteItem } from '@/types/dashboard'

const issueLabels: Record<CompletionIssue, string> = {
  draft: 'Bozza',
  no_photos: 'Senza foto',
  no_specs: 'Dati incompleti',
}

/** Le pillole dei filtri: undefined vuol dire "tutto" */
const filters: FilterOption<CompletionIssue>[] = [
  { value: undefined, label: 'Tutto' },
  { value: 'draft', label: 'Bozze' },
  { value: 'no_photos', label: 'Senza foto' },
  { value: 'no_specs', label: 'Dati incompleti' },
]

/** Quante card mostrare: il backend ne manda di più, perché ne restino anche filtrando */
const VISIBLE = 6

type ToCompleteCardProps = {
  items: ToCompleteItem[]
  delay?: number
  className?: string
}

/**
 * Le versioni a cui manca qualcosa prima di andare online, con i filtri per tipo di mancanza.
 */
export function ToCompleteCard({
  items,
  delay,
  className = '',
}: ToCompleteCardProps) {
  const [filter, setFilter] = useState<CompletionIssue>()

  // Ogni pillola dice quante schede dà: chi guarda sa dove conviene cliccare
  const options = filters.map(({ value, label }) => ({
    value,
    label,
    count: value
      ? items.filter((item) => item.issues.includes(value)).length
      : items.length,
  }))
  const visible = items
    .filter((item) => !filter || item.issues.includes(filter))
    .slice(0, VISIBLE)

  return (
    <AdminCard
      aria-labelledby="pannello-da-completare"
      delay={delay}
      className={`p-6 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            id="pannello-da-completare"
            className="font-display text-2xl font-extrabold tracking-[-0.03em]"
          >
            Da completare
          </h2>
          <p className="mt-1 text-[0.8125rem] text-neutral-400">
            Le schede a cui manca qualcosa prima di andare online.
          </p>
        </div>

        <FilterPills
          label="Filtra per mancanza"
          options={options}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {visible.length > 0 ? (
        <ul className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-3">
          {visible.map((item) => (
            <li
              key={item.id}
              className="group border-linea bg-notte overflow-hidden rounded-[1.125rem] border"
            >
              <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,#1e1e1e,#0b0b0b_70%)]">
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="text-[0.6875rem] font-semibold tracking-[0.18em] text-neutral-600 uppercase"
                  >
                    Senza foto
                  </span>
                )}

                <ul
                  aria-label="Cosa manca"
                  className="absolute top-2.5 left-2.5 flex flex-wrap gap-1"
                >
                  {item.issues.map((issue) => (
                    <li
                      key={issue}
                      className={[
                        'rounded-full px-2 py-1 text-[0.625rem] font-bold tracking-[0.08em] uppercase',
                        issue === 'draft'
                          ? 'text-notte bg-white'
                          : 'bg-notte/80 border border-white/15 text-neutral-200',
                      ].join(' ')}
                    >
                      {issueLabels[issue]}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-end justify-between gap-2.5 px-4 pt-3.5 pb-4">
                <div className="min-w-0">
                  <h3 className="font-display truncate text-[1.0625rem] font-extrabold tracking-[-0.02em]">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-400">
                    Aggiornata{' '}
                    <time dateTime={item.updated_at}>
                      {timeAgo(item.updated_at)}
                    </time>
                  </p>
                </div>
                <Link
                  to={`/admin/modelli/${item.model_id}/versioni/${item.id}`}
                  aria-label={`Modifica ${item.name}`}
                  className="hover:border-rosso hover:bg-rosso flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition-colors hover:text-white"
                >
                  <Icon path="M4 20l4-1 11-11-3-3L5 16z" size={14} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-linea mt-5 rounded-[1.125rem] border border-dashed px-5 py-8 text-center text-sm text-neutral-400">
          {items.length === 0
            ? 'Tutto completo: ogni versione ha foto e scheda tecnica.'
            : 'Nessuna scheda con questa mancanza.'}
        </p>
      )}
    </AdminCard>
  )
}

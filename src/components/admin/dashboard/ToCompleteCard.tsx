import { useState } from 'react'
import { Link } from 'react-router'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { Icon } from '@/components/admin/ui/Icon'
import { timeAgo } from '@/lib/timeAgo'
import type { CompletionIssue, ToCompleteItem } from '@/types/dashboard'

const issueLabels: Record<CompletionIssue, string> = {
  draft: 'Bozza',
  no_photos: 'Senza foto',
  no_specs: 'Dati incompleti',
}

type Filter = 'all' | CompletionIssue

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tutto' },
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
  const [filter, setFilter] = useState<Filter>('all')

  const countFor = (value: Filter) =>
    value === 'all'
      ? items.length
      : items.filter((item) => item.issues.includes(value)).length
  const visible = items
    .filter((item) => filter === 'all' || item.issues.includes(filter))
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

        <div
          role="group"
          aria-label="Filtra per mancanza"
          className="flex flex-wrap gap-1.5"
        >
          {filters.map(({ value, label }) => {
            const active = value === filter

            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(value)}
                className={[
                  'flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors',
                  active
                    ? 'text-notte border-white bg-white'
                    : 'border-linea text-neutral-300 hover:border-neutral-600 hover:text-white',
                ].join(' ')}
              >
                {label}
                <span className="tabular-nums opacity-60">
                  {countFor(value)}
                </span>
              </button>
            )
          })}
        </div>
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

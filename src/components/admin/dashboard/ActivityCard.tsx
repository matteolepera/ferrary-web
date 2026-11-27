import { useState } from 'react'
import { Link } from 'react-router'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { Avatar } from '@/components/admin/ui/Avatar'
import {
  FilterPills,
  type FilterOption,
} from '@/components/admin/ui/FilterPills'
import { timeAgo } from '@/lib/timeAgo'
import type { ActivityItem } from '@/types/dashboard'
import { phrase, subjectLabel } from '@/components/admin/activity/phrases'

/** Le pillole dei registri: undefined vuol dire "tutto" */
const logs: FilterOption<ActivityItem['log']>[] = [
  { value: undefined, label: 'Tutto' },
  { value: 'catalogo', label: 'Catalogo' },
  { value: 'staff', label: 'Staff' },
]

type ActivityCardProps = {
  items: ActivityItem[]
  /** Le pillole e il link al registro servono solo a chi riceve anche il log dello staff */
  showTabs: boolean
  /** Il nome di chi guarda: il suo avatar è rosso */
  currentUserName?: string
  delay?: number
  className?: string
}

/**
 * Le ultime azioni dello staff, raccontate in una frase.
 */
export function ActivityCard({
  items,
  showTabs,
  currentUserName,
  delay,
  className = '',
}: ActivityCardProps) {
  const [log, setLog] = useState<ActivityItem['log']>()

  const visible = items.filter((item) => !log || item.log === log)

  return (
    <AdminCard
      aria-labelledby="pannello-attivita"
      delay={delay}
      className={`p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h2
          id="pannello-attivita"
          className="font-display text-xl font-extrabold tracking-[-0.03em]"
        >
          Attività recente
        </h2>
        {/* Il registro completo è di Admin e Master: gli stessi che vedono le pillole */}
        {showTabs && (
          <Link
            to="/admin/registro"
            className="text-xs font-semibold text-neutral-300 transition-colors hover:text-white"
          >
            Registro <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      {showTabs && (
        <div className="mt-4">
          <FilterPills
            label="Filtra per registro"
            options={logs}
            value={log}
            onChange={setLog}
          />
        </div>
      )}

      {visible.length > 0 ? (
        <ul className="mt-2">
          {visible.map((item) => (
            <li
              key={item.id}
              className="border-linea flex gap-3 border-b py-3.5 last:border-b-0"
            >
              <Avatar
                name={item.causer}
                highlighted={
                  item.causer !== null && item.causer === currentUserName
                }
                className="size-8.5 text-[0.6875rem]"
              />
              <div className="min-w-0">
                <p className="text-[0.8125rem] leading-relaxed text-neutral-300">
                  <strong className="font-semibold text-white">
                    {item.causer ?? 'Sistema'}
                  </strong>{' '}
                  {phrase(item)}{' '}
                  {item.subject_name ? (
                    <strong className="font-semibold text-white">
                      {item.subject_name}
                    </strong>
                  ) : (
                    subjectLabel(item)
                  )}
                </p>
                <p className="mt-0.5 text-[0.6875rem] text-neutral-400">
                  <time dateTime={item.created_at}>
                    {timeAgo(item.created_at)}
                  </time>
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-neutral-400">
          Nessuna attività recente.
        </p>
      )}
    </AdminCard>
  )
}

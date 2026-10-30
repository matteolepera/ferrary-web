import { useState } from 'react'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { Avatar } from '@/components/admin/ui/Avatar'
import { timeAgo } from '@/lib/timeAgo'
import type { ActivityItem } from '@/types/dashboard'

const phrases: Record<string, string> = {
  created: 'ha creato',
  updated: 'ha modificato',
  deleted: 'ha spostato nel cestino',
  restored: 'ha ripristinato',
  published: 'ha pubblicato',
  scheduled: 'ha programmato',
  unpublished: 'ha riportato in bozza',
  role_changed: 'ha cambiato il ruolo di',
}

/** Le frasi sulle persone dello staff, dove "ha creato" suonerebbe strano */
const staffPhrases: Record<string, string> = {
  created: 'ha aggiunto allo staff',
  deleted: 'ha rimosso dallo staff',
  updated: 'ha modificato il profilo di',
}

/** Quando ciò che è stato modificato non ha un nome, come una foto */
const subjectTypes: Record<string, string> = {
  car_model: 'un modello',
  version: 'una versione',
  version_spec: 'una scheda tecnica',
  version_powertrain: 'una motorizzazione',
  image: 'una foto',
  engine: 'un motore',
  designer: 'un designer',
  driver: 'un pilota',
  category: 'una famiglia',
  user: 'una persona',
}

function phrase({ action, subject_type }: ActivityItem) {
  if (subject_type === 'user' && staffPhrases[action]) {
    return staffPhrases[action]
  }

  // Un'azione che non conosciamo ancora: meglio una frase generica che un codice
  return phrases[action] ?? 'ha modificato'
}

type Tab = 'all' | ActivityItem['log']

const tabs: { value: Tab; label: string }[] = [
  { value: 'all', label: 'Tutto' },
  { value: 'catalogo', label: 'Catalogo' },
  { value: 'staff', label: 'Staff' },
]

type ActivityCardProps = {
  items: ActivityItem[]
  /** Le schede servono solo a chi riceve anche il log dello staff */
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
  const [tab, setTab] = useState<Tab>('all')

  const visible = items.filter((item) => tab === 'all' || item.log === tab)

  return (
    <AdminCard
      aria-labelledby="pannello-attivita"
      delay={delay}
      className={`p-6 ${className}`}
    >
      <h2
        id="pannello-attivita"
        className="font-display text-xl font-extrabold tracking-[-0.03em]"
      >
        Attività recente
      </h2>

      {showTabs && (
        <div
          role="group"
          aria-label="Filtra per registro"
          className="border-linea mt-3.5 flex gap-4.5 border-b"
        >
          {tabs.map(({ value, label }) => {
            const active = value === tab

            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => setTab(value)}
                className={[
                  '-mb-px border-b-2 pb-2.5 text-xs font-semibold transition-colors',
                  active
                    ? 'border-rosso text-white'
                    : 'border-transparent text-neutral-400 hover:text-white',
                ].join(' ')}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {visible.length > 0 ? (
        <ul className="mt-1">
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
                    (subjectTypes[item.subject_type] ?? 'un elemento')
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

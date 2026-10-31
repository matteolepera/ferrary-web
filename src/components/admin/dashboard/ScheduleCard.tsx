import { useState } from 'react'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { Icon } from '@/components/admin/ui/Icon'
import { addDays, isSameDay, startOfWeek } from '@/lib/calendar'
import type { ScheduledItem } from '@/types/dashboard'

const weekdayFormat = new Intl.DateTimeFormat('it', { weekday: 'short' })
const fullDayFormat = new Intl.DateTimeFormat('it', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})
const monthFormat = new Intl.DateTimeFormat('it', { month: 'long' })
const whenFormat = new Intl.DateTimeFormat('it', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Il titolo della settimana: "Ottobre 2026", o "Ottobre – Novembre 2026" se ne attraversa due */
function weekTitle(first: Date, last: Date) {
  const from = capitalize(monthFormat.format(first))
  const to = capitalize(monthFormat.format(last))

  return first.getMonth() === last.getMonth()
    ? `${from} ${last.getFullYear()}`
    : `${from} – ${to} ${last.getFullYear()}`
}

type ScheduleCardProps = {
  items: ScheduledItem[]
  delay?: number
  className?: string
}

/**
 * Il calendario del pannello: la settimana, con un punto nei giorni delle pubblicazioni,
 * e l'elenco di quelle in arrivo.
 */
export function ScheduleCard({
  items,
  delay,
  className = '',
}: ScheduleCardProps) {
  // 0 è questa settimana, 1 la prossima, -1 la scorsa
  const [offset, setOffset] = useState(0)

  const today = new Date()
  const days = Array.from({ length: 7 }, (_, index) =>
    addDays(startOfWeek(today), offset * 7 + index),
  )
  const dates = items.map((item) => new Date(item.published_at))

  return (
    <AdminCard
      aria-label="Calendario delle pubblicazioni"
      delay={delay}
      className={`p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          aria-live="polite"
          className="font-display text-xl font-extrabold tracking-[-0.03em]"
        >
          {weekTitle(days[0], days[6])}
        </h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Settimana precedente"
            onClick={() => setOffset((current) => current - 1)}
            className="hover:border-rosso hover:bg-rosso flex size-9 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition-colors hover:text-white"
          >
            <Icon path="M15 6l-6 6 6 6" size={16} />
          </button>
          <button
            type="button"
            aria-label="Settimana successiva"
            onClick={() => setOffset((current) => current + 1)}
            className="hover:border-rosso hover:bg-rosso flex size-9 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition-colors hover:text-white"
          >
            <Icon path="M9 6l6 6-6 6" size={16} />
          </button>
        </div>
      </div>

      <ol className="mt-5 grid grid-cols-7 gap-1 text-center">
        {days.map((day) => {
          const isToday = isSameDay(day, today)
          const count = dates.filter((date) => isSameDay(date, day)).length
          const description = [
            capitalize(fullDayFormat.format(day)),
            isToday && 'oggi',
            count > 0 &&
              (count === 1 ? '1 pubblicazione' : `${count} pubblicazioni`),
          ]
            .filter(Boolean)
            .join(', ')

          return (
            <li
              key={day.toISOString()}
              aria-current={isToday ? 'date' : undefined}
              className={[
                'rounded-2xl pt-2.5 pb-2',
                isToday ? 'text-notte bg-white' : 'text-neutral-100',
              ].join(' ')}
            >
              {/* Quello che si vede, per chi guarda la griglia */}
              <span
                aria-hidden="true"
                className="block text-[0.625rem] tracking-[0.1em] uppercase opacity-70"
              >
                {weekdayFormat.format(day)}
              </span>
              <span
                aria-hidden="true"
                className="font-display mt-1.5 block text-lg font-extrabold tabular-nums"
              >
                {day.getDate()}
              </span>
              <span
                aria-hidden="true"
                className={[
                  'mx-auto mt-1.5 block size-1.5 rounded-full',
                  count > 0 ? 'bg-rosso-acceso' : 'bg-transparent',
                ].join(' ')}
              />
              {/* Quello che si sente, per chi usa un lettore di schermo */}
              <span className="sr-only">{description}</span>
            </li>
          )
        })}
      </ol>

      <h3 className="mt-6 mb-2.5 text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
        In programma
      </h3>
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li
              key={`${item.type}-${item.id}`}
              className="border-linea flex items-center justify-between gap-3 border-t py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.name}</p>
                <p className="mt-0.5 text-xs text-neutral-400">
                  <time dateTime={item.published_at}>
                    {capitalize(whenFormat.format(new Date(item.published_at)))}
                  </time>
                </p>
              </div>
              <span className="text-rosso-acceso shrink-0 text-[0.6875rem] font-semibold">
                {item.type === 'model' ? 'Nuovo modello' : 'Nuova versione'}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-linea border-t pt-3 text-sm text-neutral-400">
          Nessuna pubblicazione in programma.
        </p>
      )}
    </AdminCard>
  )
}

import { isForbidden } from '@/api/errors'
import {
  phrase,
  subjectLabel,
  subjectTypes,
} from '@/components/admin/activity/phrases'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminPagination } from '@/components/admin/ui/AdminPagination'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { Avatar } from '@/components/admin/ui/Avatar'
import { useActivity, useActivityFilters } from '@/hooks/useActivity'
import { useCurrentUser } from '@/hooks/useAuth'
import { useStaff } from '@/hooks/useStaff'
import { isSameDay } from '@/lib/calendar'
import type { ActivityEntry, ActivityFilters } from '@/types/dashboard'

const dayFormat = new Intl.DateTimeFormat('it', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const timeFormat = new Intl.DateTimeFormat('it', {
  hour: '2-digit',
  minute: '2-digit',
})

const logFilters: { value: ActivityFilters['log']; label: string }[] = [
  { value: undefined, label: 'Tutto' },
  { value: 'catalogo', label: 'Catalogo' },
  { value: 'staff', label: 'Staff' },
]

/** Il titolo di un giorno: "Oggi", "Ieri", oppure la data per esteso */
function dayTitle(date: Date) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (isSameDay(date, today)) return 'Oggi'
  if (isSameDay(date, yesterday)) return 'Ieri'

  const text = dayFormat.format(date)
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Le voci raggruppate per giorno, nell'ordine in cui arrivano: dalla più recente */
function byDay(entries: ActivityEntry[]) {
  const groups: { title: string; entries: ActivityEntry[] }[] = []

  for (const entry of entries) {
    const title = dayTitle(new Date(entry.created_at))
    const last = groups.at(-1)

    if (last?.title === title) last.entries.push(entry)
    else groups.push({ title, entries: [entry] })
  }

  return groups
}

/**
 * Il registro delle attività: tutto quello che lo staff ha fatto, con i filtri e le pagine.
 */
export function ActivityPage() {
  const { data: me } = useCurrentUser()
  const { filters, setFilters } = useActivityFilters()
  const { data, isPending, isPlaceholderData, error } = useActivity(filters)
  const { data: staff } = useStaff()

  const hasFilters = Boolean(
    filters.log ||
    filters.causer_id ||
    filters.subject_type ||
    filters.from ||
    filters.to,
  )

  return (
    <>
      <title>Registro attività – Ferrary</title>

      <header>
        <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
          Persone
        </p>
        <h1 className="font-display mt-2.5 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
          Registro attività
        </h1>
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-neutral-400">
          Ogni modifica dello staff, con chi l'ha fatta e quando.
        </p>
      </header>

      {isForbidden(error) ? (
        <p
          role="alert"
          className="border-linea bg-ombra mt-7 rounded-3xl border p-6 text-[0.9375rem] text-neutral-300"
        >
          Il registro è riservato ad Admin e Master.
        </p>
      ) : (
        <>
          <div className="mt-7 flex flex-wrap items-end gap-3">
            <div
              role="group"
              aria-label="Filtra per registro"
              className="flex gap-1.5 self-center"
            >
              {logFilters.map(({ value, label }) => {
                const active = filters.log === value

                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilters({ log: value })}
                    className={[
                      'rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors',
                      active
                        ? 'text-notte border-white bg-white'
                        : 'border-linea text-neutral-300 hover:border-neutral-600 hover:text-white',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            <AdminSelect
              label="Persona"
              value={filters.causer_id ?? ''}
              onChange={(event) =>
                setFilters({
                  causer_id: event.target.value
                    ? Number(event.target.value)
                    : undefined,
                })
              }
              className="min-w-44"
            >
              <option value="">Tutte</option>
              {staff?.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </AdminSelect>

            <AdminSelect
              label="Elemento"
              value={filters.subject_type ?? ''}
              onChange={(event) =>
                setFilters({ subject_type: event.target.value || undefined })
              }
              className="min-w-44"
            >
              <option value="">Tutti</option>
              {Object.entries(subjectTypes).map(([value, { many }]) => (
                <option key={value} value={value}>
                  {many}
                </option>
              ))}
            </AdminSelect>

            <AdminField
              label="Dal"
              type="date"
              value={filters.from ?? ''}
              max={filters.to}
              onChange={(event) =>
                setFilters({ from: event.target.value || undefined })
              }
            />
            <AdminField
              label="Al"
              type="date"
              value={filters.to ?? ''}
              min={filters.from}
              onChange={(event) =>
                setFilters({ to: event.target.value || undefined })
              }
            />

            {hasFilters && (
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    log: undefined,
                    causer_id: undefined,
                    subject_type: undefined,
                    from: undefined,
                    to: undefined,
                  })
                }
                className="mb-4 text-xs font-semibold text-neutral-400 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Azzera filtri
              </button>
            )}
          </div>

          <AdminCard className="mt-5 overflow-hidden">
            {isPending && (
              <div
                aria-busy="true"
                className="m-6 h-64 animate-pulse rounded-2xl bg-white/5"
              />
            )}
            {error && !isForbidden(error) && (
              <p className="p-6 text-sm text-neutral-400">
                Impossibile caricare il registro.
              </p>
            )}

            {data && data.data.length === 0 && (
              <p className="px-6 py-12 text-center text-sm text-neutral-400">
                {hasFilters
                  ? 'Nessuna attività con questi filtri.'
                  : 'Il registro è ancora vuoto.'}
              </p>
            )}

            {data && data.data.length > 0 && (
              <div
                aria-busy={isPlaceholderData}
                className={
                  isPlaceholderData
                    ? 'opacity-50 transition-opacity'
                    : 'transition-opacity'
                }
              >
                {byDay(data.data).map((group) => (
                  <section
                    key={group.title}
                    aria-labelledby={`giorno-${group.title}`}
                  >
                    <h2
                      id={`giorno-${group.title}`}
                      className="border-linea bg-ombra/95 sticky top-0 border-b px-6 py-3 text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase backdrop-blur"
                    >
                      {group.title}
                    </h2>
                    <ul>
                      {group.entries.map((entry) => (
                        <li
                          key={entry.id}
                          className="border-linea flex gap-3.5 border-b px-6 py-4 last:border-b-0"
                        >
                          <Avatar
                            name={entry.causer}
                            highlighted={
                              entry.causer_id !== null &&
                              entry.causer_id === me?.id
                            }
                            className="size-9 text-xs"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-relaxed text-neutral-300">
                              <strong className="font-semibold text-white">
                                {entry.causer ?? 'Sistema'}
                              </strong>{' '}
                              {phrase(entry)}{' '}
                              <strong className="font-semibold text-white">
                                {subjectLabel(entry)}
                              </strong>
                            </p>
                            <p className="mt-0.5 text-xs text-neutral-500">
                              <time dateTime={entry.created_at}>
                                {timeFormat.format(new Date(entry.created_at))}
                              </time>
                              {entry.log === 'staff' && ' · Staff'}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}

                <AdminPagination
                  page={data.meta.current_page}
                  lastPage={data.meta.last_page}
                  onChange={(page) => setFilters({ page })}
                />
              </div>
            )}
          </AdminCard>
        </>
      )}
    </>
  )
}

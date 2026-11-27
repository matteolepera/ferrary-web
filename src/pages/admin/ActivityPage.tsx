import { isForbidden } from '@/api/errors'
import { subjectTypes } from '@/components/admin/activity/phrases'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminPagination } from '@/components/admin/ui/AdminPagination'
import {
  FilterPills,
  type FilterOption,
} from '@/components/admin/ui/FilterPills'
import { FilterDate } from '@/components/admin/ui/FilterDate'
import { FilterSelect } from '@/components/admin/ui/FilterSelect'
import { useActivity, useActivityFilters } from '@/hooks/useActivity'
import { useCurrentUser } from '@/hooks/useAuth'
import { useStaff } from '@/hooks/useStaff'
import { isSameDay } from '@/lib/calendar'
import type { ActivityEntry, ActivityFilters } from '@/types/dashboard'
import { ActivityEntryRow } from '@/components/admin/activity/ActivityEntryRow'

const dayFormat = new Intl.DateTimeFormat('it', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const logFilters: FilterOption<NonNullable<ActivityFilters['log']>>[] = [
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
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <FilterPills
              label="Filtra per registro"
              options={logFilters}
              value={filters.log}
              onChange={(log) => setFilters({ log })}
            />

            <FilterSelect
              label="Persona"
              value={filters.causer_id ?? ''}
              onChange={(event) =>
                setFilters({
                  causer_id: event.target.value
                    ? Number(event.target.value)
                    : undefined,
                })
              }
            >
              <option value="">Tutte le persone</option>
              {staff?.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              label="Elemento"
              value={filters.subject_type ?? ''}
              onChange={(event) =>
                setFilters({ subject_type: event.target.value || undefined })
              }
            >
              <option value="">Tutti gli elementi</option>
              {Object.entries(subjectTypes).map(([value, { many }]) => (
                <option key={value} value={value}>
                  {many}
                </option>
              ))}
            </FilterSelect>

            <FilterDate
              label="Dal"
              value={filters.from ?? ''}
              max={filters.to}
              onChange={(event) =>
                setFilters({ from: event.target.value || undefined })
              }
            />
            <FilterDate
              label="Al"
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
                className="text-xs font-semibold text-neutral-400 underline-offset-4 transition-colors hover:text-white hover:underline"
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
                        <ActivityEntryRow
                          key={entry.id}
                          entry={entry}
                          currentUserId={me?.id}
                        />
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

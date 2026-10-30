import { Link } from 'react-router'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { Icon } from '@/components/admin/ui/Icon'
import { useCurrentUser } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { formatNumber } from '@/lib/format'
import type { DashboardCounts } from '@/types/dashboard'
import { ScheduleCard } from '@/components/admin/dashboard/ScheduleCard'
import { ToCompleteCard } from '@/components/admin/dashboard/ToCompleteCard'
import { ActivityCard } from '@/components/admin/dashboard/ActivityCard'

/** La frase del banner: cosa aspetta lo staff, al singolare o al plurale */
function summary({ drafts, scheduled }: DashboardCounts) {
  const draftsText =
    drafts === 1
      ? '1 bozza è pronta per la revisione'
      : `${drafts} bozze sono pronte per la revisione`
  const scheduledText =
    scheduled === 1
      ? '1 pubblicazione è in programma'
      : `${scheduled} pubblicazioni sono in programma`

  if (drafts > 0 && scheduled > 0) return `${draftsText} e ${scheduledText}.`
  if (drafts > 0) return `${draftsText}.`
  if (scheduled > 0) return `${scheduledText}.`

  return 'Tutto in ordine: nessuna bozza in attesa e nessuna pubblicazione in programma.'
}

/** I quattro numeri, nell'ordine della bozza */
const stats: { key: keyof DashboardCounts; label: string; note: string }[] = [
  { key: 'published', label: 'Pubblicati', note: 'Online sul sito' },
  { key: 'drafts', label: 'Bozze', note: 'Da rivedere' },
  { key: 'scheduled', label: 'Programmati', note: 'In uscita' },
  { key: 'trashed', label: 'Nel cestino', note: 'Ripristinabili' },
]

/**
 * Il pannello dell'area admin: cosa aspetta lo staff, in un colpo d'occhio.
 */
export function DashboardPage() {
  const { data: user } = useCurrentUser()
  const { data, isPending, isError, refetch } = useDashboard()

  const firstName = user?.name.split(' ')[0]

  return (
    <>
      <title>Pannello – Ferrary</title>

      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
            Area staff
          </p>
          <h1 className="font-display mt-2.5 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
            Pannello
          </h1>
        </div>
        <Link to="/admin/modelli/nuovo" className={adminButtonClass('primary')}>
          <Icon path="M12 5v14M5 12h14" size={16} />
          Nuovo modello
        </Link>
      </header>

      {isError ? (
        <div
          role="alert"
          className="border-linea bg-ombra mt-7 flex flex-col items-start gap-4 rounded-3xl border p-6"
        >
          <p className="text-[0.9375rem] text-neutral-300">
            Impossibile caricare il pannello: il server non risponde.
          </p>
          <AdminButton variant="outline" onClick={() => refetch()}>
            Riprova
          </AdminButton>
        </div>
      ) : (
        <div
          aria-busy={isPending}
          className="mt-7 grid grid-cols-6 gap-4 lg:grid-cols-12"
        >
          {isPending ? (
            // Le sagome dei blocchi, mentre arrivano i dati
            <>
              <div className="bg-ombra col-span-6 h-68 animate-pulse rounded-3xl lg:col-span-8" />
              <div className="bg-ombra col-span-6 h-68 animate-pulse rounded-3xl lg:col-span-4" />
              {stats.map((stat) => (
                <div
                  key={stat.key}
                  className="bg-ombra col-span-3 h-36 animate-pulse rounded-3xl lg:col-span-2"
                />
              ))}
            </>
          ) : (
            <>
              <AdminCard
                aria-labelledby="pannello-benvenuto"
                className={[
                  'relative col-span-6 min-h-68 overflow-hidden px-8 py-7 lg:col-span-8',
                  'bg-[radial-gradient(ellipse_60%_90%_at_80%_60%,rgb(212_0_0/0.38),transparent_70%)]',
                ].join(' ')}
              >
                <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
                  Bentornato, {firstName}
                </p>
                <h2
                  id="pannello-benvenuto"
                  className="font-display mt-3 max-w-[14ch] text-4xl leading-[1.05] font-extrabold tracking-[-0.035em]"
                >
                  Il catalogo ti aspetta.
                </h2>
                <p className="relative z-10 mt-3.5 max-w-[40ch] text-[0.9375rem] leading-relaxed text-neutral-300">
                  {summary(data.counts)}
                </p>
                <div className="relative z-10 mt-6 flex flex-wrap gap-2.5">
                  <Link
                    to="/admin/modelli?status=draft"
                    className={adminButtonClass('light')}
                  >
                    Rivedi le bozze
                  </Link>
                  <Link
                    to="/admin/modelli?status=scheduled"
                    className={adminButtonClass('outline')}
                  >
                    Programmate
                  </Link>
                </div>
                <img
                  src="/images/home/sf90-stradale-1200.webp"
                  alt=""
                  className="pointer-events-none absolute -right-10 -bottom-1.5 w-[52%] drop-shadow-[0_24px_30px_rgb(0_0_0/0.6)]"
                />
              </AdminCard>

              <ScheduleCard
                items={data.scheduled}
                delay={80}
                className="col-span-6 lg:col-span-4"
              />

              {stats.map((stat, index) => (
                <AdminCard
                  key={stat.key}
                  aria-labelledby={`pannello-${stat.key}`}
                  delay={160 + index * 40}
                  className="col-span-3 p-5.5 lg:col-span-2"
                >
                  <h2
                    id={`pannello-${stat.key}`}
                    className="text-[0.6875rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase"
                  >
                    {stat.label}
                  </h2>
                  <p className="font-display mt-3.5 text-[2.875rem] leading-none font-extrabold tracking-[-0.035em] tabular-nums">
                    {formatNumber(data.counts[stat.key], 'it', 0)}
                  </p>
                  <p className="mt-2.5 text-xs text-neutral-400">{stat.note}</p>
                </AdminCard>
              ))}

              <ToCompleteCard
                items={data.to_complete}
                delay={320}
                className="col-span-6 lg:col-span-8"
              />
              <ActivityCard
                items={data.activity}
                showTabs={user?.role !== 'moderator'}
                currentUserName={user?.name}
                delay={360}
                className="col-span-6 lg:col-span-4"
              />
            </>
          )}
        </div>
      )}
    </>
  )
}

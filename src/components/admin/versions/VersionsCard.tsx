import { Link } from 'react-router'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { Icon } from '@/components/admin/ui/Icon'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import {
  bodyTypes,
  labelOf,
  vehicleTypes,
  yearsOf,
} from '@/components/admin/versions/options'
import { useModelVersions } from '@/hooks/useAdminVersion'
import type { AdminCarModel } from '@/types/admin'

type VersionsCardProps = {
  model: AdminCarModel
  delay?: number
  className?: string
}

/**
 * Le versioni del modello, con il loro stato. Dice anche quando il modello,
 * pur pubblicato, non compare sul sito perché nessuna versione lo è.
 */
export function VersionsCard({
  model,
  delay,
  className = '',
}: VersionsCardProps) {
  const { data: versions, isPending, isError } = useModelVersions(model.id)

  const hasPublished =
    versions?.some((version) => version.status === 'published') ?? false

  return (
    <AdminCard
      aria-labelledby="modello-versioni"
      delay={delay}
      className={`p-6 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            id="modello-versioni"
            className="font-display text-xl font-extrabold tracking-[-0.03em]"
          >
            Versioni
          </h2>
          <p className="mt-1 text-[0.8125rem] text-neutral-400">
            Ogni versione ha la sua scheda tecnica, le sue foto e il suo stato.
          </p>
        </div>
        <Link
          to={`/admin/modelli/${model.id}/versioni/nuova`}
          className={adminButtonClass('outline')}
        >
          <Icon path="M12 5v14M5 12h14" size={16} />
          Nuova versione
        </Link>
      </div>

      {/* Il caso delle schede invisibili: il modello è online, ma il sito non ha niente da mostrare */}
      {versions && model.status === 'published' && !hasPublished && (
        <p className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-[0.8125rem] leading-relaxed text-amber-200">
          Il modello è pubblicato, ma non compare sul sito: serve almeno una
          versione pubblicata.
        </p>
      )}

      {isPending && (
        <div
          aria-busy="true"
          className="mt-5 h-24 animate-pulse rounded-2xl bg-white/5"
        />
      )}

      {isError && (
        <p className="mt-5 text-sm text-neutral-400">
          Impossibile caricare le versioni.
        </p>
      )}

      {versions && versions.length === 0 && (
        <p className="border-linea mt-5 rounded-[1.125rem] border border-dashed px-5 py-8 text-center text-sm leading-relaxed text-neutral-400">
          Nessuna versione: il modello comparirà sul sito quando ne avrà almeno
          una pubblicata.
        </p>
      )}

      {versions && versions.length > 0 && (
        <ul className="mt-5">
          {versions.map((version) => (
            <li
              key={version.id}
              className="border-linea flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t py-4 first:border-t-0"
            >
              <div className="min-w-0">
                <Link
                  to={`/admin/modelli/${model.id}/versioni/${version.id}`}
                  className="font-display hover:text-rosso-acceso text-[1.0625rem] font-bold tracking-[-0.01em]"
                >
                  {version.name}
                </Link>
                <p className="mt-1 text-xs text-neutral-400">
                  {yearsOf(version)} ·{' '}
                  {labelOf(vehicleTypes, version.vehicle_type)}
                  {version.body_type &&
                    ` · ${labelOf(bodyTypes, version.body_type)}`}
                </p>
              </div>
              <StatusBadge
                status={version.status}
                publishedAt={version.published_at}
              />
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  )
}

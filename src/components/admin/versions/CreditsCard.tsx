import { useState } from 'react'
import { PlusIcon, XIcon } from '@phosphor-icons/react'
import { designerRoles } from '@/components/admin/designers/options'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { sectionButtonClass } from '@/components/admin/ui/adminButtonClass'
import { CreditModal } from '@/components/admin/versions/CreditModal'
import {
  designerCredits,
  driverCredits,
} from '@/components/admin/versions/credits'
import { labelOf } from '@/components/admin/versions/options'
import { useVersionCredits } from '@/hooks/useAdminVersion'
import type { AdminVersion } from '@/types/admin'

const subtitle =
  'mb-3 text-[0.6875rem] font-semibold tracking-[0.2em] text-rosso-acceso uppercase'
// L'etichetta di una persona: il nome, e la ✕ per toglierla subito
const chip =
  'border-linea bg-notte flex items-center gap-1.5 rounded-full border py-1.5 pr-1.5 pl-4 text-sm'
const removeButton =
  'flex size-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40'

type CreditsCardProps = {
  version: AdminVersion
  delay?: number
  className?: string
}

/**
 * Chi ha disegnato la versione, con il ruolo, e chi l'ha guidata, come etichette.
 * Togliere qualcuno è un clic sulla ✕; aggiungerlo apre una finestra. Si salva subito.
 */
export function CreditsCard({
  version,
  delay,
  className = '',
}: CreditsCardProps) {
  const { designers, drivers } = useVersionCredits(version.id)
  // La finestra aperta: per aggiungere un designer, un pilota, o nessuna
  const [adding, setAdding] = useState<'designer' | 'driver' | null>(null)

  const linkedDesigners = designerCredits(version)
  const linkedDrivers = driverCredits(version)

  return (
    <AdminCard
      aria-labelledby="versione-crediti"
      delay={delay}
      className={`p-6 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2
          id="versione-crediti"
          className="font-display text-xl font-extrabold tracking-[-0.03em]"
        >
          Designer e piloti
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Aggiungi un designer"
            onClick={() => setAdding('designer')}
            className={sectionButtonClass}
          >
            <PlusIcon aria-hidden="true" size={14} />
            Designer
          </button>
          <button
            type="button"
            aria-label="Aggiungi un pilota"
            onClick={() => setAdding('driver')}
            className={sectionButtonClass}
          >
            <PlusIcon aria-hidden="true" size={14} />
            Pilota
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <section aria-labelledby="crediti-designer">
          <h3 id="crediti-designer" className={subtitle}>
            Designer
          </h3>
          {linkedDesigners.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {linkedDesigners.map((credit) => {
                const roleLabel = labelOf(designerRoles, credit.role)

                return (
                  <li key={`${credit.id}-${credit.role}`} className={chip}>
                    <span>
                      <span className="font-semibold">{credit.name}</span>
                      <span className="text-neutral-400"> · {roleLabel}</span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Togli ${credit.name}, ${roleLabel}`}
                      disabled={designers.isPending}
                      onClick={() =>
                        designers.mutate(
                          linkedDesigners
                            .filter(
                              (item) =>
                                !(
                                  item.id === credit.id &&
                                  item.role === credit.role
                                ),
                            )
                            .map(({ id, role }) => ({ id, role })),
                        )
                      }
                      className={removeButton}
                    >
                      <XIcon aria-hidden="true" size={13} />
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400">
              Nessun designer collegato.
            </p>
          )}
        </section>

        <section aria-labelledby="crediti-piloti">
          <h3 id="crediti-piloti" className={subtitle}>
            Piloti
          </h3>
          {linkedDrivers.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {linkedDrivers.map((credit) => (
                <li key={credit.id} className={`${chip} font-semibold`}>
                  {credit.name}
                  <button
                    type="button"
                    aria-label={`Togli ${credit.name}`}
                    disabled={drivers.isPending}
                    onClick={() =>
                      drivers.mutate(
                        linkedDrivers
                          .filter((item) => item.id !== credit.id)
                          .map((item) => item.id),
                      )
                    }
                    className={removeButton}
                  >
                    <XIcon aria-hidden="true" size={13} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400">Nessun pilota collegato.</p>
          )}
        </section>
      </div>

      {(designers.isError || drivers.isError) && (
        <p role="alert" className="text-errore mt-5 text-[0.8125rem]">
          Impossibile salvare i collegamenti in questo momento. Riprova.
        </p>
      )}

      {/* Con il tipo come chiave: passando da designer a pilota, la finestra riparte pulita */}
      {adding && (
        <CreditModal
          key={adding}
          version={version}
          kind={adding}
          onClose={() => setAdding(null)}
        />
      )}
    </AdminCard>
  )
}

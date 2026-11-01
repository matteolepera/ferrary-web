import { useState } from 'react'
import { designerRoles } from '@/components/admin/designers/options'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { Icon } from '@/components/admin/ui/Icon'
import {
  designerCredits,
  driverCredits,
} from '@/components/admin/versions/credits'
import { labelOf } from '@/components/admin/versions/options'
import { useAdminDesigners } from '@/hooks/useAdminDesigners'
import { useAdminDrivers } from '@/hooks/useAdminDrivers'
import { useVersionCredits } from '@/hooks/useAdminVersion'
import type { AdminVersion, DesignerRole } from '@/types/admin'

const subtitle =
  'mb-3 text-[0.6875rem] font-semibold tracking-[0.2em] text-rosso-acceso uppercase'
const removeButton =
  'flex size-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40'

type CreditsCardProps = {
  version: AdminVersion
  delay?: number
  className?: string
}

/**
 * Chi ha disegnato la versione, con il ruolo, e chi l'ha guidata.
 * Si salvano subito, a ogni aggiunta o rimozione: hanno endpoint propri, separati dal form.
 */
export function CreditsCard({
  version,
  delay,
  className = '',
}: CreditsCardProps) {
  const { data: allDesigners } = useAdminDesigners()
  const { data: allDrivers } = useAdminDrivers()
  const { designers, drivers } = useVersionCredits(version.id)

  const linkedDesigners = designerCredits(version)
  const linkedDrivers = driverCredits(version)

  // La riga per aggiungere: cosa è scelto nei menu
  const [designerId, setDesignerId] = useState('')
  const [role, setRole] = useState<DesignerRole>('design')
  const [driverId, setDriverId] = useState('')

  // Lo stesso designer con lo stesso ruolo conta una volta sola
  const duplicate = linkedDesigners.some(
    (credit) => credit.id === Number(designerId) && credit.role === role,
  )
  const availableDrivers = (allDrivers ?? []).filter(
    (driver) => !linkedDrivers.some((credit) => credit.id === driver.id),
  )

  const toPayload = (credits: { id: number; role: DesignerRole }[]) =>
    credits.map(({ id, role }) => ({ id, role }))

  return (
    <AdminCard
      aria-labelledby="versione-crediti"
      delay={delay}
      className={`p-6 ${className}`}
    >
      <h2
        id="versione-crediti"
        className="font-display text-xl font-extrabold tracking-[-0.03em]"
      >
        Designer e piloti
      </h2>
      <p className="mt-1 text-[0.8125rem] text-neutral-400">
        Si salvano subito, a ogni aggiunta o rimozione: non serve “Salva
        modifiche”.
      </p>

      <div className="mt-6 grid gap-8 xl:grid-cols-2">
        <section aria-labelledby="crediti-designer">
          <h3 id="crediti-designer" className={subtitle}>
            Designer
          </h3>

          {linkedDesigners.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {linkedDesigners.map((credit) => (
                <li
                  key={`${credit.id}-${credit.role}`}
                  className="border-linea bg-notte flex items-center justify-between gap-3 rounded-2xl border px-4 py-2.5"
                >
                  <span className="text-sm">
                    <span className="font-semibold">{credit.name}</span>
                    <span className="text-neutral-400">
                      {' '}
                      · {labelOf(designerRoles, credit.role)}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-label={`Togli ${credit.name}, ${labelOf(designerRoles, credit.role)}`}
                    disabled={designers.isPending}
                    onClick={() =>
                      designers.mutate(
                        toPayload(
                          linkedDesigners.filter(
                            (item) =>
                              !(
                                item.id === credit.id &&
                                item.role === credit.role
                              ),
                          ),
                        ),
                      )
                    }
                    className={removeButton}
                  >
                    <Icon path="M6 6l12 12M18 6L6 18" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400">
              Nessun designer collegato.
            </p>
          )}

          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
            <AdminSelect
              label="Designer"
              value={designerId}
              onChange={(event) => setDesignerId(event.target.value)}
            >
              <option value="">Scegli un designer</option>
              {allDesigners?.map((designer) => (
                <option key={designer.id} value={designer.id}>
                  {designer.name}
                </option>
              ))}
            </AdminSelect>
            <AdminSelect
              label="Ruolo"
              value={role}
              onChange={(event) => setRole(event.target.value as DesignerRole)}
            >
              {designerRoles.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdminSelect>
            <AdminButton
              variant="outline"
              disabled={!designerId || duplicate || designers.isPending}
              onClick={() =>
                designers.mutate(
                  toPayload([
                    ...linkedDesigners,
                    { id: Number(designerId), name: '', role },
                  ]),
                  {
                    onSuccess: () => setDesignerId(''),
                  },
                )
              }
              className="h-13"
            >
              Aggiungi
            </AdminButton>
          </div>
          {duplicate && (
            <p className="mt-2 text-[0.8125rem] text-neutral-400">
              Questo designer ha già questo ruolo.
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
                <li
                  key={credit.id}
                  className="border-linea bg-notte flex items-center gap-1.5 rounded-full border py-1.5 pr-1.5 pl-4 text-sm font-semibold"
                >
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
                    <Icon path="M6 6l12 12M18 6L6 18" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400">Nessun pilota collegato.</p>
          )}

          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <AdminSelect
              label="Pilota"
              value={driverId}
              onChange={(event) => setDriverId(event.target.value)}
            >
              <option value="">Scegli un pilota</option>
              {availableDrivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.first_name} {driver.last_name}
                </option>
              ))}
            </AdminSelect>
            <AdminButton
              variant="outline"
              disabled={!driverId || drivers.isPending}
              onClick={() =>
                drivers.mutate(
                  [...linkedDrivers.map((item) => item.id), Number(driverId)],
                  {
                    onSuccess: () => setDriverId(''),
                  },
                )
              }
              className="h-13"
            >
              Aggiungi
            </AdminButton>
          </div>
        </section>
      </div>

      {(designers.isError || drivers.isError) && (
        <p role="alert" className="text-errore mt-5 text-[0.8125rem]">
          Impossibile salvare i collegamenti in questo momento. Riprova.
        </p>
      )}
    </AdminCard>
  )
}

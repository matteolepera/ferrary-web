import { useState, type FormEvent } from 'react'
import { designerRoles } from '@/components/admin/designers/options'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import {
  designerCredits,
  driverCredits,
} from '@/components/admin/versions/credits'
import { useAdminDesigners } from '@/hooks/useAdminDesigners'
import { useAdminDrivers } from '@/hooks/useAdminDrivers'
import { useVersionCredits } from '@/hooks/useAdminVersion'
import type { AdminVersion, DesignerRole } from '@/types/admin'

type CreditModalProps = {
  version: AdminVersion
  /** Chi si aggiunge: un designer, con il suo ruolo, o un pilota */
  kind: 'designer' | 'driver'
  onClose: () => void
}

/**
 * La finestra per collegare una persona alla versione: un designer con il suo ruolo,
 * o un pilota. Si manda l'elenco completo, come vuole il backend: quelli già collegati più il nuovo.
 */
export function CreditModal({ version, kind, onClose }: CreditModalProps) {
  const { data: allDesigners } = useAdminDesigners()
  const { data: allDrivers } = useAdminDrivers()
  const { designers, drivers } = useVersionCredits(version.id)

  const linkedDesigners = designerCredits(version)
  const linkedDrivers = driverCredits(version)

  const [designerId, setDesignerId] = useState('')
  const [role, setRole] = useState<DesignerRole>('design')
  const [driverId, setDriverId] = useState('')

  // Lo stesso designer con lo stesso ruolo conta una volta sola
  const duplicate = linkedDesigners.some(
    (credit) => credit.id === Number(designerId) && credit.role === role,
  )
  // Nel menu dei piloti, solo quelli non ancora collegati
  const availableDrivers = (allDrivers ?? []).filter(
    (driver) => !linkedDrivers.some((credit) => credit.id === driver.id),
  )

  const isDesigner = kind === 'designer'
  const mutation = isDesigner ? designers : drivers
  const chosen = isDesigner ? designerId : driverId

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!chosen || (isDesigner && duplicate)) return

    if (isDesigner) {
      designers.mutate(
        [
          ...linkedDesigners.map(({ id, role }) => ({ id, role })),
          { id: Number(designerId), role },
        ],
        { onSuccess: onClose },
      )
    } else {
      drivers.mutate(
        [...linkedDrivers.map((item) => item.id), Number(driverId)],
        { onSuccess: onClose },
      )
    }
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title={isDesigner ? 'Aggiungi un designer' : 'Aggiungi un pilota'}
      description={version.name}
      dirty={chosen !== ''}
      onSubmit={handleSubmit}
      submitLabel={isDesigner ? 'Aggiungi il designer' : 'Aggiungi il pilota'}
      submitDisabled={!chosen || (isDesigner && duplicate)}
      pending={mutation.isPending}
    >
      {mutation.isError && (
        <p
          role="alert"
          className="border-errore/40 bg-errore/10 text-errore mb-5 rounded-2xl border px-4 py-3 text-[0.8125rem]"
        >
          Impossibile salvare il collegamento in questo momento. Riprova.
        </p>
      )}

      {isDesigner ? (
        <div className="grid gap-5 sm:grid-cols-[1fr_12rem]">
          <AdminSelect
            label="Designer"
            required
            value={designerId}
            onChange={(event) => setDesignerId(event.target.value)}
            error={
              duplicate ? 'Questo designer ha già questo ruolo.' : undefined
            }
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
        </div>
      ) : (
        <AdminSelect
          label="Pilota"
          required
          value={driverId}
          onChange={(event) => setDriverId(event.target.value)}
          hint="Ci sono solo i piloti non ancora collegati a questa versione."
        >
          <option value="">Scegli un pilota</option>
          {availableDrivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.first_name} {driver.last_name}
            </option>
          ))}
        </AdminSelect>
      )}
    </AdminModal>
  )
}

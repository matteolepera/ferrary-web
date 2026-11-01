import { useState } from 'react'
import { backendMessage } from '@/api/errors'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminSelect } from '@/components/admin/ui/AdminSelect'
import { useStaffActions } from '@/hooks/useStaff'
import type { User } from '@/types/auth'

type TransferMasterCardProps = {
  me: User
  staff: User[]
  onMessage: (message: string) => void
  className?: string
}

/**
 * Il passaggio del ruolo di Master: chi lo fa diventa Admin, e non può tornare indietro da solo.
 * Per confermare si scrive il nome della persona scelta.
 */
export function TransferMasterCard({
  me,
  staff,
  onMessage,
  className = '',
}: TransferMasterCardProps) {
  const { transfer } = useStaffActions()
  const [targetId, setTargetId] = useState('')
  const [confirmation, setConfirmation] = useState('')

  const candidates = staff.filter((person) => person.id !== me.id)
  const target = candidates.find((person) => person.id === Number(targetId))
  // Il nome esatto, senza badare agli spazi all'inizio e alla fine
  const confirmed = target !== undefined && confirmation.trim() === target.name

  return (
    <AdminCard
      aria-labelledby="staff-master"
      delay={120}
      className={`border-rosso/40 p-6 ${className}`}
    >
      <h2
        id="staff-master"
        className="font-display text-xl font-extrabold tracking-[-0.03em]"
      >
        Passaggio del ruolo di Master
      </h2>
      <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-neutral-400">
        Il Master è uno solo. Passando il ruolo diventerai Admin, e potrai
        riaverlo solo dal nuovo Master.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <AdminSelect
          label="Nuovo Master"
          value={targetId}
          onChange={(event) => {
            setTargetId(event.target.value)
            setConfirmation('')
          }}
        >
          <option value="">Scegli una persona</option>
          {candidates.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </AdminSelect>

        {target && (
          <AdminField
            label="Per confermare, scrivi il suo nome"
            value={confirmation}
            autoComplete="off"
            placeholder={target.name}
            onChange={(event) => setConfirmation(event.target.value)}
            hint={`Diventerai Admin, e ${target.name} sarà il nuovo Master.`}
          />
        )}
      </div>

      {transfer.isError && (
        <p role="alert" className="text-errore mt-4 text-[0.8125rem]">
          {backendMessage(transfer.error) ??
            'Impossibile passare il ruolo in questo momento. Riprova.'}
        </p>
      )}

      <AdminButton
        disabled={!confirmed || transfer.isPending}
        onClick={() =>
          target &&
          transfer.mutate(target.id, {
            onSuccess: () =>
              onMessage(
                `Il nuovo Master è ${target.name}. Ora il tuo ruolo è Admin.`,
              ),
          })
        }
        className="mt-5"
      >
        {transfer.isPending
          ? 'Passaggio in corso…'
          : 'Passa il ruolo di Master'}
      </AdminButton>
    </AdminCard>
  )
}

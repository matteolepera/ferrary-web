import { useState } from 'react'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminField } from '@/components/admin/ui/AdminField'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import type { PublicationChange } from '@/hooks/useAdminModel'
import type { PublicationStatus } from '@/types/admin'

const longDate = new Intl.DateTimeFormat('it', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const longDateTime = new Intl.DateTimeFormat('it', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
})

/** Una data nel formato del campo datetime-local, nel fuso di chi guarda: "2026-11-04T09:00" */
function toLocalInput(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

/** Cosa vuol dire lo stato, in una frase */
function describe(status: PublicationStatus, publishedAt: string | null) {
  if (status === 'published' && publishedAt)
    return `Online dal ${longDate.format(new Date(publishedAt))}.`
  if (status === 'scheduled' && publishedAt)
    return `Uscirà il ${longDateTime.format(new Date(publishedAt))}.`
  return 'Non è visibile sul sito.'
}

type PublicationCardProps = {
  status: PublicationStatus
  publishedAt: string | null
  /** Il soggetto delle frasi: "Il modello" o "La versione" */
  subject: string
  canPublish: boolean
  hasUnsavedChanges: boolean
  isPending: boolean
  isError: boolean
  /** Esegue il cambiamento, e chiama done quando è andato a buon fine */
  onChange: (change: PublicationChange, done: () => void) => void
  delay?: number
  className?: string
}

/**
 * Lo stato di pubblicazione, con le azioni possibili da quello stato.
 * Solo disegno: chi lo usa decide cosa pubblicare, un modello o una versione.
 */
export function PublicationCard({
  status,
  publishedAt,
  subject,
  canPublish,
  hasUnsavedChanges,
  isPending,
  isError,
  onChange,
  delay,
  className = '',
}: PublicationCardProps) {
  // Il passaggio aperto: niente, la scelta della data, o la conferma del ritiro
  const [step, setStep] = useState<'idle' | 'schedule' | 'confirm'>('idle')
  const [date, setDate] = useState(() =>
    toLocalInput(new Date(Date.now() + 24 * 3600_000)),
  )

  function run(change: PublicationChange) {
    onChange(change, () => setStep('idle'))
  }

  return (
    <AdminCard
      aria-labelledby="pubblicazione-titolo"
      delay={delay}
      className={`p-6 ${className}`}
    >
      <h2
        id="pubblicazione-titolo"
        className="font-display text-xl font-extrabold tracking-[-0.03em]"
      >
        Pubblicazione
      </h2>

      <div className="mt-4">
        <StatusBadge status={status} publishedAt={publishedAt} />
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-neutral-400">
        {describe(status, publishedAt)}
      </p>

      {!canPublish ? (
        <p className="border-linea mt-5 border-t pt-4 text-[0.8125rem] leading-relaxed text-neutral-400">
          Pubblicare e programmare spetta ad Admin e Master.
        </p>
      ) : (
        <div className="border-linea mt-5 border-t pt-5">
          {hasUnsavedChanges && (
            <p className="mb-4 text-[0.8125rem] leading-relaxed text-amber-300">
              Ci sono modifiche non salvate: la pubblicazione riguarda l'ultima
              versione salvata.
            </p>
          )}

          {step === 'idle' && (
            <div className="flex flex-wrap gap-2.5">
              {status !== 'published' && (
                <AdminButton
                  disabled={isPending}
                  onClick={() => run({ action: 'publish' })}
                >
                  Pubblica ora
                </AdminButton>
              )}
              {status !== 'published' && (
                <AdminButton
                  variant="outline"
                  onClick={() => setStep('schedule')}
                >
                  {status === 'scheduled' ? 'Cambia data' : 'Programma'}
                </AdminButton>
              )}
              {status !== 'draft' && (
                <AdminButton
                  variant="outline"
                  disabled={isPending}
                  // Un record online sparisce dal sito: prima si chiede conferma
                  onClick={() =>
                    status === 'published'
                      ? setStep('confirm')
                      : run({ action: 'unpublish' })
                  }
                >
                  Riporta in bozza
                </AdminButton>
              )}
            </div>
          )}

          {step === 'schedule' && (
            <div className="flex flex-col gap-4">
              <AdminField
                label="Data di pubblicazione"
                type="datetime-local"
                value={date}
                min={toLocalInput(new Date())}
                onChange={(event) => setDate(event.target.value)}
              />
              <div className="flex flex-wrap gap-2.5">
                <AdminButton
                  disabled={!date || isPending}
                  // Il campo è nel fuso di chi guarda: toISOString lo converte per il server
                  onClick={() =>
                    run({
                      action: 'schedule',
                      publishedAt: new Date(date).toISOString(),
                    })
                  }
                >
                  Conferma la data
                </AdminButton>
                <AdminButton variant="outline" onClick={() => setStep('idle')}>
                  Annulla
                </AdminButton>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div
              role="alertdialog"
              aria-labelledby="ritiro-domanda"
              className="flex flex-col gap-4"
            >
              <p
                id="ritiro-domanda"
                className="text-sm leading-relaxed text-neutral-200"
              >
                {subject} sparirà dal sito. Confermi?
              </p>
              <div className="flex flex-wrap gap-2.5">
                <AdminButton
                  disabled={isPending}
                  onClick={() => run({ action: 'unpublish' })}
                >
                  Sì, riporta in bozza
                </AdminButton>
                <AdminButton variant="outline" onClick={() => setStep('idle')}>
                  Annulla
                </AdminButton>
              </div>
            </div>
          )}

          {isError && (
            <p role="alert" className="text-errore mt-4 text-[0.8125rem]">
              Impossibile cambiare la pubblicazione in questo momento. Riprova.
            </p>
          )}
        </div>
      )}
    </AdminCard>
  )
}

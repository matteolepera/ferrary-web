import { useState } from 'react'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminField } from '@/components/admin/ui/AdminField'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import {
  useModelPublication,
  type PublicationChange,
} from '@/hooks/useAdminModel'
import type { AdminCarModel } from '@/types/admin'

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
function describe(model: AdminCarModel) {
  if (model.status === 'published' && model.published_at) {
    return `Online dal ${longDate.format(new Date(model.published_at))}.`
  }
  if (model.status === 'scheduled' && model.published_at) {
    return `Uscirà il ${longDateTime.format(new Date(model.published_at))}.`
  }
  return 'Non è visibile sul sito.'
}

type PublicationCardProps = {
  model: AdminCarModel
  canPublish: boolean
  /** Il form ha modifiche non ancora salvate */
  hasUnsavedChanges: boolean
  delay?: number
  className?: string
}

/**
 * Lo stato di pubblicazione del modello, con le azioni possibili da quello stato.
 */
export function PublicationCard({
  model,
  canPublish,
  hasUnsavedChanges,
  delay,
  className = '',
}: PublicationCardProps) {
  const publication = useModelPublication(model.id)
  // Il passaggio aperto: niente, la scelta della data, o la conferma del ritiro
  const [step, setStep] = useState<'idle' | 'schedule' | 'confirm'>('idle')
  const [date, setDate] = useState(() =>
    toLocalInput(new Date(Date.now() + 24 * 3600_000)),
  )

  function run(change: PublicationChange) {
    publication.mutate(change, { onSuccess: () => setStep('idle') })
  }

  return (
    <AdminCard
      aria-labelledby="modello-pubblicazione"
      delay={delay}
      className={`p-6 ${className}`}
    >
      <h2
        id="modello-pubblicazione"
        className="font-display text-xl font-extrabold tracking-[-0.03em]"
      >
        Pubblicazione
      </h2>

      <div className="mt-4">
        <StatusBadge status={model.status} publishedAt={model.published_at} />
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-neutral-400">
        {describe(model)}
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
              {model.status !== 'published' && (
                <AdminButton
                  disabled={publication.isPending}
                  onClick={() => run({ action: 'publish' })}
                >
                  Pubblica ora
                </AdminButton>
              )}
              {model.status !== 'published' && (
                <AdminButton
                  variant="outline"
                  onClick={() => setStep('schedule')}
                >
                  {model.status === 'scheduled' ? 'Cambia data' : 'Programma'}
                </AdminButton>
              )}
              {model.status !== 'draft' && (
                <AdminButton
                  variant="outline"
                  disabled={publication.isPending}
                  // Un modello online sparisce dal sito: prima si chiede conferma
                  onClick={() =>
                    model.status === 'published'
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
                  disabled={!date || publication.isPending}
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
                Il modello sparirà dal sito. Confermi?
              </p>
              <div className="flex flex-wrap gap-2.5">
                <AdminButton
                  disabled={publication.isPending}
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

          {publication.isError && (
            <p role="alert" className="text-errore mt-4 text-[0.8125rem]">
              Impossibile cambiare la pubblicazione in questo momento. Riprova.
            </p>
          )}
        </div>
      )}
    </AdminCard>
  )
}

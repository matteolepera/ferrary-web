import { useState } from 'react'
import { backendMessage } from '@/api/errors'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'

type TrashCardProps = {
  /** Cosa succede spostandolo, in una frase */
  description: string
  /** La domanda della conferma */
  question: string
  isPending: boolean
  error: unknown
  onConfirm: () => void
  delay?: number
  className?: string
}

/**
 * Lo spostamento nel cestino, con la conferma. Non è un'eliminazione: dal cestino si ripristina.
 */
export function TrashCard({
  description,
  question,
  isPending,
  error,
  onConfirm,
  delay,
  className = '',
}: TrashCardProps) {
  const [confirming, setConfirming] = useState(false)

  return (
    <AdminCard
      aria-labelledby="sposta-cestino"
      delay={delay}
      className={`border-rosso/40 p-6 ${className}`}
    >
      <h2
        id="sposta-cestino"
        className="font-display text-xl font-extrabold tracking-[-0.03em]"
      >
        Cestino
      </h2>
      <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-neutral-400">
        {description}
      </p>

      {confirming ? (
        <div
          role="alertdialog"
          aria-labelledby="sposta-domanda"
          className="mt-5 flex flex-wrap items-center gap-3"
        >
          <p id="sposta-domanda" className="text-sm text-neutral-200">
            {question}
          </p>
          <AdminButton disabled={isPending} onClick={onConfirm}>
            {isPending ? 'Spostamento…' : 'Sì, sposta nel cestino'}
          </AdminButton>
          <AdminButton variant="outline" onClick={() => setConfirming(false)}>
            Annulla
          </AdminButton>
        </div>
      ) : (
        <AdminButton
          variant="outline"
          onClick={() => setConfirming(true)}
          className="mt-5"
        >
          Sposta nel cestino
        </AdminButton>
      )}

      {error !== null && error !== undefined && (
        <p role="alert" className="text-errore mt-4 text-[0.8125rem]">
          {backendMessage(error) ??
            'Impossibile spostare nel cestino in questo momento. Riprova.'}
        </p>
      )}
    </AdminCard>
  )
}

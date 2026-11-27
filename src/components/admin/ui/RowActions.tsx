import { useState } from 'react'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { Icon } from '@/components/admin/ui/Icon'

const iconButton =
  'flex size-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white'

type RowActionsProps = {
  /** Il nome della riga, per il lettore di schermo: "Modifica Pininfarina" */
  name: string
  onEdit: () => void
  /** Chiamata con la conferma; done chiude la conferma quando l'eliminazione è riuscita */
  onDelete: (done: () => void) => void
  /** Chiamata quando si apre la conferma: ad esempio per togliere l'errore di prima */
  onStartDelete?: () => void
  isPending: boolean
}

/**
 * Le azioni di una riga degli elenchi: matita per modificare, cestino per eliminare.
 * Il cestino chiede conferma nella riga stessa, senza aprire una finestra.
 */
export function RowActions({
  name,
  onEdit,
  onDelete,
  onStartDelete,
  isPending,
}: RowActionsProps) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div
        role="alertdialog"
        aria-label={`Eliminare ${name}?`}
        className="flex items-center justify-end gap-2"
      >
        {/* Il rosso pieno: l'eliminazione è definitiva */}
        <AdminButton
          variant="danger"
          disabled={isPending}
          onClick={() => onDelete(() => setConfirming(false))}
          className="h-8 px-3 text-xs"
        >
          Elimina
        </AdminButton>
        <AdminButton
          variant="outline"
          onClick={() => setConfirming(false)}
          className="h-8 px-3 text-xs"
        >
          Annulla
        </AdminButton>
      </div>
    )
  }

  return (
    <div className="flex justify-end gap-1">
      <button
        type="button"
        aria-label={`Modifica ${name}`}
        onClick={onEdit}
        className={iconButton}
      >
        <Icon path="M4 20l4-1 11-11-3-3L5 16z" size={15} />
      </button>
      <button
        type="button"
        aria-label={`Elimina ${name}`}
        onClick={() => {
          onStartDelete?.()
          setConfirming(true)
        }}
        className={`${iconButton} hover:bg-rosso`}
      >
        <Icon path="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" size={15} />
      </button>
    </div>
  )
}

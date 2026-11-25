import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { XIcon } from '@phosphor-icons/react'
import { AdminButton } from './AdminButton'

type AdminModalProps = {
  open: boolean
  /** Chiamata quando la finestra va chiusa: chi la usa mette open a false */
  onClose: () => void
  title: string
  description?: string
  /** Ci sono modifiche non salvate: chiudere chiede prima conferma */
  dirty?: boolean
  /** md per pochi campi, lg per le sezioni lunghe come la scheda tecnica */
  size?: 'md' | 'lg'
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  /** Il testo del pulsante per salvare: "Crea famiglia", "Salva la scheda tecnica" */
  submitLabel: string
  /** Il salvataggio è in corso: il pulsante si spegne e lo dice */
  pending?: boolean
  children: ReactNode
}

/**
 * La finestra dell'admin, su <dialog>: con showModal il browser tiene il focus dentro,
 * blocca la pagina sotto e chiude con Esc. Ha il suo modulo, con "Annulla" e il pulsante
 * per salvare in fondo. Con modifiche non salvate, chiudere chiede conferma.
 */
export function AdminModal({
  open,
  onClose,
  title,
  description,
  dirty = false,
  size = 'md',
  onSubmit,
  submitLabel,
  pending = false,
  children,
}: AdminModalProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  // La domanda "chiudere senza salvare?", al posto dei pulsanti in fondo
  const [confirmingClose, setConfirmingClose] = useState(false)

  // Apre e chiude il <dialog> vero quando cambia "open"
  useEffect(() => {
    const element = dialog.current
    if (!element) return

    if (open && !element.open) {
      element.showModal()
      // Il cursore sul primo campo, non sulla ✕ che viene prima nella pagina
      element.querySelector<HTMLElement>('input, select, textarea')?.focus()
    } else if (!open && element.open) {
      element.close()
    }
  }, [open])

  /** Ogni modo di chiudere passa da qui: con modifiche non salvate, prima si chiede */
  function requestClose() {
    if (dirty) {
      setConfirmingClose(true)
    } else {
      onClose()
    }
  }

  function closeWithoutSaving() {
    setConfirmingClose(false)
    onClose()
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Esc: il browser chiuderebbe subito, invece passiamo dal controllo delle modifiche
      onCancel={(event) => {
        event.preventDefault()
        requestClose()
      }}
      // Un clic sul velo scuro intorno: il bersaglio è il <dialog> stesso, non il suo contenuto
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose()
      }}
      className={[
        'm-auto max-h-[calc(100dvh-3rem)] w-[calc(100vw-2rem)] overflow-hidden rounded-[1.75rem] bg-[#121212] p-0 text-neutral-100',
        'shadow-[inset_0_0_0_1px_#262626,0_40px_80px_rgba(0,0,0,0.6)]',
        'open:motion-safe:animate-comparsa backdrop:bg-black/60 backdrop:backdrop-blur-[3px]',
        size === 'lg' ? 'max-w-[51rem]' : 'max-w-[35rem]',
      ].join(' ')}
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex max-h-[calc(100dvh-3rem)] flex-col"
      >
        <header className="flex items-start justify-between gap-4 px-7 pt-6">
          <div>
            <h2
              id={titleId}
              className="font-display text-2xl font-extrabold tracking-[-0.03em]"
            >
              {title}
            </h2>
            {description && (
              <p
                id={descriptionId}
                className="mt-1.5 text-[0.8125rem] text-neutral-400"
              >
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Chiudi"
            onClick={requestClose}
            className="focus-visible:outline-rosso-acceso flex size-9 shrink-0 items-center justify-center rounded-full bg-white/6 text-neutral-300 transition-colors hover:bg-white/12 hover:text-white focus-visible:outline-2"
          >
            <XIcon aria-hidden="true" size={16} />
          </button>
        </header>

        {/* I campi: se sono tanti scorrono qui, mentre titolo e pulsanti restano fermi */}
        <div className="min-h-0 flex-1 overflow-y-auto px-7 pt-5 pb-2">
          {children}
        </div>

        <footer className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 px-7 py-4">
          {confirmingClose ? (
            <div
              role="alertdialog"
              aria-label="Modifiche non salvate"
              className="flex w-full flex-wrap items-center justify-between gap-3"
            >
              <p className="text-sm text-neutral-200">
                Hai modifiche non salvate. Chiudere senza salvarle?
              </p>
              <div className="flex gap-2.5">
                <AdminButton
                  variant="outline"
                  onClick={() => setConfirmingClose(false)}
                >
                  Continua a modificare
                </AdminButton>
                <AdminButton variant="dangerSoft" onClick={closeWithoutSaving}>
                  Chiudi senza salvare
                </AdminButton>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-neutral-500">
                <kbd className="rounded-[5px] bg-white/8 px-1.5 py-0.5 font-sans text-[0.6875rem] text-neutral-300">
                  Esc
                </kbd>{' '}
                per chiudere
              </p>
              <div className="flex gap-2.5">
                <AdminButton variant="outline" onClick={requestClose}>
                  Annulla
                </AdminButton>
                <AdminButton type="submit" disabled={pending}>
                  {pending ? 'Salvataggio…' : submitLabel}
                </AdminButton>
              </div>
            </>
          )}
        </footer>
      </form>
    </dialog>
  )
}

import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilSimpleIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { PhotoUploadModal } from '@/components/admin/images/PhotoUploadModal'
import { PhotoTextModal } from '@/components/admin/images/PhotoTextModal'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { sectionButtonClass } from '@/components/admin/ui/adminButtonClass'
import { useImageActions, useVersionImages } from '@/hooks/useVersionImages'

type GalleryCardProps = {
  versionId: number
  versionName: string
  delay?: number
  className?: string
}

/** Cosa è aperto: la finestra del testo, o la conferma dell'eliminazione su una miniatura */
type Panel = { id: number; kind: 'edit' } | { id: number; kind: 'delete' }

const iconButton =
  'flex size-8 shrink-0 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-30'

/**
 * Le foto della versione, in miniature compatte. Passando su una miniatura (o arrivandoci
 * con la tastiera) compaiono le sue azioni: spostarla, farla copertina, descriverla, eliminarla.
 * Tutto si salva subito.
 */
export function GalleryCard({
  versionId,
  versionName,
  delay,
  className = '',
}: GalleryCardProps) {
  const { data: images, isPending, isError } = useVersionImages(versionId)
  const { update, remove, reorder } = useImageActions(versionId)
  const [panel, setPanel] = useState<Panel | null>(null)
  // La finestra per aggiungere le foto
  const [adding, setAdding] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  // La freccia da rimettere a fuoco dopo uno spostamento: l'elemento spostato perde il focus.
  // Un riferimento e non uno stato: è un'informazione di servizio, che non si disegna
  const refocus = useRef<string | null>(null)

  // Lo spostamento aggiorna subito le foto: quando cambiano, la freccia in attesa riceve il focus
  useEffect(() => {
    if (!refocus.current) return

    document.getElementById(refocus.current)?.focus()
    refocus.current = null
  }, [images])

  const busy = update.isPending || remove.isPending
  const editing =
    panel?.kind === 'edit'
      ? images?.find((image) => image.id === panel.id)
      : undefined

  function move(index: number, step: -1 | 1) {
    if (!images) return

    const ids = images.map((image) => image.id)
    const target = index + step
    // Scambia la foto con la sua vicina
    ;[ids[index], ids[target]] = [ids[target], ids[index]]

    reorder.mutate(ids)
    setAnnouncement(
      `Foto spostata in posizione ${target + 1} di ${ids.length}.`,
    )

    // Se la foto arriva a un estremo, la sua freccia si disattiva: il focus va sull'altra
    const lastIndex = ids.length - 1
    const direction =
      (step === -1 && target === 0) || (step === 1 && target === lastIndex)
        ? -step
        : step
    refocus.current = `sposta-${direction === -1 ? 'prima' : 'dopo'}-${images[index].id}`
  }

  return (
    <AdminCard
      aria-labelledby="versione-foto"
      delay={delay}
      className={`p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2
            id="versione-foto"
            className="font-display text-xl font-extrabold tracking-[-0.03em]"
          >
            Foto
          </h2>
          {images && images.length > 0 && (
            <span className="rounded-full bg-white/8 px-2.5 py-1 text-[0.6875rem] font-semibold text-neutral-300">
              {images.length}
            </span>
          )}
        </div>
        {/* Come «Modifica» nelle altre sezioni: in alto a destra, apre una finestra */}
        <button
          type="button"
          onClick={() => setAdding(true)}
          className={sectionButtonClass}
        >
          <PlusIcon aria-hidden="true" size={14} />
          Aggiungi foto
        </button>
      </div>

      {isPending && (
        <div
          aria-busy="true"
          className="mt-5 h-32 animate-pulse rounded-2xl bg-white/5"
        />
      )}

      {isError && (
        <p className="mt-5 text-sm text-neutral-400">
          Impossibile caricare le foto.
        </p>
      )}

      {images && images.length === 0 && (
        <p className="mt-4 text-sm text-neutral-400">
          Nessuna foto: la versione comparirà sul sito senza immagini.
        </p>
      )}

      {images && images.length > 0 && (
        // Miniature che si dispongono da sole: tante quante ne stanno in una riga
        <ul className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
          {images.map((image, index) => {
            const alt = image.alt_text.it ?? ''
            const deleting = panel?.kind === 'delete' && panel.id === image.id

            return (
              <li
                key={image.id}
                title={alt}
                className="group border-linea relative aspect-[4/3] overflow-hidden rounded-2xl border bg-white/5"
              >
                <img
                  src={image.url}
                  alt={alt}
                  loading="lazy"
                  className="size-full object-cover"
                />
                {image.is_cover && (
                  <span className="text-notte absolute top-2 left-2 rounded-full bg-white px-2 py-0.5 text-[0.625rem] font-bold tracking-[0.08em] uppercase">
                    Copertina
                  </span>
                )}
                <span className="bg-notte/80 absolute top-2 right-2 rounded-full px-2 py-0.5 text-[0.625rem] font-bold text-neutral-200 tabular-nums">
                  {index + 1}
                </span>

                {deleting ? (
                  // La conferma copre la miniatura: si vede ancora quale foto si sta eliminando
                  <div
                    role="alertdialog"
                    aria-labelledby={`elimina-${image.id}`}
                    className="bg-notte/85 absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-3 text-center backdrop-blur-sm"
                  >
                    <p
                      id={`elimina-${image.id}`}
                      className="text-xs font-semibold text-neutral-100"
                    >
                      Eliminare questa foto?
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <AdminButton
                        variant="danger"
                        disabled={busy}
                        onClick={() =>
                          remove.mutate(image.id, {
                            onSuccess: () => setPanel(null),
                          })
                        }
                        className="h-8 px-3 text-xs"
                      >
                        Sì, elimina
                      </AdminButton>
                      <AdminButton
                        variant="outline"
                        onClick={() => setPanel(null)}
                        className="h-8 px-3 text-xs"
                      >
                        Annulla
                      </AdminButton>
                    </div>
                  </div>
                ) : (
                  // Le azioni compaiono passando sopra, o arrivandoci con il tasto Tab
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/85 to-transparent p-2 pt-6 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        id={`sposta-prima-${image.id}`}
                        aria-label={`Sposta prima: ${alt}`}
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                        className={iconButton}
                      >
                        <ArrowLeftIcon aria-hidden="true" size={14} />
                      </button>
                      <button
                        type="button"
                        id={`sposta-dopo-${image.id}`}
                        aria-label={`Sposta dopo: ${alt}`}
                        disabled={index === images.length - 1}
                        onClick={() => move(index, 1)}
                        className={iconButton}
                      >
                        <ArrowRightIcon aria-hidden="true" size={14} />
                      </button>
                    </div>
                    <div className="flex gap-1">
                      {!image.is_cover && (
                        <button
                          type="button"
                          disabled={busy}
                          aria-label={`Usa come copertina: ${alt}`}
                          title="Usa come copertina: rappresenta la versione nell'archivio"
                          onClick={() =>
                            update.mutate({ id: image.id, is_cover: true })
                          }
                          className={iconButton}
                        >
                          <StarIcon aria-hidden="true" size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={`Modifica il testo: ${alt}`}
                        onClick={() => setPanel({ id: image.id, kind: 'edit' })}
                        className={iconButton}
                      >
                        <PencilSimpleIcon aria-hidden="true" size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Elimina: ${alt}`}
                        onClick={() =>
                          setPanel({ id: image.id, kind: 'delete' })
                        }
                        className={`${iconButton} hover:bg-rosso`}
                      >
                        <TrashIcon aria-hidden="true" size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {(update.isError || remove.isError || reorder.isError) && (
        <p role="alert" className="text-errore mt-4 text-[0.8125rem]">
          Impossibile completare l'operazione. Riprova.
        </p>
      )}

      <p role="status" className="sr-only">
        {announcement}
      </p>

      {adding && (
        <PhotoUploadModal
          versionId={versionId}
          versionName={versionName}
          onUploaded={(count) =>
            setAnnouncement(
              count === 1 ? '1 foto caricata.' : `${count} foto caricate.`,
            )
          }
          onClose={() => setAdding(false)}
        />
      )}

      {/* La finestra del testo, montata solo quando serve: riparte dal testo salvato */}
      {editing && (
        <PhotoTextModal
          key={editing.id}
          versionId={versionId}
          image={editing}
          onClose={() => setPanel(null)}
        />
      )}
    </AdminCard>
  )
}

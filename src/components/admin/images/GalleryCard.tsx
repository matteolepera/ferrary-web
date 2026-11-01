import { useEffect, useRef, useState } from 'react'
import { ImageUploader } from '@/components/admin/images/ImageUploader'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { AdminField } from '@/components/admin/ui/AdminField'
import { Icon } from '@/components/admin/ui/Icon'
import { useImageActions, useVersionImages } from '@/hooks/useVersionImages'

type GalleryCardProps = {
  versionId: number
  versionName: string
  delay?: number
  className?: string
}

/** Cosa è aperto in una card: la modifica del testo, o la conferma dell'eliminazione */
type Panel =
  | { id: number; kind: 'edit'; it: string; en: string }
  | { id: number; kind: 'delete' }

const iconButton =
  'flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-25'

/**
 * Le foto della versione: caricamento, copertina, testo alternativo, ordine ed eliminazione.
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
      <h2
        id="versione-foto"
        className="font-display text-xl font-extrabold tracking-[-0.03em]"
      >
        Foto
      </h2>
      <p className="mt-1 text-[0.8125rem] text-neutral-400">
        La copertina rappresenta la versione nell'archivio e nella pagina del
        modello. L'ordine è quello della galleria.
      </p>

      <ImageUploader versionId={versionId} versionName={versionName} />

      {isPending && (
        <div
          aria-busy="true"
          className="mt-5 h-48 animate-pulse rounded-2xl bg-white/5"
        />
      )}

      {isError && (
        <p className="mt-5 text-sm text-neutral-400">
          Impossibile caricare le foto.
        </p>
      )}

      {images && images.length === 0 && (
        <p className="border-linea mt-5 rounded-[1.125rem] border border-dashed px-5 py-8 text-center text-sm text-neutral-400">
          Nessuna foto: la versione comparirà sul sito senza immagini.
        </p>
      )}

      {images && images.length > 0 && (
        <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {images.map((image, index) => {
            const alt = image.alt_text.it ?? ''
            const open = panel?.id === image.id ? panel : null

            return (
              <li
                key={image.id}
                className="border-linea bg-notte overflow-hidden rounded-[1.125rem] border"
              >
                <div className="relative aspect-[4/3] bg-white/5">
                  <img
                    src={image.url}
                    alt={alt}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                  {image.is_cover && (
                    <span className="text-notte absolute top-2.5 left-2.5 rounded-full bg-white px-2.5 py-1 text-[0.625rem] font-bold tracking-[0.08em] uppercase">
                      Copertina
                    </span>
                  )}
                  <span className="bg-notte/80 absolute top-2.5 right-2.5 rounded-full px-2 py-1 text-[0.625rem] font-bold text-neutral-200 tabular-nums">
                    {index + 1}
                  </span>
                </div>

                <div className="p-3.5">
                  {open?.kind === 'edit' ? (
                    <div className="flex flex-col gap-3">
                      <AdminField
                        label="Testo alternativo"
                        value={open.it}
                        onChange={(event) =>
                          setPanel({ ...open, it: event.target.value })
                        }
                        error={
                          open.it.trim() === ''
                            ? 'Il testo alternativo in italiano è obbligatorio.'
                            : undefined
                        }
                      />
                      <AdminField
                        label="In inglese"
                        value={open.en}
                        onChange={(event) =>
                          setPanel({ ...open, en: event.target.value })
                        }
                      />
                      <div className="flex gap-2">
                        <AdminButton
                          disabled={busy || open.it.trim() === ''}
                          onClick={() =>
                            update.mutate(
                              {
                                id: image.id,
                                alt_text: {
                                  it: open.it.trim(),
                                  en: open.en.trim() || undefined,
                                },
                              },
                              { onSuccess: () => setPanel(null) },
                            )
                          }
                          className="h-9 px-3.5 text-xs"
                        >
                          Salva
                        </AdminButton>
                        <AdminButton
                          variant="outline"
                          onClick={() => setPanel(null)}
                          className="h-9 px-3.5 text-xs"
                        >
                          Annulla
                        </AdminButton>
                      </div>
                    </div>
                  ) : open?.kind === 'delete' ? (
                    <div
                      role="alertdialog"
                      aria-labelledby={`elimina-${image.id}`}
                    >
                      <p
                        id={`elimina-${image.id}`}
                        className="text-xs font-semibold text-neutral-100"
                      >
                        Eliminare questa foto?
                      </p>
                      <div className="mt-2.5 flex gap-2">
                        <AdminButton
                          disabled={busy}
                          onClick={() =>
                            remove.mutate(image.id, {
                              onSuccess: () => setPanel(null),
                            })
                          }
                          className="h-9 px-3.5 text-xs"
                        >
                          Sì, elimina
                        </AdminButton>
                        <AdminButton
                          variant="outline"
                          onClick={() => setPanel(null)}
                          className="h-9 px-3.5 text-xs"
                        >
                          Annulla
                        </AdminButton>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="line-clamp-2 min-h-10 text-xs leading-relaxed text-neutral-300">
                        {alt}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            id={`sposta-prima-${image.id}`}
                            aria-label={`Sposta prima: ${alt}`}
                            disabled={index === 0}
                            onClick={() => move(index, -1)}
                            className={iconButton}
                          >
                            <Icon path="M15 6l-6 6 6 6" size={15} />
                          </button>
                          <button
                            type="button"
                            id={`sposta-dopo-${image.id}`}
                            aria-label={`Sposta dopo: ${alt}`}
                            disabled={index === images.length - 1}
                            onClick={() => move(index, 1)}
                            className={iconButton}
                          >
                            <Icon path="M9 6l6 6-6 6" size={15} />
                          </button>
                        </div>

                        <div className="flex gap-1">
                          <button
                            type="button"
                            aria-label={`Modifica il testo: ${alt}`}
                            onClick={() =>
                              setPanel({
                                id: image.id,
                                kind: 'edit',
                                it: alt,
                                en: image.alt_text.en ?? '',
                              })
                            }
                            className={iconButton}
                          >
                            <Icon path="M4 20l4-1 11-11-3-3L5 16z" size={15} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Elimina: ${alt}`}
                            onClick={() =>
                              setPanel({ id: image.id, kind: 'delete' })
                            }
                            className={`${iconButton} hover:bg-rosso`}
                          >
                            <Icon
                              path="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"
                              size={15}
                            />
                          </button>
                        </div>
                      </div>

                      {!image.is_cover && (
                        <button
                          type="button"
                          disabled={busy}
                          aria-label={`Usa come copertina: ${alt}`}
                          onClick={() =>
                            update.mutate({ id: image.id, is_cover: true })
                          }
                          className="mt-2.5 text-xs font-semibold text-neutral-300 underline-offset-4 transition-colors hover:text-white hover:underline disabled:opacity-40"
                        >
                          Usa come copertina
                        </button>
                      )}
                    </>
                  )}
                </div>
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
    </AdminCard>
  )
}

import { useState } from 'react'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { Icon } from '@/components/admin/ui/Icon'
import { useImageActions, useVersionImages } from '@/hooks/useVersionImages'
import { ImageUploader } from '@/components/admin/images/ImageUploader'

type GalleryCardProps = {
  versionId: number
  versionName: string
  delay?: number
  className?: string
}

/**
 * Le foto della versione: la copertina, l'eliminazione, e più avanti caricamento e ordine.
 */
export function GalleryCard({
  versionId,
  versionName,
  delay,
  className = '',
}: GalleryCardProps) {
  const { data: images, isPending, isError } = useVersionImages(versionId)
  const { update, remove } = useImageActions(versionId)
  // La foto per cui si sta chiedendo conferma dell'eliminazione
  const [confirming, setConfirming] = useState<number | null>(null)

  const busy = update.isPending || remove.isPending

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
        modello.
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
          {images.map((image) => {
            const alt = image.alt_text.it ?? ''

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
                </div>

                <div className="p-3.5">
                  <p className="line-clamp-2 min-h-10 text-xs leading-relaxed text-neutral-300">
                    {alt}
                  </p>

                  {confirming === image.id ? (
                    <div
                      role="alertdialog"
                      aria-labelledby={`elimina-${image.id}`}
                      className="mt-3"
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
                              onSuccess: () => setConfirming(null),
                            })
                          }
                          className="h-9 px-3.5 text-xs"
                        >
                          Sì, elimina
                        </AdminButton>
                        <AdminButton
                          variant="outline"
                          onClick={() => setConfirming(null)}
                          className="h-9 px-3.5 text-xs"
                        >
                          Annulla
                        </AdminButton>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center justify-between gap-2">
                      {image.is_cover ? (
                        <span className="text-xs text-neutral-500">
                          È la copertina
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          aria-label={`Usa come copertina: ${alt}`}
                          onClick={() =>
                            update.mutate({ id: image.id, is_cover: true })
                          }
                          className="text-xs font-semibold text-neutral-300 underline-offset-4 transition-colors hover:text-white hover:underline disabled:opacity-40"
                        >
                          Usa come copertina
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={`Elimina: ${alt}`}
                        onClick={() => setConfirming(image.id)}
                        className="hover:bg-rosso flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-white"
                      >
                        <Icon
                          path="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"
                          size={15}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {(update.isError || remove.isError) && (
        <p role="alert" className="text-errore mt-4 text-[0.8125rem]">
          Impossibile completare l'operazione. Riprova.
        </p>
      )}
    </AdminCard>
  )
}

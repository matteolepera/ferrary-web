import { useState, type FormEvent } from 'react'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { FormAlert } from '@/components/admin/ui/FormAlert'
import { useImageActions } from '@/hooks/useVersionImages'
import type { AdminImage } from '@/types/admin'

type PhotoTextModalProps = {
  versionId: number
  image: AdminImage
  onClose: () => void
}

/**
 * La finestra del testo alternativo di una foto: quello che legge chi non vede l'immagine.
 * Accanto ai campi c'è la foto, così si descrive guardandola.
 */
export function PhotoTextModal({
  versionId,
  image,
  onClose,
}: PhotoTextModalProps) {
  const { update } = useImageActions(versionId)
  const initial = { it: image.alt_text.it ?? '', en: image.alt_text.en ?? '' }
  const [text, setText] = useState(initial)
  const missing = text.it.trim() === ''

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // L'italiano è obbligatorio: il campo lo dice già, qui non si parte
    if (missing) return

    update.mutate(
      {
        id: image.id,
        alt_text: { it: text.it.trim(), en: text.en.trim() || undefined },
      },
      { onSuccess: onClose },
    )
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title="Testo alternativo della foto"
      description="Descrivi l’inquadratura: «SF90 Stradale, vista posteriore di tre quarti»."
      dirty={text.it !== initial.it || text.en !== initial.en}
      onSubmit={handleSubmit}
      submitLabel="Salva il testo"
      pending={update.isPending}
    >
      {update.isError && (
        <FormAlert className="mb-5">
          Impossibile salvare il testo in questo momento. Riprova.
        </FormAlert>
      )}

      <div className="flex flex-col gap-5 sm:flex-row">
        <img
          src={image.url}
          alt=""
          className="aspect-[4/3] w-full shrink-0 rounded-xl object-cover sm:w-44"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <AdminField
            label="Testo alternativo"
            required
            value={text.it}
            onChange={(event) => setText({ ...text, it: event.target.value })}
            error={
              missing
                ? 'Il testo alternativo in italiano è obbligatorio.'
                : undefined
            }
          />
          <AdminField
            label="In inglese"
            optional
            value={text.en}
            onChange={(event) => setText({ ...text, en: event.target.value })}
          />
        </div>
      </div>
    </AdminModal>
  )
}

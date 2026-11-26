import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
} from 'react'
import { validationErrors } from '@/api/errors'
import { AdminField } from '@/components/admin/ui/AdminField'
import { AdminModal } from '@/components/admin/ui/AdminModal'
import { Icon } from '@/components/admin/ui/Icon'
import { useImageActions } from '@/hooks/useVersionImages'
import { checkImage } from '@/lib/checkImage'

type Pending = {
  key: number
  file: File
  /** L'indirizzo temporaneo dell'anteprima, da liberare quando la foto esce dalla coda */
  preview: string
  altIt: string
  altEn: string
  state: 'checking' | 'invalid' | 'ready' | 'uploading' | 'failed'
  error?: string
  progress: number
}

type PhotoUploadModalProps = {
  versionId: number
  /** Il nome della versione: è l'inizio del testo alternativo di ogni foto */
  versionName: string
  /** Dopo il caricamento: quante foto sono arrivate */
  onUploaded: (count: number) => void
  onClose: () => void
}

/**
 * La finestra per aggiungere le foto: si scelgono o si trascinano, vengono controllate subito,
 * ognuna riceve il suo testo alternativo, e partono una dopo l'altra.
 * Se arrivano tutte la finestra si chiude; se qualcuna non riesce, resta aperta su quelle.
 */
export function PhotoUploadModal({
  versionId,
  versionName,
  onUploaded,
  onClose,
}: PhotoUploadModalProps) {
  const { upload } = useImageActions(versionId)
  const [queue, setQueue] = useState<Pending[]>([])
  const [dragging, setDragging] = useState(false)
  const nextKey = useRef(1)

  // Le anteprime ancora aperte, da liberare quando la finestra si chiude
  const previews = useRef(new Set<string>())
  useEffect(() => {
    const open = previews.current
    return () => open.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  function patch(key: number, changes: Partial<Pending>) {
    setQueue((current) =>
      current.map((item) =>
        item.key === key ? { ...item, ...changes } : item,
      ),
    )
  }

  function discard(key: number) {
    setQueue((current) => {
      const item = current.find((entry) => entry.key === key)
      if (item) {
        URL.revokeObjectURL(item.preview)
        previews.current.delete(item.preview)
      }
      return current.filter((entry) => entry.key !== key)
    })
  }

  function addFiles(files: File[]) {
    for (const file of files) {
      const key = nextKey.current++
      const preview = URL.createObjectURL(file)
      previews.current.add(preview)

      setQueue((current) => [
        ...current,
        {
          key,
          file,
          preview,
          altIt: versionName,
          altEn: '',
          state: 'checking',
          progress: 0,
        },
      ])

      checkImage(file).then((error) =>
        patch(
          key,
          error
            ? { state: 'invalid', error }
            : { state: 'ready', error: undefined },
        ),
      )
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setDragging(false)
    addFiles(Array.from(event.dataTransfer.files))
  }

  // Si caricano le foto pronte e quelle da riprovare, purché abbiano il testo alternativo
  const uploadable = queue.filter(
    (item) => item.state === 'ready' || item.state === 'failed',
  )
  const missingAlt = uploadable.some((item) => item.altIt.trim() === '')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (uploadable.length === 0 || missingAlt) return

    let uploaded = 0
    let failed = 0

    for (const item of uploadable) {
      patch(item.key, { state: 'uploading', progress: 0, error: undefined })

      try {
        await upload.mutateAsync({
          file: item.file,
          altText: {
            it: item.altIt.trim(),
            en: item.altEn.trim() || undefined,
          },
          onProgress: (progress) => patch(item.key, { progress }),
        })
        discard(item.key)
        uploaded++
      } catch (error) {
        failed++
        const errors = validationErrors(error)
        patch(item.key, {
          state: 'failed',
          error:
            errors?.image?.[0] ??
            errors?.['alt_text.it']?.[0] ??
            'Caricamento non riuscito. Riprova.',
        })
      }
    }

    if (uploaded > 0) onUploaded(uploaded)
    // Tutto arrivato: la finestra ha finito il suo lavoro
    if (failed === 0) onClose()
  }

  return (
    <AdminModal
      open
      onClose={onClose}
      title="Aggiungi foto"
      description={`A ${versionName}. Ogni foto ha bisogno del suo testo alternativo.`}
      // Con foto in coda, chiudere chiede conferma: si perderebbero
      dirty={queue.length > 0}
      size="lg"
      onSubmit={handleSubmit}
      submitLabel={
        uploadable.length === 1
          ? 'Carica 1 foto'
          : `Carica ${uploadable.length} foto`
      }
      submitDisabled={uploadable.length === 0 || missingAlt}
      pending={upload.isPending}
    >
      <label
        onDragOver={(event) => {
          // Senza preventDefault il browser aprirebbe il file in una nuova scheda
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={[
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[1.125rem] border border-dashed px-5 py-7 text-center transition-colors',
          'focus-within:border-neutral-300',
          dragging
            ? 'border-rosso bg-rosso/10'
            : 'border-white/15 hover:border-white/30',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className="flex size-11 items-center justify-center rounded-full bg-white/5 text-neutral-300"
        >
          <Icon
            path="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"
            size={18}
          />
        </span>
        <span className="text-sm font-semibold text-neutral-100">
          Trascina qui le foto, o clicca per sceglierle
        </span>
        <span className="text-xs text-neutral-500">
          JPG, PNG o WebP, fino a 10 MB, larghe almeno 800 pixel
        </span>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          aria-label="Scegli le foto"
          className="sr-only"
          onChange={(event) => {
            addFiles(Array.from(event.target.files ?? []))
            // Svuota il campo: scegliere di nuovo lo stesso file deve funzionare
            event.target.value = ''
          }}
        />
      </label>

      {queue.length > 0 && (
        <ul className="mt-4 flex flex-col gap-3">
          {queue.map((item) => (
            <li
              key={item.key}
              className="border-linea bg-notte flex gap-4 rounded-[1.125rem] border p-3.5"
            >
              <img
                src={item.preview}
                alt=""
                className="size-24 shrink-0 rounded-xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate text-sm font-semibold">
                    {item.file.name}
                  </p>
                  {item.state !== 'uploading' && (
                    <button
                      type="button"
                      aria-label={`Togli ${item.file.name} dalla coda`}
                      onClick={() => discard(item.key)}
                      className="flex size-7 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Icon path="M6 6l12 12M18 6L6 18" size={14} />
                    </button>
                  )}
                </div>

                {item.state === 'invalid' ? (
                  <p className="text-errore mt-2 text-[0.8125rem]">
                    {item.error}
                  </p>
                ) : (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <AdminField
                      label="Testo alternativo"
                      required
                      value={item.altIt}
                      disabled={item.state === 'uploading'}
                      onChange={(event) =>
                        patch(item.key, { altIt: event.target.value })
                      }
                      error={
                        item.altIt.trim() === ''
                          ? 'Il testo alternativo in italiano è obbligatorio.'
                          : undefined
                      }
                    />
                    <AdminField
                      label="In inglese"
                      optional
                      value={item.altEn}
                      disabled={item.state === 'uploading'}
                      onChange={(event) =>
                        patch(item.key, { altEn: event.target.value })
                      }
                    />
                  </div>
                )}

                {item.state === 'uploading' && (
                  <div
                    role="progressbar"
                    aria-label={`Caricamento di ${item.file.name}`}
                    aria-valuenow={item.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"
                  >
                    <div
                      className="bg-rosso h-full rounded-full transition-[width]"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}

                {item.state === 'failed' && (
                  <p className="text-errore mt-2 text-[0.8125rem]">
                    {item.error}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminModal>
  )
}

/** Le stesse regole di StoreImageRequest del backend */
const TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 10 * 1024 * 1024
const MIN_WIDTH = 800

/**
 * Controlla una foto prima di caricarla: il motivo per cui non va bene, oppure null.
 * Il backend ricontrolla tutto: questi controlli servono solo a non far aspettare per niente.
 */
export async function checkImage(file: File): Promise<string | null> {
  if (!TYPES.includes(file.type)) {
    return 'Formato non supportato: usa JPG, PNG o WebP.'
  }

  if (file.size > MAX_BYTES) {
    return 'La foto supera i 10 MB.'
  }

  // La larghezza si legge decodificando l'immagine; dove non si può, la controlla il backend
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file)
      const { width } = bitmap
      bitmap.close()

      if (width < MIN_WIDTH) {
        return `La foto è larga ${width} pixel: ne servono almeno ${MIN_WIDTH}.`
      }
    } catch {
      return 'Il file non sembra un’immagine valida.'
    }
  }

  return null
}

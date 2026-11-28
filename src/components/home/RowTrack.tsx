import { useState, type PointerEvent } from 'react'

type RowTrackProps = {
  /** Quale parte della fila si vede: inizio e larghezza, in frazioni da 0 a 1 */
  start: number
  size: number
  /** Porta la fila in modo che la parte visibile cominci a "fraction" */
  onSeek: (fraction: number, behavior: ScrollBehavior) => void
  /** Avvisa quando si comincia e si smette di trascinare */
  onDragChange: (dragging: boolean) => void
}

/**
 * La traccia sotto una fila che scorre di lato: dice quale parte se ne vede, e si usa come
 * una barra di scorrimento. Si afferra e si trascina; cliccando fuori dalla barra, la fila salta lì.
 * È solo per il mouse e il dito: con la tastiera la fila scorre già con le frecce.
 */
export function RowTrack({ start, size, onSeek, onDragChange }: RowTrackProps) {
  // Dove si è afferrata la barra, in frazione della traccia: trascinando resta sotto il puntatore.
  // null quando non si trascina
  const [grab, setGrab] = useState<number | null>(null)
  const dragging = grab !== null

  /** La posizione del puntatore sulla traccia, da 0 a 1 */
  function pointerAt(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    return (event.clientX - rect.left) / rect.width
  }

  /** Porta la barra a cominciare da "fraction", senza uscire dalla traccia */
  function seek(fraction: number, behavior: ScrollBehavior) {
    onSeek(Math.min(Math.max(fraction, 0), 1 - size), behavior)
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    // Solo il tasto sinistro del mouse, o il dito
    if (event.button !== 0) return

    const at = pointerAt(event)
    const onThumb = at >= start && at <= start + size
    // Sulla barra si afferra dove si è cliccato; fuori, la barra salta lì, centrata sul puntatore
    setGrab(onThumb ? at - start : size / 2)
    if (!onThumb) seek(at - size / 2, 'smooth')

    // Il puntatore resta alla traccia anche uscendo dai suoi bordi, finché non si lascia
    event.currentTarget.setPointerCapture(event.pointerId)
    onDragChange(true)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (grab === null) return
    seek(pointerAt(event) - grab, 'instant')
  }

  function handlePointerUp() {
    setGrab(null)
    onDragChange(false)
  }

  return (
    <div
      aria-hidden="true"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      // Un'area alta da afferrare, con la linea sottile al centro; touch-none: il dito trascina la barra, non la pagina
      className={[
        'group relative mt-3 flex h-6 touch-none items-center select-none md:mt-5',
        dragging ? 'cursor-grabbing' : 'cursor-pointer',
      ].join(' ')}
    >
      <div
        className={[
          'relative w-full bg-white/8 transition-[height] duration-200',
          dragging ? 'h-1' : 'h-0.5 group-hover:h-1',
        ].join(' ')}
      >
        <span
          className={[
            'bg-rosso-acceso absolute top-0 h-full shadow-[0_0_10px_rgba(255,59,48,0.6)]',
            // Trascinando, la barra segue il puntatore senza ritardo
            dragging ? '' : 'transition-[left] duration-150',
          ].join(' ')}
          style={{ left: `${start * 100}%`, width: `${size * 100}%` }}
        />
      </div>
    </div>
  )
}

import { useId, useRef, type KeyboardEvent } from 'react'

export type ManettinoOption<T extends string> = {
  value: T
  label: string
}

type ManettinoProps<T extends string> = {
  /** Nome del gruppo, letto dai lettori di schermo (es. "Famiglia") */
  label: string
  options: ManettinoOption<T>[]
  value: T
  onValueChange: (value: T) => void
}

// Geometria del disegno, nelle coordinate del viewBox
const WIDTH = 260
const HEIGHT = 200
const CX = 130
const CY = 120
/** Ampiezza dell'arco su cui si distribuiscono le posizioni, in gradi */
const SPREAD = 152

/** Angolo della posizione: da sinistra a destra, con lo zero in alto */
function angleAt(index: number, count: number) {
  return count === 1 ? 0 : -SPREAD / 2 + (SPREAD / (count - 1)) * index
}

/** Punto a una certa distanza dal centro, lungo un angolo */
function pointAt(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180

  return {
    x: CX + radius * Math.sin(radians),
    y: CY - radius * Math.cos(radians),
  }
}

/**
 * Selettore a scelta singola, ispirato al manettino del volante Ferrari.
 * Il disegno è decorativo; le posizioni sono pulsanti radio accessibili.
 */
export function Manettino<T extends string>({
  label,
  options,
  value,
  onValueChange,
}: ManettinoProps<T>) {
  // Id unico per la sfumatura: senza, due manettini nella pagina si "ruberebbero" il colore
  const gradientId = `manettino-${useId().replace(/[^\w-]/g, '')}`
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const current = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const knobAngle = angleAt(current, options.length)

  function select(index: number, moveFocus = false) {
    onValueChange(options[index].value)

    if (moveFocus) {
      buttons.current[index]?.focus()
    }
  }

  // Frecce della tastiera: la manopola avanza o torna di una posizione
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      select(Math.min(current + 1, options.length - 1), true)
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      select(Math.max(current - 1, 0), true)
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="relative w-full max-w-88 select-none"
      style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <defs>
          {/* Rosso anodizzato: più chiaro dove batte la luce, più scuro sul bordo */}
          <radialGradient id={gradientId} cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ff3b30" />
            <stop offset="55%" stopColor="#d40000" />
            <stop offset="100%" stopColor="#8a0000" />
          </radialGradient>
        </defs>

        {/* Razza del volante */}
        <rect
          x="6"
          y="6"
          width="248"
          height="188"
          rx="30"
          className="fill-carbonio"
        />

        {/* Alloggiamento della manopola */}
        <circle
          cx={CX}
          cy={CY}
          r="50"
          className="fill-black stroke-neutral-800"
          strokeWidth="2"
        />

        {/* Tacche delle posizioni */}
        {options.map((option, index) => {
          const angle = angleAt(index, options.length)
          const from = pointAt(angle, 55)
          const to = pointAt(angle, 62)

          return (
            <line
              key={option.value}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className="stroke-white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )
        })}

        {/* Manopola con l'aletta: un clic la fa avanzare di una posizione */}
        <g
          onClick={() => select((current + 1) % options.length)}
          className="ease-scatto cursor-pointer drop-shadow-[0_3px_4px_rgba(0,0,0,0.6)] transition-transform duration-[380ms]"
          style={{
            transform: `rotate(${knobAngle}deg)`,
            transformOrigin: `${CX}px ${CY}px`,
            transformBox: 'view-box',
          }}
        >
          <circle cx={CX} cy={CY} r="42" className="fill-rosso-scuro" />
          <circle cx={CX} cy={CY} r="38" fill={`url(#${gradientId})`} />
          <rect
            x={CX - 10}
            y={CY - 47}
            width="20"
            height="94"
            rx="10"
            fill={`url(#${gradientId})`}
            className="stroke-rosso-scuro"
            strokeWidth="1.5"
          />
          {/* Il segno bianco indica la posizione */}
          <rect
            x={CX - 2.5}
            y={CY - 43}
            width="5"
            height="16"
            rx="2.5"
            className="fill-white"
          />
        </g>
      </svg>

      {/* Le posizioni: veri pulsanti, disposti ad arco sopra il disegno */}
      {options.map((option, index) => {
        const angle = angleAt(index, options.length)
        const { x, y } = pointAt(angle, 80)
        const checked = index === current
        // Come sul volante: le scritte a sinistra finiscono sulla tacca, quelle a destra iniziano lì
        const align =
          angle < -20
            ? '-translate-x-full'
            : angle > 20
              ? ''
              : '-translate-x-1/2'

        return (
          <button
            key={option.value}
            ref={(element) => {
              buttons.current[index] = element
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => select(index)}
            className={[
              'absolute -translate-y-1/2 rounded-sm px-1 text-[0.8rem] font-medium tracking-[0.08em] uppercase',
              'font-stretch-semi-condensed transition-colors',
              'focus-visible:outline-rosso focus-visible:outline-2 focus-visible:outline-offset-2',
              checked
                ? 'text-white'
                : 'text-neutral-400 hover:text-neutral-200',
              align,
            ].join(' ')}
            style={{
              left: `${(x / WIDTH) * 100}%`,
              top: `${(y / HEIGHT) * 100}%`,
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

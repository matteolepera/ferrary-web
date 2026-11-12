type Option = { value: string; label: string }

type YSegmentsProps = {
  /** Il nome del gruppo, per i lettori di schermo: "Architettura" */
  label: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  className?: string
}

/**
 * Poche scelte in fila dentro una barra della Y: quella attiva ha il riflettore e il segno rosso.
 * Se non stanno nello spazio, scorrono di lato.
 */
export function YSegments({
  label,
  options,
  value,
  onChange,
  className = '',
}: YSegmentsProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`senza-barra flex h-full min-w-0 items-stretch overflow-x-auto ${className}`}
    >
      {options.map((option) => {
        const active = option.value === value

        return (
          <button
            key={option.value || 'tutti'}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={[
              'relative shrink-0 px-4 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase transition-colors md:px-5',
              // Il focus da tastiera: un contorno dentro la scelta, perché il segno rosso indica già quella attiva
              'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:-outline-offset-8',
              active
                ? [
                    'bg-[radial-gradient(ellipse_70%_90%_at_50%_0%,rgba(255,255,255,0.16),transparent_80%)] text-white',
                    "after:absolute after:bottom-2 after:left-1/2 after:h-[3px] after:w-3.5 after:-translate-x-1/2 after:-skew-x-[28deg] after:content-['']",
                    'after:bg-rosso-acceso after:shadow-[0_0_8px_rgba(255,59,48,0.7)]',
                  ].join(' ')
                : 'text-neutral-500 hover:text-white',
            ].join(' ')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

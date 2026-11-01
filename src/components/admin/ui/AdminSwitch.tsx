import type { ComponentProps } from 'react'

type AdminSwitchProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: string
  hint?: string
}

/**
 * Un interruttore sì o no: sotto c'è una casella di controllo vera,
 * quindi funziona con la tastiera, con lo spazio, e con i lettori di schermo.
 */
export function AdminSwitch({
  label,
  hint,
  className = '',
  ...props
}: AdminSwitchProps) {
  return (
    <label className={`flex cursor-pointer items-start gap-3.5 ${className}`}>
      <input type="checkbox" className="peer sr-only" {...props} />
      {/* Il binario e il pallino: disegnati, e collegati allo stato della casella con peer */}
      <span
        aria-hidden="true"
        className={[
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full border border-white/15 bg-white/5 transition-colors',
          'after:absolute after:top-0.5 after:left-0.5 after:size-4.5 after:rounded-full after:bg-neutral-400 after:transition-transform',
          'peer-checked:border-rosso peer-checked:bg-rosso peer-checked:after:translate-x-5 peer-checked:after:bg-white',
          'peer-focus-visible:outline-rosso-acceso peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2',
          'peer-disabled:opacity-40',
        ].join(' ')}
      />
      <span>
        <span className="block text-sm font-semibold text-neutral-100">
          {label}
        </span>
        {hint && (
          <span className="mt-0.5 block text-[0.8125rem] text-neutral-500">
            {hint}
          </span>
        )}
      </span>
    </label>
  )
}

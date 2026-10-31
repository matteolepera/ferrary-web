import type { ComponentProps } from 'react'
import { FieldMessages } from './FieldMessages'
import { useFieldA11y } from './useFieldA11y'

type AdminSelectProps = ComponentProps<'select'> & {
  label: string
  hint?: string
  error?: string
}

/**
 * Menu a tendina dell'admin: il select nativo, con l'aspetto dei campi.
 * Su tablet apre il selettore del sistema, comodo con le dita.
 */
export function AdminSelect({
  label,
  hint,
  error,
  id,
  className = '',
  children,
  ...props
}: AdminSelectProps) {
  const { fieldId, hintId, errorId, describedBy, invalid } = useFieldA11y(
    id,
    hint,
    error,
  )

  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className="mb-2 block text-[0.6875rem] font-semibold tracking-[0.18em] text-neutral-400 uppercase"
      >
        {label}
      </label>
      <select
        id={fieldId}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={[
          'bg-notte h-13 w-full rounded-2xl border px-4 text-[0.9375rem] text-neutral-100 transition-colors',
          'outline-none focus:border-neutral-300',
          error ? 'border-errore' : 'border-white/10',
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
      <FieldMessages
        hint={hint}
        error={error}
        hintId={hintId}
        errorId={errorId}
      />
    </div>
  )
}

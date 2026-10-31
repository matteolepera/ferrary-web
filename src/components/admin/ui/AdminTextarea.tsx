import type { ComponentProps } from 'react'
import { FieldMessages } from './FieldMessages'
import { useFieldA11y } from './useFieldA11y'

type AdminTextareaProps = ComponentProps<'textarea'> & {
  label: string
  hint?: string
  error?: string
}

/**
 * Area di testo dell'admin, per le descrizioni: cresce con il contenuto, fino a un limite.
 */
export function AdminTextarea({
  label,
  hint,
  error,
  id,
  className = '',
  ...props
}: AdminTextareaProps) {
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
      <textarea
        id={fieldId}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={[
          'bg-notte block max-h-96 min-h-36 w-full resize-y rounded-2xl border px-4 py-3.5 text-[0.9375rem] leading-relaxed text-neutral-100',
          '[field-sizing:content] transition-colors outline-none placeholder:text-neutral-600 focus:border-neutral-300',
          error ? 'border-errore' : 'border-white/10',
        ].join(' ')}
        {...props}
      />
      <FieldMessages
        hint={hint}
        error={error}
        hintId={hintId}
        errorId={errorId}
      />
    </div>
  )
}

import type { ComponentProps } from 'react'
import { FieldMessages } from './FieldMessages'
import { useFieldA11y } from './useFieldA11y'
import { FieldLabel } from './FieldLabel'
import { fieldBox } from './fieldBox'

type AdminTextareaProps = ComponentProps<'textarea'> & {
  label: string
  hint?: string
  error?: string
  optional?: boolean
}

/**
 * Area di testo dell'admin, per le descrizioni: cresce con il contenuto, fino a un limite.
 */
export function AdminTextarea({
  label,
  hint,
  error,
  id,
  required,
  optional,
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
      <FieldLabel
        htmlFor={fieldId}
        label={label}
        required={required}
        optional={optional}
      />
      <textarea
        id={fieldId}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className={`block [field-sizing:content] max-h-96 min-h-32 w-full resize-y px-3.5 py-3 leading-relaxed placeholder:text-neutral-600 ${fieldBox(error)}`}
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

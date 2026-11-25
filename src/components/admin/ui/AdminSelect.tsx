import type { ComponentProps } from 'react'
import { FieldMessages } from './FieldMessages'
import { useFieldA11y } from './useFieldA11y'
import { FieldLabel } from './FieldLabel'
import { fieldBox } from './fieldBox'

type AdminSelectProps = ComponentProps<'select'> & {
  label: string
  hint?: string
  error?: string
  optional?: boolean
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
  required,
  optional,
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
      <FieldLabel
        htmlFor={fieldId}
        label={label}
        required={required}
        optional={optional}
      />
      <select
        id={fieldId}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className={`h-12 w-full px-3.5 ${fieldBox(error)}`}
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

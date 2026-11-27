import type { ComponentProps } from 'react'
import { CaretDownIcon } from '@phosphor-icons/react'
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
      {/* appearance-none toglie la freccia del browser: la nostra ha spazio dal bordo */}
      <div className="relative">
        <select
          id={fieldId}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          className={`peer h-12 w-full appearance-none pr-10 pl-3.5 ${fieldBox(error)}`}
          {...props}
        >
          {children}
        </select>
        <CaretDownIcon
          aria-hidden="true"
          size={14}
          weight="bold"
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-neutral-400 peer-disabled:text-neutral-700"
        />
      </div>
      <FieldMessages
        hint={hint}
        error={error}
        hintId={hintId}
        errorId={errorId}
      />
    </div>
  )
}

import { type ComponentProps, type ReactNode } from 'react'
import { FieldLabel } from './FieldLabel'
import { FieldMessages } from './FieldMessages'
import { fieldBox } from './fieldBox'
import { useFieldA11y } from './useFieldA11y'

type AdminFieldProps = ComponentProps<'input'> & {
  label: string
  /** Suggerimento sotto il campo */
  hint?: string
  /** Messaggio d'errore: se presente, il campo risulta non valido */
  error?: string
  /** L'unità di misura, dentro il campo a destra: "mm", "km/h" */
  unit?: string
  /** Scrive "facoltativo" accanto all'etichetta */
  optional?: boolean
  /** Icona decorativa a sinistra, dentro il campo */
  icon?: ReactNode
  /** Un elemento a destra, dentro il campo: ad esempio il pulsante per mostrare la password */
  trailing?: ReactNode
}

/**
 * Campo dell'admin: etichetta leggibile, asterisco sugli obbligatori, unità dentro il campo.
 * Etichetta, suggerimento ed errore sono collegati al campo come nel TextField del sito.
 */
export function AdminField({
  label,
  hint,
  error,
  unit,
  optional,
  icon,
  trailing,
  id,
  required,
  className = '',
  ...props
}: AdminFieldProps) {
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
        unit={unit}
        required={required}
        optional={optional}
      />

      <div
        className={`flex h-12 items-center gap-2.5 px-3.5 ${fieldBox(error)}`}
      >
        {icon && (
          <span aria-hidden="true" className="flex text-neutral-500">
            {icon}
          </span>
        )}
        <input
          id={fieldId}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-600 disabled:cursor-not-allowed"
          {...props}
        />
        {unit && (
          <span
            aria-hidden="true"
            className="shrink-0 text-[0.8125rem] font-semibold text-neutral-500"
          >
            {unit}
          </span>
        )}
        {trailing}
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

import { CircleAlert } from 'lucide-react'
import { useId, type ComponentProps } from 'react'

type TextFieldProps = ComponentProps<'input'> & {
  label: string
  /** Suggerimento sotto il campo, ad esempio il formato atteso */
  hint?: string
  /** Messaggio d'errore: se presente, il campo risulta non valido */
  error?: string
}

/**
 * Campo di testo con etichetta, suggerimento ed errore collegati in modo accessibile.
 */
export function TextField({
  label,
  hint,
  error,
  id,
  className = '',
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`

  // Il lettore di schermo legge suggerimento ed errore insieme al campo
  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-medium text-neutral-900">
        {label}
      </label>

      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={[
          'rounded-sm border bg-white px-3 py-2.5 text-neutral-900 transition',
          'placeholder:text-neutral-400 focus:outline-2 focus:outline-offset-0',
          error
            ? 'border-errore focus:outline-errore'
            : 'border-neutral-300 focus:outline-neutral-900',
        ].join(' ')}
        {...props}
      />

      {hint && !error && (
        <p id={hintId} className="text-sm text-neutral-500">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="text-errore flex items-center gap-1.5 text-sm"
        >
          <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

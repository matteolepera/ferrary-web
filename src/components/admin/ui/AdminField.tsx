import { type ComponentProps, type ReactNode } from 'react'
import { FieldMessages } from './FieldMessages'
import { useFieldA11y } from './useFieldA11y'

type AdminFieldProps = ComponentProps<'input'> & {
  label: string
  /** Suggerimento sotto il campo */
  hint?: string
  /** Messaggio d'errore: se presente, il campo risulta non valido */
  error?: string
  /** Icona decorativa a sinistra, dentro il campo */
  icon?: ReactNode
  /** Un elemento a destra, dentro il campo: ad esempio il pulsante per mostrare la password */
  trailing?: ReactNode
}

/**
 * Campo dell'area admin: arrotondato, con icona, come la ricerca del pannello.
 * Etichetta, suggerimento ed errore sono collegati al campo come nel TextField del sito.
 */
export function AdminField({
  label,
  hint,
  error,
  icon,
  trailing,
  id,
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
      <label
        htmlFor={fieldId}
        className="mb-2 block text-[0.6875rem] font-semibold tracking-[0.18em] text-neutral-400 uppercase"
      >
        {label}
      </label>

      <div
        className={[
          'bg-notte flex h-13 items-center gap-2.5 rounded-2xl border px-4 transition-colors',
          // Il focus si vede sul bordo dell'intero campo, icona compresa
          'focus-within:border-neutral-300',
          error ? 'border-errore' : 'border-white/10',
        ].join(' ')}
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
          className="h-full min-w-0 flex-1 bg-transparent text-[0.9375rem] text-neutral-100 outline-none placeholder:text-neutral-600"
          {...props}
        />
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

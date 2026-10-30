import { useId, type ComponentProps, type ReactNode } from 'react'

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
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-suggerimento`
  const errorId = `${inputId}-errore`
  // I testi che il lettore di schermo legge insieme al campo
  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
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
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="h-full min-w-0 flex-1 bg-transparent text-[0.9375rem] text-neutral-100 outline-none placeholder:text-neutral-600"
          {...props}
        />
        {trailing}
      </div>

      {hint && (
        <p id={hintId} className="mt-2 text-[0.8125rem] text-neutral-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-errore mt-2 text-[0.8125rem]">
          {error}
        </p>
      )}
    </div>
  )
}

type FieldLabelProps = {
  htmlFor: string
  label: string
  /** L'unità di misura: non si vede nell'etichetta (sta dentro il campo), ma il lettore di schermo la legge */
  unit?: string
  required?: boolean
  optional?: boolean
}

/**
 * L'etichetta dei campi dell'admin: leggibile, con l'asterisco rosso se il campo è obbligatorio
 * o "facoltativo" se conviene dirlo. Asterisco e "facoltativo" stanno fuori dal <label>:
 * il nome del campo resta pulito ("Nome", non "Nome *"), e l'obbligo lo dice aria-required.
 */
export function FieldLabel({
  htmlFor,
  label,
  unit,
  required,
  optional,
}: FieldLabelProps) {
  return (
    <div className="mb-2 flex items-baseline gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[0.8125rem] font-semibold text-neutral-200"
      >
        {label}
        {unit && <span className="sr-only"> ({unit})</span>}
      </label>
      {required && (
        <span aria-hidden="true" className="text-rosso-acceso font-semibold">
          *
        </span>
      )}
      {optional && (
        <span className="text-xs text-neutral-500">· facoltativo</span>
      )}
    </div>
  )
}

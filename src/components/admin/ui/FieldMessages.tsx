type FieldMessagesProps = {
  hint?: string
  error?: string
  hintId: string
  errorId: string
}

/** Il suggerimento e l'errore sotto un campo, con gli id che il campo usa in aria-describedby */
export function FieldMessages({
  hint,
  error,
  hintId,
  errorId,
}: FieldMessagesProps) {
  return (
    <>
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
    </>
  )
}

const regions = new Intl.DisplayNames('it', { type: 'region' })

/**
 * Il nome di un paese dal suo codice di due lettere: "IT" diventa "Italia".
 * Un codice che non esiste resta com'è, invece di far fallire la pagina.
 */
export function countryName(code: string | null | undefined) {
  if (!code || code.length !== 2) return null

  try {
    return regions.of(code.toUpperCase()) ?? code
  } catch {
    return code
  }
}

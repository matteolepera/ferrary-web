/**
 * Formatta un numero secondo la lingua del sito: "2,5" in italiano, "2.5" in inglese.
 */
export function formatNumber(value: number, language: string, maxDecimals = 0) {
  return new Intl.NumberFormat(language, {
    maximumFractionDigits: maxDecimals,
  }).format(value)
}

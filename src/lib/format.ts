/**
 * Formatta un numero secondo la lingua del sito: "2,5" in italiano, "2.5" in inglese.
 */
export function formatNumber(value: number, language: string, maxDecimals = 0) {
  return new Intl.NumberFormat(language, {
    maximumFractionDigits: maxDecimals,
  }).format(value)
}

/**
 * Un tempo sul giro in secondi, nel formato dei cronometri: 79 → "1:19", 79.5 → "1:19,5".
 */
export function formatLap(seconds: number, language: string) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds - minutes * 60

  // I secondi sotto il 10 hanno lo zero davanti, come sui cronometri: 1:05
  return `${minutes}:${rest < 10 ? '0' : ''}${formatNumber(rest, language, 3)}`
}

/**
 * Una data AAAA-MM-GG nel formato della lingua: "3 gennaio 1969", "January 3, 1969".
 */
export function formatDate(isoDate: string, language: string) {
  return new Intl.DateTimeFormat(language, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    // La data non ha un orario: senza fuso fisso, in alcuni paesi diventerebbe il giorno prima
    timeZone: 'UTC',
  }).format(new Date(isoDate))
}

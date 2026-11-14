import type { Version } from '@/types/catalog'

/**
 * Gli anni coperti da un gruppo di Ferrari: "1984–1988", oppure "1970" se è uno solo.
 * Una versione ancora in produzione arriva fino a quest'anno.
 * Sono gli anni delle auto: il catalogo non sa le stagioni di ogni pilota.
 */
export function yearsSpan(versions: Version[]): string | null {
  if (versions.length === 0) return null

  const thisYear = new Date().getFullYear()
  const start = Math.min(...versions.map((version) => version.years.start))
  const end = Math.max(
    ...versions.map(({ years }) =>
      years.in_production ? thisYear : (years.end ?? years.start),
    ),
  )

  return end > start ? `${start}–${end}` : String(start)
}

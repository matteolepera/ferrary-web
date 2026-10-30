const relative = new Intl.RelativeTimeFormat('it', { numeric: 'auto' })
const shortDate = new Intl.DateTimeFormat('it', {
  day: 'numeric',
  month: 'short',
})

/**
 * Da quanto tempo, in parole: "adesso", "12 minuti fa", "ieri", "3 giorni fa".
 * Oltre una settimana, la data: "il 19 ott".
 */
export function timeAgo(isoDate: string, now = new Date()) {
  const date = new Date(isoDate)
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000)
  const elapsed = Math.abs(seconds)

  if (elapsed < 60) return 'adesso'
  if (elapsed < 3600) return relative.format(Math.round(seconds / 60), 'minute')
  if (elapsed < 86_400)
    return relative.format(Math.round(seconds / 3600), 'hour')
  if (elapsed < 7 * 86_400)
    return relative.format(Math.round(seconds / 86_400), 'day')

  return `il ${shortDate.format(date)}`
}

const longDate = new Intl.DateTimeFormat('it', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/**
 * Una data senza ora, come una data di nascita: "1997-10-16" diventa "16 ottobre 1997".
 * In UTC, perché la data non deve spostarsi di un giorno nei fusi a ovest di Greenwich.
 */
export function birthDate(isoDate: string | null) {
  return isoDate ? longDate.format(new Date(isoDate)) : null
}

/** Oggi, nel formato del campo date: "2026-10-30". Serve come limite massimo */
export function todayInput() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000

  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

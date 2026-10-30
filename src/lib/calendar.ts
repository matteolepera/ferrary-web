/**
 * Piccoli calcoli sui giorni, nel fuso orario di chi guarda.
 * Le settimane iniziano di lunedì, come in Italia.
 */

/** Il lunedì della settimana di una data, a mezzanotte */
export function startOfWeek(date: Date) {
  const monday = new Date(date)
  monday.setHours(0, 0, 0, 0)
  // getDay() conta da domenica (0): (giorno + 6) % 7 dice quanti giorni sono passati da lunedì
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))

  return monday
}

export function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)

  return result
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

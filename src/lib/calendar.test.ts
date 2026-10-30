import { addDays, startOfWeek } from '@/lib/calendar'

test('le settimane iniziano di lunedì, anche partendo da una domenica', () => {
  // Domenica 1 novembre 2026: il lunedì della sua settimana è il 26 ottobre
  expect(startOfWeek(new Date(2026, 10, 1, 15)).toDateString()).toBe(
    new Date(2026, 9, 26).toDateString(),
  )
  // E aggiungere giorni attraversa il mese da solo
  expect(addDays(new Date(2026, 9, 30), 3).getDate()).toBe(2)
})

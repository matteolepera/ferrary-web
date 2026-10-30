import { timeAgo } from '@/lib/timeAgo'

test('dice da quanto tempo, in parole', () => {
  const now = new Date('2026-10-29T18:00:00Z')

  expect(timeAgo('2026-10-29T17:59:40Z', now)).toBe('adesso')
  expect(timeAgo('2026-10-29T15:00:00Z', now)).toBe('3 ore fa')
  expect(timeAgo('2026-10-28T12:00:00Z', now)).toBe('ieri')
  expect(timeAgo('2026-10-10T12:00:00Z', now)).toBe('il 10 ott')
})

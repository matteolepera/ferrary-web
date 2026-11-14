import { yearsSpan } from '@/components/catalog/yearsSpan'
import type { Version } from '@/types/catalog'

/** Una versione ridotta agli anni: è l'unica cosa che yearsSpan guarda */
const at = (start: number, end: number | null, in_production = false) =>
  ({ years: { start, end, in_production } }) as Version

afterEach(() => {
  vi.useRealTimers()
})

test("va dalla prima Ferrari all'ultima", () => {
  expect(yearsSpan([at(1986, 1986), at(1984, 1985), at(1988, null)])).toBe(
    '1984–1988',
  )
})

test('un anno solo resta un anno', () => {
  expect(yearsSpan([at(1970, 1970), at(1970, null)])).toBe('1970')
})

test("una Ferrari ancora in produzione arriva fino a quest'anno", () => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-14'))

  expect(yearsSpan([at(2019, null, true)])).toBe('2019–2026')
})

test('senza Ferrari non ci sono anni', () => {
  expect(yearsSpan([])).toBeNull()
})

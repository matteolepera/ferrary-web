import { countryName } from '@/lib/format'

test('con un codice di due lettere che non esiste restituisce il codice', () => {
  expect(countryName('QQ', 'it')).toBe('QQ')
})

test('senza codice, o con un codice scritto a metà, non restituisce niente', () => {
  expect(countryName(null)).toBeNull()
  expect(countryName('')).toBeNull()
  expect(countryName('I')).toBeNull()
  expect(countryName('XYZ', 'it')).toBeNull()
})

test("senza lingua scrive in italiano, come nell'admin", () => {
  expect(countryName('DE')).toBe('Germania')
})

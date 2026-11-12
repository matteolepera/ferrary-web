import { countryName } from '@/lib/format'

test('scrive il nome del Paese nella lingua del sito', () => {
  expect(countryName('CA', 'it')).toBe('Canada')
  expect(countryName('FR', 'it')).toBe('Francia')
  expect(countryName('FR', 'en')).toBe('France')
})

test('con un codice non valido restituisce il codice', () => {
  expect(countryName('XYZ', 'it')).toBe('XYZ')
})

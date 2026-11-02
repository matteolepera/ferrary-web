import { fieldLabel, formatValue } from '@/components/admin/activity/changes'

test('rende leggibili i valori del registro', () => {
  expect(fieldLabel('published_at')).toBe('Data di pubblicazione')
  expect(fieldLabel('campo_nuovo')).toBe('campo_nuovo')

  expect(formatValue('published_at', null)).toBe('—')
  expect(formatValue('in_production', true)).toBe('Sì')
  expect(formatValue('role', 'moderator')).toBe('Moderatore')
  expect(
    formatValue('description', { it: 'Berlinetta', en: 'Berlinetta' }),
  ).toBe('IT: Berlinetta · EN: Berlinetta')
  expect(formatValue('published_at', '2030-01-15T09:30:00Z')).toMatch(
    /^15 gennaio 2030/,
  )
})

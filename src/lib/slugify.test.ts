import { slugify } from '@/lib/slugify'

test('trasforma un nome in slug, come il backend', () => {
  expect(slugify('SF90 Stradale')).toBe('sf90-stradale')
  expect(slugify('  Enzo Ferrari è  ')).toBe('enzo-ferrari-e')
  expect(slugify('812 Competizione A')).toBe('812-competizione-a')
  expect(slugify('F12tdf / Spider')).toBe('f12tdf-spider')
})

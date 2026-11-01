import { specsValues, toSpecsPayload } from '@/components/admin/versions/specs'
import { adminVersions } from '@/test/fixtures'

test('dalla scheda tecnica salvata al form, e ritorno, e niente se è tutto vuoto', () => {
  const values = specsValues(adminVersions[0].specs)

  expect(values.length_mm).toBe('4710')
  expect(toSpecsPayload(values)).toMatchObject({
    length_mm: 4710,
    zero_to_100_sec: 2.5,
    brakes: 'carboceramici',
  })
  expect(toSpecsPayload(specsValues(null))).toBeNull()
})

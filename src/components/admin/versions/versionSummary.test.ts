import { sectionSummary } from './versionSummary'
import { adminVersions } from '@/test/fixtures'

const sf90 = adminVersions[0]

test('i numeri hanno la loro unità, i dati mancanti restano vuoti', () => {
  const items = sectionSummary('scheda', {
    ...sf90,
    specs: { ...sf90.specs!, zero_to_200_sec: null },
  })

  expect(items).toContainEqual({ label: 'Lunghezza', value: '4710 mm' })
  expect(items).toContainEqual({ label: '0-200 km/h', value: null })
})

test('senza motorizzazione non ci sono dati da leggere', () => {
  expect(
    sectionSummary('motorizzazione', { ...sf90, powertrain: null }),
  ).toEqual([])
})

import {
  powertrainKind,
  powertrainValues,
  toPowertrainPayload,
} from '@/components/admin/versions/powertrain'
import { adminVersions } from '@/test/fixtures'

test('dalla motorizzazione salvata al form, e ritorno', () => {
  const values = powertrainValues(adminVersions[0].powertrain)

  expect(values.engine_id).toBe('1')
  expect(powertrainKind(values)).toBe('Ibrido')
  expect(toPowertrainPayload(values)).toMatchObject({
    engine_id: 1,
    battery_kwh: 7.9,
    gearbox_type: 'doppia_frizione',
  })
})

test("senza motore i dati termici si svuotano, e senza niente la motorizzazione non c'è", () => {
  const values = {
    ...powertrainValues(adminVersions[0].powertrain),
    engine_id: '',
  }

  expect(powertrainKind(values)).toBe('Elettrico')
  expect(toPowertrainPayload(values)).toMatchObject({
    engine_id: null,
    ice_power_cv: null,
    electric_power_cv: 220,
  })
  expect(toPowertrainPayload(powertrainValues(null))).toBeNull()
})

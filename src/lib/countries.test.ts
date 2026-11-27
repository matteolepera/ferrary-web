import { countryOptions } from './countries'

test('i paesi una volta sola, per nome, senza i vuoti', () => {
  expect(countryOptions(['IT', 'DE', null, 'IT'])).toEqual([
    { value: 'DE', label: 'Germania' },
    { value: 'IT', label: 'Italia' },
  ])
})

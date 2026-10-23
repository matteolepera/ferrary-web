import { api } from '@/api/client'

test('il client è configurato per Sanctum', () => {
  expect(api.defaults.baseURL).toBe('http://localhost:8000/api')
  expect(api.defaults.withCredentials).toBe(true)
  expect(api.defaults.withXSRFToken).toBe(true)
  expect(api.defaults.headers.Accept).toBe('application/json')
})

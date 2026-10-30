import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { useDashboard } from '@/hooks/useDashboard'
import { i18n } from '@/i18n'
import { dashboard } from '@/test/fixtures'
import { server } from '@/test/server'
import { createQueryWrapper } from '@/test/utils'

afterEach(async () => {
  await i18n.changeLanguage('it')
})

test('carica i dati del pannello', async () => {
  const { wrapper } = createQueryWrapper()
  const { result } = renderHook(() => useDashboard(), { wrapper })

  await waitFor(() => expect(result.current.data).toEqual(dashboard))
})

test("chiede i dati in italiano anche se il sito è in un'altra lingua", async () => {
  let language: string | null = null
  server.use(
    http.get('http://localhost:8000/api/admin/dashboard', ({ request }) => {
      language = request.headers.get('Accept-Language')
      return HttpResponse.json({ data: dashboard })
    }),
  )
  await i18n.changeLanguage('en')

  const { wrapper } = createQueryWrapper()
  const { result } = renderHook(() => useDashboard(), { wrapper })

  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(language).toBe('it')
})

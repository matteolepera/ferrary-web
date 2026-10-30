import { act, renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { useCurrentUser, useLogin, useLogout } from '@/hooks/useAuth'
import { STAFF_PASSWORD, staffUser } from '@/test/fixtures'
import { server } from '@/test/server'
import { createQueryWrapper } from '@/test/utils'

test('senza sessione, nessun utente è collegato', async () => {
  const { wrapper } = createQueryWrapper()
  const { result } = renderHook(() => useCurrentUser(), { wrapper })

  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(result.current.data).toBeNull()
})

test("il login chiede prima il cookie CSRF e poi salva l'utente nella cache", async () => {
  const calls: string[] = []
  server.events.on('request:start', ({ request }) =>
    calls.push(new URL(request.url).pathname),
  )

  const { wrapper } = createQueryWrapper()
  // Due hook nella stessa cache: il login e la domanda "chi è collegato?"
  const { result } = renderHook(
    () => ({ login: useLogin(), user: useCurrentUser() }),
    { wrapper },
  )
  await act(() =>
    result.current.login.mutateAsync({
      email: staffUser.email,
      password: STAFF_PASSWORD,
    }),
  )

  expect(calls.indexOf('/sanctum/csrf-cookie')).toBeLessThan(
    calls.indexOf('/api/login'),
  )
  await waitFor(() => expect(result.current.user.data).toEqual(staffUser))
  expect(calls.indexOf('/sanctum/csrf-cookie')).toBeLessThan(
    calls.indexOf('/api/login'),
  )
  expect(result.current.user.data).toEqual(staffUser)

  server.events.removeAllListeners()
})

test("il logout toglie l'utente e i dati dell'area admin dalla cache", async () => {
  server.use(
    http.get('http://localhost:8000/api/me', () =>
      HttpResponse.json({ data: staffUser }),
    ),
  )

  const { queryClient, wrapper } = createQueryWrapper()
  queryClient.setQueryData(['admin', 'models'], { riservato: true })

  const { result } = renderHook(
    () => ({ logout: useLogout(), user: useCurrentUser() }),
    { wrapper },
  )
  await waitFor(() => expect(result.current.user.data).toEqual(staffUser))

  await act(() => result.current.logout.mutateAsync())

  // La cache cambia subito, ma l'hook riceve la notifica un istante dopo
  await waitFor(() => expect(result.current.user.data).toBeNull())
  expect(queryClient.getQueryData(['admin', 'models'])).toBeUndefined()
})

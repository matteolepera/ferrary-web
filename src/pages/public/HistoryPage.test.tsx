import { fireEvent, screen, waitFor, within, act } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { f40, modelsPage, sf90 } from '@/test/fixtures'
import { server } from '@/test/server'
import { renderRoute } from '@/test/utils'

/** Due pagine: prima la F40, poi la SF90 */
function useTwoPages() {
  server.use(
    http.get('http://localhost:8000/api/models', ({ request }) => {
      const page = Number(new URL(request.url).searchParams.get('page') ?? 1)
      const meta = {
        ...modelsPage.meta,
        current_page: page,
        last_page: 2,
        total: 2,
      }

      return HttpResponse.json({
        ...modelsPage,
        data: page === 1 ? [f40] : [sf90],
        meta,
      })
    }),
  )
}

test('raggruppa le Ferrari per decennio, in ordine di anno', async () => {
  const received = { params: new URLSearchParams() }

  server.use(
    http.get('http://localhost:8000/api/models', ({ request }) => {
      received.params = new URL(request.url).searchParams

      return HttpResponse.json(modelsPage)
    }),
  )

  renderRoute('/storia')

  const eighties = within(
    await screen.findByRole('region', { name: "Anni '80" }),
  )
  expect(eighties.getByRole('link', { name: /F40/ })).toHaveAttribute(
    'href',
    '/modelli/f40',
  )

  const twentyTens = within(screen.getByRole('region', { name: 'Anni 2010' }))
  expect(
    twentyTens.getByRole('link', { name: /SF90 Stradale/ }),
  ).toBeInTheDocument()

  expect(received.params.get('sort')).toBe('year')
})

test('carica le pagine successive in coda', async () => {
  useTwoPages()

  renderRoute('/storia')

  expect(await screen.findByRole('link', { name: /F40/ })).toBeInTheDocument()
  expect(
    screen.queryByRole('link', { name: /SF90 Stradale/ }),
  ).not.toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Carica altre Ferrari' }))

  // La seconda pagina si aggiunge alla prima, senza sostituirla
  expect(
    await screen.findByRole('link', { name: /SF90 Stradale/ }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /F40/ })).toBeInTheDocument()

  // Arrivati all'ultima pagina, il pulsante sparisce
  await waitFor(() =>
    expect(
      screen.queryByRole('button', { name: 'Carica altre Ferrari' }),
    ).not.toBeInTheDocument(),
  )
})

test('carica da sola la pagina successiva, arrivando in fondo', async () => {
  // Un osservatore finto che ci lascia decidere quando la sentinella "diventa visibile"
  const observer = {
    notify: undefined as IntersectionObserverCallback | undefined,
  }
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback) {
        observer.notify = callback
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    },
  )
  useTwoPages()

  renderRoute('/storia')
  await screen.findByRole('link', { name: /F40/ })

  // Simuliamo l'arrivo in fondo alla pagina
  act(() =>
    observer.notify?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ),
  )

  expect(
    await screen.findByRole('link', { name: /SF90 Stradale/ }),
  ).toBeInTheDocument()

  vi.unstubAllGlobals()
})

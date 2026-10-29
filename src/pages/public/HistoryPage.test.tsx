import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { f40, modelsPage, sf90 } from '@/test/fixtures'
import { server } from '@/test/server'
import { renderRoute } from '@/test/utils'

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
  server.use(
    http.get('http://localhost:8000/api/models', ({ request }) => {
      const page = Number(new URL(request.url).searchParams.get('page') ?? 1)
      const meta = {
        ...modelsPage.meta,
        current_page: page,
        last_page: 2,
        total: 2,
      }

      // Prima pagina la F40, seconda la SF90
      return HttpResponse.json({
        ...modelsPage,
        data: page === 1 ? [f40] : [sf90],
        meta,
      })
    }),
  )

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

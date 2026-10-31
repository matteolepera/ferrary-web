import { screen, within, fireEvent, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('elenca i modelli con famiglia, versioni e stato', async () => {
  signIn()
  renderRoute('/admin/modelli')

  const row = within(await screen.findByRole('row', { name: /SF90 Stradale/ }))
  expect(row.getByText('Sportive')).toBeInTheDocument()
  expect(row.getByText('Pubblicato')).toBeInTheDocument()
  expect(row.getByRole('link', { name: 'SF90 Stradale' })).toHaveAttribute(
    'href',
    '/admin/modelli/2',
  )
  expect(screen.getByText('2 modelli')).toBeInTheDocument()
})

test("filtra per stato dall'indirizzo, come dai pulsanti del pannello", async () => {
  signIn()
  renderRoute('/admin/modelli?status=scheduled')

  expect(await screen.findByRole('row', { name: /F80/ })).toBeInTheDocument()
  expect(
    screen.queryByRole('row', { name: /SF90 Stradale/ }),
  ).not.toBeInTheDocument()
  expect(screen.getByText('Programmato')).toBeInTheDocument()
})

test('dice quando non ci sono modelli con quei filtri', async () => {
  server.use(
    http.get('http://localhost:8000/api/admin/models', () =>
      HttpResponse.json({
        data: [],
        meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 },
        links: {},
      }),
    ),
  )
  signIn()
  renderRoute('/admin/modelli?status=draft')

  expect(
    await screen.findByText('Nessun modello con questi filtri.'),
  ).toBeInTheDocument()
})

test('le pillole filtrano per stato', async () => {
  signIn()
  renderRoute('/admin/modelli')
  await screen.findByRole('row', { name: /SF90 Stradale/ })

  fireEvent.click(screen.getByRole('button', { name: 'Programmati' }))

  expect(
    await screen.findByRole('button', { name: 'Programmati' }),
  ).toHaveAttribute('aria-pressed', 'true')
  await waitFor(() =>
    expect(
      screen.queryByRole('row', { name: /SF90 Stradale/ }),
    ).not.toBeInTheDocument(),
  )
  expect(screen.getByRole('row', { name: /F80/ })).toBeInTheDocument()
})

test('il menu filtra per famiglia', async () => {
  signIn()
  renderRoute('/admin/modelli')
  // Le famiglie arrivano con una richiesta a parte: aspettiamo che il menu le abbia
  await screen.findByRole('option', { name: 'Hypercar' })

  fireEvent.change(screen.getByLabelText('Famiglia'), {
    target: { value: '3' },
  })

  await waitFor(() =>
    expect(
      screen.queryByRole('row', { name: /SF90 Stradale/ }),
    ).not.toBeInTheDocument(),
  )
  expect(screen.getByRole('row', { name: /F80/ })).toBeInTheDocument()
})

test('la ricerca aggiorna i risultati mentre si scrive', async () => {
  signIn()
  renderRoute('/admin/modelli')
  await screen.findByRole('row', { name: /SF90 Stradale/ })

  fireEvent.change(screen.getByLabelText('Cerca un modello'), {
    target: { value: 'f80' },
  })

  await waitFor(() =>
    expect(
      screen.queryByRole('row', { name: /SF90 Stradale/ }),
    ).not.toBeInTheDocument(),
  )
  expect(screen.getByRole('row', { name: /F80/ })).toBeInTheDocument()
})

test('passa alla pagina successiva', async () => {
  let requestedPage: string | null = null
  server.use(
    http.get('http://localhost:8000/api/admin/models', ({ request }) => {
      requestedPage = new URL(request.url).searchParams.get('page')
      return HttpResponse.json({
        data: [],
        meta: {
          current_page: Number(requestedPage ?? 1),
          last_page: 3,
          per_page: 20,
          total: 45,
        },
        links: {},
      })
    }),
  )
  signIn()
  renderRoute('/admin/modelli')

  expect(await screen.findByText('Pagina 1 di 3')).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: 'Pagina precedente' }),
  ).toBeDisabled()

  fireEvent.click(screen.getByRole('button', { name: 'Pagina successiva' }))

  expect(await screen.findByText('Pagina 2 di 3')).toBeInTheDocument()
  expect(requestedPage).toBe('2')
})

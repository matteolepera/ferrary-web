import { screen, within } from '@testing-library/react'
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

import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { dashboard } from '@/test/fixtures'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('saluta lo staff e riassume cosa lo aspetta', async () => {
  signIn()
  renderRoute('/admin')

  const banner = within(
    await screen.findByRole('region', { name: 'Il catalogo ti aspetta.' }),
  )
  expect(banner.getByText('Bentornato, Matteo')).toBeInTheDocument()
  expect(
    banner.getByText(
      '3 bozze sono pronte per la revisione e 2 pubblicazioni sono in programma.',
    ),
  ).toBeInTheDocument()
  expect(banner.getByRole('link', { name: 'Rivedi le bozze' })).toHaveAttribute(
    'href',
    '/admin/modelli?status=draft',
  )
})

test('mostra i quattro numeri del catalogo, con le forme al singolare', async () => {
  server.use(
    http.get('http://localhost:8000/api/admin/dashboard', () =>
      HttpResponse.json({
        data: {
          ...dashboard,
          counts: { published: 24, drafts: 1, scheduled: 0, trashed: 1 },
        },
      }),
    ),
  )
  signIn()
  renderRoute('/admin')

  expect(
    within(await screen.findByRole('region', { name: 'Pubblicati' })).getByText(
      '24',
    ),
  ).toBeInTheDocument()
  expect(
    within(screen.getByRole('region', { name: 'Bozze' })).getByText('1'),
  ).toBeInTheDocument()
  expect(
    screen.getByText('1 bozza è pronta per la revisione.'),
  ).toBeInTheDocument()
})

test('se il server non risponde, propone di riprovare', async () => {
  server.use(
    http.get(
      'http://localhost:8000/api/admin/dashboard',
      () => new HttpResponse(null, { status: 500 }),
    ),
  )
  signIn()
  renderRoute('/admin')

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Impossibile caricare il pannello',
  )
  expect(screen.getByRole('button', { name: 'Riprova' })).toBeInTheDocument()
})

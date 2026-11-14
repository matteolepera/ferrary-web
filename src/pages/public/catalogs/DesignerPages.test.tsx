import { fireEvent, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { designers } from '@/test/fixtures'
import { server } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('elenca i designer con il tipo e il numero di Ferrari', async () => {
  renderRoute('/designer')

  const link = await screen.findByRole('link', { name: /Centro Stile Ferrari/ })

  expect(link).toHaveAttribute('href', '/designer/centro-stile-ferrari')
  expect(link).toHaveTextContent('Studio')
  expect(link).toHaveTextContent('Italia')
  expect(link).toHaveTextContent('3 Ferrari')
})

test('mostra le Ferrari di un designer, con il link alla versione esatta', async () => {
  renderRoute('/designer/flavio-manzoni')

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Flavio Manzoni' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /SF90 Stradale/ })).toHaveAttribute(
    'href',
    '/modelli/sf90-stradale?versione=sf90-stradale',
  )
})

test('un designer che non esiste mostra il "non trovato"', async () => {
  renderRoute('/designer/inventato')

  expect(
    await screen.findByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
})

test("se l'elenco non arriva, permette di riprovare", async () => {
  const calls = { count: 0 }

  // La prima richiesta fallisce, la seconda va a buon fine
  server.use(
    http.get('http://localhost:8000/api/designers', () => {
      calls.count += 1

      return calls.count === 1
        ? new HttpResponse(null, { status: 500 })
        : HttpResponse.json({ data: designers })
    }),
  )

  renderRoute('/designer')

  fireEvent.click(await screen.findByRole('button', { name: 'Riprova' }))

  expect(
    await screen.findByRole('link', { name: /Centro Stile Ferrari/ }),
  ).toBeInTheDocument()
})

test('filtra i designer per tipo', async () => {
  server.use(
    http.get('http://localhost:8000/api/designers', () =>
      HttpResponse.json({
        data: [
          {
            id: 1,
            name: 'Pininfarina',
            slug: 'pininfarina',
            type: 'studio',
            country: 'IT',
            versions_count: 40,
          },
          {
            id: 2,
            name: 'Flavio Manzoni',
            slug: 'flavio-manzoni',
            type: 'persona',
            country: 'IT',
            versions_count: 12,
          },
        ],
      }),
    ),
  )

  renderRoute('/designer')
  expect(
    await screen.findByRole('link', { name: /Pininfarina/ }),
  ).toBeInTheDocument()

  fireEvent.click(
    within(screen.getByRole('group', { name: 'Tipo' })).getByRole('button', {
      name: 'Designer',
    }),
  )

  expect(
    screen.getByRole('link', { name: /Flavio Manzoni/ }),
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('link', { name: /Pininfarina/ }),
  ).not.toBeInTheDocument()
})

test('un designer ha i dati brevi sotto il nome, senza la fascia', async () => {
  renderRoute('/designer/flavio-manzoni')

  const works = await screen.findByText('Ferrari disegnate')

  expect(works.nextSibling).toHaveTextContent('1')
  expect(screen.getByText('Anni').nextSibling).toHaveTextContent('2019')
  // La fascia grande resta solo al motore
  expect(
    screen.queryByRole('region', { name: 'In breve' }),
  ).not.toBeInTheDocument()
})

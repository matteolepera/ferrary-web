import { fireEvent, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { designers } from '@/test/fixtures'
import { server } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('elenca i designer con il tipo e il numero di Ferrari', async () => {
  renderRoute('/designer')

  const link = await screen.findByRole('link', { name: /Centro Stile Ferrari/ })

  expect(link).toHaveAttribute('href', '/designer/centro-stile-ferrari')
  expect(link).toHaveTextContent('Studio · Italia · 3 Ferrari')
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

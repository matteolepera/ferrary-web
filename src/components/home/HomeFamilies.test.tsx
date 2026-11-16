import { fireEvent, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { renderRoute } from '@/test/utils'

/** La sezione delle famiglie: lì ogni famiglia compare una volta sola (il piè di pagina ha link simili) */
const familiesSection = () =>
  within(screen.getByRole('region', { name: /Tutte le famiglie/ }))

test("ogni famiglia porta all'archivio filtrato, con quanti modelli ha", async () => {
  renderRoute('/')

  const link = await familiesSection().findByRole('link', { name: /Stradali/ })

  expect(link).toHaveAttribute('href', '/modelli?category=stradali')
  expect(link).toHaveTextContent('12 modelli')
})

test('usa il singolare quando la famiglia ha un solo modello', async () => {
  renderRoute('/')

  expect(
    await familiesSection().findByRole('link', { name: /Hypercar/ }),
  ).toHaveTextContent('1 modello')
})

test('le famiglie sono divise per gruppo, ognuno con la sua targa', async () => {
  renderRoute('/')

  // Le famiglie di prova non sono tra quelle dell'archivio vero: finiscono nel gruppo "Altre"
  const group = await familiesSection().findByRole('group', { name: 'Altre' })

  expect(within(group).getByRole('link', { name: /Hypercar/ })).toHaveAttribute(
    'href',
    '/modelli?category=hypercar',
  )
})
test("la barra porta da un gruppo all'altro", async () => {
  server.use(
    http.get('http://localhost:8000/api/categories', () =>
      HttpResponse.json({
        data: [
          { id: 1, name: 'Sportive', slug: 'sportive', models_count: 4 },
          { id: 2, name: 'Formula 1', slug: 'formula-1', models_count: 9 },
        ],
      }),
    ),
  )

  renderRoute('/')

  const bar = within(
    await screen.findByRole('group', { name: 'Gruppi di famiglie' }),
  )

  // All'inizio è acceso il primo gruppo
  expect(bar.getByRole('button', { name: 'Stradali' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  fireEvent.click(bar.getByRole('button', { name: 'Corsa' }))

  expect(bar.getByRole('button', { name: 'Corsa' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

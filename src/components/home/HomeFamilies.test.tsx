import { screen, within } from '@testing-library/react'
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

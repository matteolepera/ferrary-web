import { screen, within } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

/** La sezione delle famiglie: lì ogni famiglia compare una volta sola */
const familiesSection = () =>
  within(screen.getByRole('region', { name: 'Da dove vuoi partire?' }))

test("porta all'archivio filtrato per famiglia", async () => {
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

import { screen } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

test("porta all'archivio filtrato per famiglia", async () => {
  renderRoute('/')

  const link = await screen.findByRole('link', { name: /Stradali/ })

  expect(link).toHaveAttribute('href', '/modelli?category=stradali')
  expect(link).toHaveTextContent('12 modelli')
})

test('usa il singolare quando la famiglia ha un solo modello', async () => {
  renderRoute('/')

  expect(
    await screen.findByRole('link', { name: /Hypercar/ }),
  ).toHaveTextContent('1 modello')
})

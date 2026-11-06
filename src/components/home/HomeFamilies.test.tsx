import { screen, within, fireEvent } from '@testing-library/react'
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

/** La foto sullo sfondo: viene prima delle fasce nell'HTML, quindi è la prima con quel nome */
const backgroundPhoto = (name: string) =>
  document.querySelector(`img[src$="${name}.jpg"]`)

test('lo sfondo segue la famiglia sotto il mouse o raggiunta con la tastiera', async () => {
  renderRoute('/')

  // I link delle famiglie, solo nella loro sezione: il piè di pagina ha link con gli stessi nomi
  const families = within(
    await screen.findByRole('region', { name: 'Da dove vuoi partire?' }),
  )
  const hypercar = await families.findByRole('link', { name: /^Hypercar/ })
  // All'inizio, la prima famiglia, con la sua didascalia
  expect(backgroundPhoto('stradali')).toHaveClass('opacity-100')
  expect(screen.getByText('Una stradale, vista frontale')).toBeInTheDocument()

  fireEvent.mouseEnter(hypercar)
  expect(backgroundPhoto('hypercar')).toHaveClass('opacity-100')
  expect(backgroundPhoto('stradali')).toHaveClass('opacity-0')
  expect(screen.getByText('Una hypercar, vista laterale')).toBeInTheDocument()

  fireEvent.focus(families.getByRole('link', { name: /^Stradali/ }))
  expect(backgroundPhoto('stradali')).toHaveClass('opacity-100')
})

test('ogni famiglia porta al suo archivio', async () => {
  renderRoute('/')

  const families = within(
    await screen.findByRole('region', { name: 'Da dove vuoi partire?' }),
  )
  expect(
    await families.findByRole('link', { name: /^Hypercar/ }),
  ).toHaveAttribute('href', '/modelli?category=hypercar')
})

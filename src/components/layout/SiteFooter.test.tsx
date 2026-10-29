import { screen, within } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

/** Il piè di pagina, quando la pagina è arrivata */
const footer = async () => within(await screen.findByRole('contentinfo'))

test("elenca le famiglie dell'API con i link all'archivio filtrato", async () => {
  renderRoute('/modelli')

  expect(
    await (await footer()).findByRole('link', { name: 'Stradali' }),
  ).toHaveAttribute('href', '/modelli?category=stradali')
})

test('apre i link del progetto in una nuova scheda, in modo sicuro', async () => {
  renderRoute('/modelli')

  const code = (await footer()).getByRole('link', { name: /Codice del sito/ })

  expect(code).toHaveAttribute(
    'href',
    'https://github.com/matteolepera/ferrary-web',
  )
  expect(code).toHaveAttribute('target', '_blank')
  expect(code).toHaveAttribute('rel', 'noreferrer')
})

test('collega i cataloghi', async () => {
  renderRoute('/modelli')

  const catalogs = within(
    (await footer()).getByRole('navigation', { name: 'Cataloghi' }),
  )

  expect(catalogs.getByRole('link', { name: 'Motori' })).toHaveAttribute(
    'href',
    '/motori',
  )
  expect(catalogs.getByRole('link', { name: 'Designer' })).toHaveAttribute(
    'href',
    '/designer',
  )
  expect(catalogs.getByRole('link', { name: 'Piloti' })).toHaveAttribute(
    'href',
    '/piloti',
  )
})

import { screen, within } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

const footer = () => within(screen.getByRole('contentinfo'))

test("elenca le famiglie dell'API con i link all'archivio filtrato", async () => {
  renderRoute('/modelli')

  expect(
    await footer().findByRole('link', { name: 'Stradali' }),
  ).toHaveAttribute('href', '/modelli?category=stradali')
})

test('apre i link del progetto in una nuova scheda, in modo sicuro', () => {
  renderRoute('/modelli')

  const code = footer().getByRole('link', { name: /Codice del sito/ })

  expect(code).toHaveAttribute(
    'href',
    'https://github.com/matteolepera/ferrary-web',
  )
  expect(code).toHaveAttribute('target', '_blank')
  expect(code).toHaveAttribute('rel', 'noreferrer')
})

import { screen } from '@testing-library/react'
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

import { screen } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

test('elenca i piloti con la nazionalità e il numero di Ferrari', async () => {
  renderRoute('/piloti')

  const link = await screen.findByRole('link', { name: /Michael Schumacher/ })

  expect(link).toHaveAttribute('href', '/piloti/michael-schumacher')
  expect(link).toHaveTextContent('Germania · 1 Ferrari')
})

test('mostra un pilota con la data di nascita e le Ferrari guidate', async () => {
  renderRoute('/piloti/michael-schumacher')

  expect(
    await screen.findByRole('heading', {
      level: 1,
      name: 'Michael Schumacher',
    }),
  ).toBeInTheDocument()
  expect(screen.getByText('3 gennaio 1969')).toBeInTheDocument()

  const card = screen.getByRole('link', { name: /F2004/ })
  expect(card).toHaveAttribute('href', '/modelli/f2004?versione=f2004')
  expect(card).toHaveTextContent('Formula 1')
})

test('un pilota che non esiste mostra il "non trovato"', async () => {
  renderRoute('/piloti/inventato')

  expect(
    await screen.findByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
})

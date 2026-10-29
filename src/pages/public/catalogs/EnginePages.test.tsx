import { screen, within } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

test('elenca i motori con architettura, cilindrata e numero di Ferrari', async () => {
  renderRoute('/motori')

  const link = await screen.findByRole('link', { name: /F154FA/ })

  expect(link).toHaveAttribute('href', '/motori/1')
  expect(link).toHaveTextContent('V8 · 3990 cm³ · 1 Ferrari')
})

test('mostra un motore con le sue caratteristiche e le Ferrari che lo montano', async () => {
  renderRoute('/motori/1')

  expect(
    await screen.findByRole('heading', { level: 1, name: 'F154FA' }),
  ).toBeInTheDocument()
  expect(screen.getByText('V8 a 90°')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /SF90 Stradale/ })).toHaveAttribute(
    'href',
    '/modelli/sf90-stradale?versione=sf90-stradale',
  )
})

test('dalla scheda tecnica si arriva alla pagina del motore', async () => {
  renderRoute('/modelli/sf90-stradale')

  const sheet = within(
    await screen.findByRole('region', { name: 'Scheda tecnica' }),
  )

  expect(sheet.getByRole('link', { name: 'F154FA' })).toHaveAttribute(
    'href',
    '/motori/1',
  )
})

test('un motore che non esiste mostra il "non trovato"', async () => {
  renderRoute('/motori/999')

  expect(
    await screen.findByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
})

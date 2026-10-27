import { fireEvent, screen } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

test('mostra un modello con i suoi dati nel formato italiano', async () => {
  renderRoute('/')

  expect(
    await screen.findByRole('heading', { name: 'F40' }),
  ).toBeInTheDocument()
  expect(screen.getByText('478 cv')).toBeInTheDocument()
  expect(screen.getByText('4,1 s')).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: 'Scopri il modello' }),
  ).toHaveAttribute('href', '/modelli/f40')
})

test('scorre i modelli con le frecce, anche in tondo', async () => {
  renderRoute('/')
  await screen.findByRole('heading', { name: 'F40' })

  fireEvent.click(screen.getByRole('button', { name: 'Modello successivo' }))
  expect(
    screen.getByRole('heading', { name: 'SF90 Stradale' }),
  ).toBeInTheDocument()
  expect(screen.getByText('2,5 s')).toBeInTheDocument()

  // Dall'ultimo, "successivo" torna al primo
  fireEvent.click(screen.getByRole('button', { name: 'Modello successivo' }))
  expect(screen.getByRole('heading', { name: 'F40' })).toBeInTheDocument()
})

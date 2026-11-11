import { fireEvent, screen } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

test('mostra un modello con il suo nome e il link alla scheda', async () => {
  renderRoute('/')

  expect(
    await screen.findByRole('heading', { name: 'F40' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'F40' })).toHaveAttribute(
    'href',
    '/modelli/f40',
  )
  // La slide non mostra più i dati chiave: si trovano nella scheda del modello
  expect(screen.queryByText('Potenza')).not.toBeInTheDocument()
})

test('scorre i modelli con le frecce, anche in tondo', async () => {
  renderRoute('/')
  await screen.findByRole('heading', { name: 'F40' })

  fireEvent.click(screen.getByRole('button', { name: 'Modello successivo' }))
  expect(
    screen.getByRole('heading', { name: 'SF90 Stradale' }),
  ).toBeInTheDocument()

  // Dall'ultimo, "successivo" torna al primo
  fireEvent.click(screen.getByRole('button', { name: 'Modello successivo' }))
  expect(screen.getByRole('heading', { name: 'F40' })).toBeInTheDocument()
})

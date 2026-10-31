import { fireEvent, screen } from '@testing-library/react'
import { signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('crea un modello, e porta alla sua pagina in bozza', async () => {
  signIn()
  renderRoute('/admin/modelli/nuovo')

  fireEvent.change(await screen.findByLabelText('Nome'), {
    target: { value: 'Testarossa' },
  })
  // L'anteprima dello slug segue il nome
  expect(
    screen.getByText("Nell'indirizzo del sito: /modelli/testarossa"),
  ).toBeInTheDocument()

  await screen.findByRole('option', { name: 'Sportive' })
  fireEvent.change(screen.getByLabelText('Famiglia'), {
    target: { value: '1' },
  })
  fireEvent.change(screen.getByLabelText('In italiano'), {
    target: { value: 'La berlinetta degli anni Ottanta.' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Crea modello' }))

  expect(
    await screen.findByRole('heading', { name: 'Testarossa' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent(
    'Modello creato: è una bozza.',
  )
})

test('modifica un modello esistente', async () => {
  signIn()
  renderRoute('/admin/modelli/2')

  const name = await screen.findByLabelText('Nome')
  expect(name).toHaveValue('SF90 Stradale')

  fireEvent.change(name, { target: { value: 'SF90 Stradale Assetto Fiorano' } })
  fireEvent.click(screen.getByRole('button', { name: 'Salva modifiche' }))

  expect(await screen.findByText('Modifiche salvate.')).toBeInTheDocument()
})

test("mostra l'errore del backend sotto il campo giusto", async () => {
  signIn()
  renderRoute('/admin/modelli/nuovo')

  fireEvent.change(await screen.findByLabelText('Nome'), {
    target: { value: 'SF90 Stradale' },
  })
  fireEvent.change(screen.getByLabelText('Slug'), {
    target: { value: 'sf90-stradale' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Crea modello' }))

  expect(
    await screen.findByText('Questo slug è già in uso.'),
  ).toBeInTheDocument()
  expect(screen.getByLabelText('Slug')).toHaveAttribute('aria-invalid', 'true')
})

test('un modello che non esiste è un "non trovato"', async () => {
  signIn()
  renderRoute('/admin/modelli/12345')

  expect(
    await screen.findByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
})

import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('elenca i motori in poche parole, e li cerca per codice o nome', async () => {
  signIn()
  renderRoute('/admin/motori')

  const row = within(await screen.findByRole('row', { name: /F140/ }))
  expect(row.getByText('V12 a 65°')).toBeInTheDocument()
  expect(row.getByText('6496 cm³')).toBeInTheDocument()

  fireEvent.change(screen.getByLabelText('Cerca un motore'), {
    target: { value: 'biturbo' },
  })

  await waitFor(() =>
    expect(screen.queryByRole('row', { name: /F140/ })).not.toBeInTheDocument(),
  )
  expect(screen.getByRole('row', { name: /F154/ })).toBeInTheDocument()
})

test('filtra per architettura, e dice quanti motori restano', async () => {
  signIn()
  renderRoute('/admin/motori')

  expect(await screen.findByText('2 motori')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Piatto' }))

  expect(screen.getByRole('button', { name: 'Piatto' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  expect(
    screen.getByText('Nessun motore con questi filtri.'),
  ).toBeInTheDocument()
  expect(screen.getByText('0 motori con questi filtri')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Azzera filtri' }))
  expect(screen.getByRole('row', { name: /F140/ })).toBeInTheDocument()
})

test('crea un motore dalla sua finestra, e porta alla sua pagina', async () => {
  signIn()
  renderRoute('/admin/motori')

  fireEvent.click(await screen.findByRole('button', { name: 'Nuovo motore' }))
  const dialog = within(screen.getByRole('dialog', { name: 'Nuovo motore' }))

  fireEvent.change(dialog.getByLabelText('Codice'), {
    target: { value: 'F163' },
  })
  fireEvent.change(dialog.getByLabelText('Architettura'), {
    target: { value: 'V' },
  })
  fireEvent.change(dialog.getByLabelText('Angolo della V (°)'), {
    target: { value: '120' },
  })
  fireEvent.change(dialog.getByLabelText('Cilindri'), {
    target: { value: '6' },
  })
  fireEvent.change(dialog.getByLabelText('Cilindrata (cm³)'), {
    target: { value: '2992' },
  })
  // Il motore in breve segue i campi
  expect(dialog.getByText('V6 a 120°, 2992 cm³')).toBeInTheDocument()
  fireEvent.change(dialog.getByLabelText('Aspirazione'), {
    target: { value: 'turbo' },
  })
  fireEvent.click(dialog.getByRole('button', { name: 'Crea motore' }))

  expect(
    await screen.findByRole('heading', { name: 'F163', level: 1 }),
  ).toBeInTheDocument()
  expect(screen.getByText('Motore creato.')).toHaveAttribute('role', 'status')
})

test('la pagina del motore si legge, e «Modifica» apre la sezione', async () => {
  signIn()
  renderRoute('/admin/motori/1')

  const data = within(
    await screen.findByRole('region', { name: 'Dati tecnici' }),
  )
  expect(data.getByText('90°')).toBeInTheDocument()
  expect(data.getByText('3990 cm³')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Modifica descrizione' }))

  const dialog = within(screen.getByRole('dialog', { name: 'Descrizione' }))
  expect(dialog.getByLabelText('In italiano')).toHaveValue('Il V8 biturbo.')
})

test('se il motore è usato, il backend spiega perché non si elimina', async () => {
  server.use(
    http.delete('http://localhost:8000/api/admin/engines/:id', () =>
      HttpResponse.json(
        {
          message:
            'Il motore è usato da almeno una versione: scollegalo prima di eliminarlo.',
        },
        { status: 409 },
      ),
    ),
  )
  signIn()
  renderRoute('/admin/motori/1')

  expect(await screen.findByText('Lo usano 3 versioni.')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Elimina motore' }))
  fireEvent.click(screen.getByRole('button', { name: 'Sì, elimina' }))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Il motore è usato da almeno una versione',
  )
})

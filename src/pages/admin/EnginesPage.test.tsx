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

test("l'angolo della V si compila solo per i motori a V", async () => {
  signIn()
  renderRoute('/admin/motori/nuovo')

  const angle = await screen.findByLabelText('Angolo della V (°)')
  expect(angle).toBeDisabled()

  fireEvent.change(screen.getByLabelText('Architettura'), {
    target: { value: 'V' },
  })
  fireEvent.change(screen.getByLabelText('Cilindri'), {
    target: { value: '12' },
  })
  fireEvent.change(angle, { target: { value: '65' } })

  expect(angle).toBeEnabled()
  expect(screen.getByText('V12 a 65°')).toBeInTheDocument()
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

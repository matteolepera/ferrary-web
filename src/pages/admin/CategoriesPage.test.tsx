import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('elenca le famiglie nel loro ordine, e ne crea una nuova in fondo', async () => {
  let sent: unknown = null
  server.use(
    http.post(
      'http://localhost:8000/api/admin/categories',
      async ({ request }) => {
        sent = await request.json()
        return HttpResponse.json({ data: { id: 50 } }, { status: 201 })
      },
    ),
  )
  signIn()
  renderRoute('/admin/famiglie')

  const rows = await screen.findAllByRole('row')
  expect(rows[1]).toHaveTextContent('Sportive')
  expect(rows[2]).toHaveTextContent('Hypercar')

  fireEvent.change(screen.getByLabelText('Nome in italiano'), {
    target: { value: 'Speciali' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Crea famiglia' }))

  await waitFor(() =>
    expect(sent).toEqual({ name: { it: 'Speciali' }, sort_order: 4 }),
  )
})

test('riempie il form con la famiglia da modificare', async () => {
  signIn()
  renderRoute('/admin/famiglie')

  fireEvent.click(
    await screen.findByRole('button', { name: 'Modifica Hypercar' }),
  )

  expect(
    screen.getByRole('heading', { name: 'Modifica: Hypercar' }),
  ).toBeInTheDocument()
  expect(screen.getByLabelText('Nome in inglese')).toHaveValue('Hypercars')
  expect(
    screen.getByRole('button', { name: 'Salva modifiche' }),
  ).toBeInTheDocument()
})

test('se il backend rifiuta l’eliminazione, mostra il suo motivo', async () => {
  server.use(
    http.delete('http://localhost:8000/api/admin/categories/:id', () =>
      HttpResponse.json(
        { message: 'La famiglia contiene ancora dei modelli.' },
        { status: 409 },
      ),
    ),
  )
  signIn()
  renderRoute('/admin/famiglie')

  fireEvent.click(
    await screen.findByRole('button', { name: 'Elimina Sportive' }),
  )
  fireEvent.click(
    within(screen.getByRole('alertdialog')).getByRole('button', {
      name: 'Elimina',
    }),
  )

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'La famiglia contiene ancora dei modelli.',
  )
})

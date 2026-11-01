import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('elenca i designer in ordine alfabetico, con tipo e paese per esteso', async () => {
  signIn()
  renderRoute('/admin/designer')

  const rows = await screen.findAllByRole('row')
  expect(rows[1]).toHaveTextContent('Flavio Manzoni')
  expect(within(rows[2]).getByText('Studio')).toBeInTheDocument()
  expect(within(rows[2]).getByText('Italia')).toBeInTheDocument()
})

test('crea un designer, con il codice del paese in maiuscolo', async () => {
  let sent: unknown = null
  server.use(
    http.post(
      'http://localhost:8000/api/admin/designers',
      async ({ request }) => {
        sent = await request.json()
        return HttpResponse.json({ data: { id: 70 } }, { status: 201 })
      },
    ),
  )
  signIn()
  renderRoute('/admin/designer')

  fireEvent.change(await screen.findByLabelText('Nome'), {
    target: { value: 'Scaglietti' },
  })
  fireEvent.change(screen.getByLabelText('Tipo'), {
    target: { value: 'studio' },
  })
  fireEvent.change(screen.getByLabelText('Paese'), { target: { value: 'it' } })

  expect(
    screen.getByText('Il codice di due lettere: Italia.'),
  ).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Crea designer' }))

  await waitFor(() =>
    expect(sent).toEqual({ name: 'Scaglietti', type: 'studio', country: 'IT' }),
  )
})

test('riempie il form con il designer da modificare', async () => {
  signIn()
  renderRoute('/admin/designer')

  fireEvent.click(
    await screen.findByRole('button', { name: 'Modifica Pininfarina' }),
  )

  expect(
    screen.getByRole('heading', { name: 'Modifica: Pininfarina' }),
  ).toBeInTheDocument()
  expect(screen.getByLabelText('Tipo')).toHaveValue('studio')
})

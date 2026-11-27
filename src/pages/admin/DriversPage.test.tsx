import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('elenca i piloti per cognome, con nazionalità e data di nascita per esteso', async () => {
  signIn()
  renderRoute('/admin/piloti')

  // Prima arrivano le righe sagoma: aspettiamo quelle vere
  await screen.findByRole('row', { name: /Charles Leclerc/ })
  const rows = screen.getAllByRole('row')
  expect(rows[1]).toHaveTextContent('Charles Leclerc')
  expect(within(rows[1]).getByText('Monaco')).toBeInTheDocument()
  expect(within(rows[1]).getByText('16 ottobre 1997')).toBeInTheDocument()
  expect(rows[2]).toHaveTextContent('Michael Schumacher')
})

test('filtra per nazionalità, con i soli paesi presenti', async () => {
  signIn()
  renderRoute('/admin/piloti')

  const filter = await screen.findByLabelText('Filtra per nazionalità')
  await within(filter).findByRole('option', { name: 'Monaco' })
  fireEvent.change(filter, { target: { value: 'MC' } })

  expect(screen.getByText('1 pilota con questi filtri')).toBeInTheDocument()
  expect(
    screen.queryByRole('row', { name: /Schumacher/ }),
  ).not.toBeInTheDocument()
})

test('crea un pilota, con la nazionalità in maiuscolo e la data come la vuole il backend', async () => {
  let sent: unknown = null
  server.use(
    http.post(
      'http://localhost:8000/api/admin/drivers',
      async ({ request }) => {
        sent = await request.json()
        return HttpResponse.json({ data: { id: 80 } }, { status: 201 })
      },
    ),
  )
  signIn()
  renderRoute('/admin/piloti')

  fireEvent.click(await screen.findByRole('button', { name: 'Nuovo pilota' }))
  fireEvent.change(screen.getByLabelText('Nome'), {
    target: { value: 'Niki' },
  })
  fireEvent.change(screen.getByLabelText('Cognome'), {
    target: { value: 'Lauda' },
  })
  fireEvent.change(screen.getByLabelText('Nazionalità'), {
    target: { value: 'at' },
  })
  fireEvent.change(screen.getByLabelText('Data di nascita'), {
    target: { value: '1949-02-22' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Crea pilota' }))

  await waitFor(() =>
    expect(sent).toEqual({
      first_name: 'Niki',
      last_name: 'Lauda',
      nationality: 'AT',
      birth_date: '1949-02-22',
    }),
  )
})

test('apre la finestra con il pilota da modificare', async () => {
  signIn()
  renderRoute('/admin/piloti')

  fireEvent.click(
    await screen.findByRole('button', { name: 'Modifica Michael Schumacher' }),
  )

  expect(
    screen.getByRole('dialog', { name: 'Michael Schumacher' }),
  ).toBeInTheDocument()
  expect(screen.getByLabelText('Data di nascita')).toHaveValue('1969-01-03')
})

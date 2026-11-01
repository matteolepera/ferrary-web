import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { staffUser } from '@/test/fixtures'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('elenca lo staff con i ruoli, e riconosce chi sta guardando', async () => {
  signIn()
  renderRoute('/admin/staff')

  const list = within(
    await screen.findByRole('list', { name: 'Persone dello staff' }),
  )
  const items = list.getAllByRole('listitem')
  expect(items[0]).toHaveTextContent('Matteo')
  expect(items[0]).toHaveTextContent('(tu)')
  expect(items[0]).toHaveTextContent('Master')
  expect(items[2]).toHaveTextContent('Andrea Bianchi')
  expect(items[2]).toHaveTextContent('Moderatore')
})

test('aggiunge una persona, e il form riparte vuoto', async () => {
  let sent: unknown = null
  server.use(
    http.post('http://localhost:8000/api/admin/staff', async ({ request }) => {
      sent = await request.json()
      return HttpResponse.json(
        {
          data: {
            id: 40,
            name: 'Sara Ferri',
            email: 'sara@ferrary.test',
            role: 'moderator',
          },
        },
        { status: 201 },
      )
    }),
  )
  signIn()
  renderRoute('/admin/staff')

  fireEvent.change(await screen.findByLabelText('Nome'), {
    target: { value: 'Sara Ferri' },
  })
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'sara@ferrary.test' },
  })
  fireEvent.change(screen.getByLabelText('Password iniziale'), {
    target: { value: 'una-password-lunga' },
  })
  fireEvent.change(screen.getByLabelText('Ruolo'), {
    target: { value: 'moderator' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Aggiungi allo staff' }))

  expect(
    await screen.findByText('Sara Ferri è stato aggiunto allo staff.'),
  ).toBeInTheDocument()
  expect(sent).toEqual({
    name: 'Sara Ferri',
    email: 'sara@ferrary.test',
    password: 'una-password-lunga',
    role: 'moderator',
  })
  await waitFor(() => expect(screen.getByLabelText('Nome')).toHaveValue(''))
})

test('un Admin può aggiungere solo moderatori', async () => {
  signIn({ ...staffUser, role: 'admin' })
  renderRoute('/admin/staff')

  const role = await screen.findByLabelText('Ruolo')
  expect(role).toHaveValue('moderator')
  expect(role.querySelectorAll('option')).toHaveLength(1)
})

test('a un moderatore che arriva qui dice che la pagina è riservata', async () => {
  server.use(
    http.get(
      'http://localhost:8000/api/admin/staff',
      () => new HttpResponse(null, { status: 403 }),
    ),
  )
  signIn({ ...staffUser, role: 'moderator' })
  renderRoute('/admin/staff')

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'La gestione dello staff è riservata ad Admin e Master.',
  )
})
const row = async (name: string) =>
  within((await screen.findByText(name)).closest('li') as HTMLElement)

test('le azioni compaiono solo per chi si può gestire', async () => {
  signIn()
  renderRoute('/admin/staff')

  expect(
    (await row('Giulia Rossi')).getByRole('button', {
      name: 'Modifica Giulia Rossi',
    }),
  ).toBeInTheDocument()
  // Il Master non gestisce se stesso: nessuna azione nella propria riga
  expect((await row('Matteo')).queryByRole('button')).not.toBeInTheDocument()
})

test('cambia il ruolo di una persona', async () => {
  let sent: unknown = null
  server.use(
    http.patch(
      'http://localhost:8000/api/admin/staff/:id/role',
      async ({ request }) => {
        sent = await request.json()
        return HttpResponse.json({
          data: { ...staffUser, id: 3, name: 'Andrea Bianchi', role: 'admin' },
        })
      },
    ),
  )
  signIn()
  renderRoute('/admin/staff')

  fireEvent.change(await screen.findByLabelText('Ruolo di Andrea Bianchi'), {
    target: { value: 'admin' },
  })

  expect(
    await screen.findByText('Andrea Bianchi ora è Admin.'),
  ).toBeInTheDocument()
  expect(sent).toEqual({ role: 'admin' })
})

test('modifica i dati senza toccare la password, se il campo resta vuoto', async () => {
  let sent: unknown = null
  server.use(
    http.patch(
      'http://localhost:8000/api/admin/staff/:id',
      async ({ request }) => {
        sent = await request.json()
        return HttpResponse.json({
          data: { ...staffUser, id: 2, name: 'Giulia Rossi' },
        })
      },
    ),
  )
  signIn()
  renderRoute('/admin/staff')

  const giulia = await row('Giulia Rossi')
  fireEvent.click(giulia.getByRole('button', { name: 'Modifica Giulia Rossi' }))
  fireEvent.change(giulia.getByLabelText('Email'), {
    target: { value: 'giulia.rossi@ferrary.test' },
  })
  fireEvent.click(giulia.getByRole('button', { name: 'Salva' }))

  expect(
    await screen.findByText('Dati di Giulia Rossi aggiornati.'),
  ).toBeInTheDocument()
  expect(sent).toEqual({
    name: 'Giulia Rossi',
    email: 'giulia.rossi@ferrary.test',
  })
})

test('elimina una persona dopo la conferma, avvisando che è definitivo', async () => {
  let deleted: string | null = null
  server.use(
    http.delete('http://localhost:8000/api/admin/staff/:id', ({ params }) => {
      deleted = String(params.id)
      return new HttpResponse(null, { status: 204 })
    }),
  )
  signIn()
  renderRoute('/admin/staff')

  const andrea = await row('Andrea Bianchi')
  fireEvent.click(
    andrea.getByRole('button', { name: 'Elimina Andrea Bianchi' }),
  )
  expect(andrea.getByRole('alertdialog')).toHaveTextContent(
    'non si può annullare',
  )
  fireEvent.click(andrea.getByRole('button', { name: 'Sì, elimina' }))

  expect(
    await screen.findByText('Andrea Bianchi non fa più parte dello staff.'),
  ).toBeInTheDocument()
  expect(deleted).toBe('3')
})

import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

const card = async () =>
  within(await screen.findByRole('region', { name: 'Designer e piloti' }))

test('mostra i designer collegati con il loro ruolo', async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  const credits = await card()
  expect(credits.getByRole('listitem')).toHaveTextContent(
    'Flavio Manzoni · Design',
  )
  expect(credits.getByText('Nessun pilota collegato.')).toBeInTheDocument()
})

test('aggiunge un pilota dalla sua finestra, mandando l’elenco completo', async () => {
  let sent: unknown = null
  server.use(
    http.put(
      'http://localhost:8000/api/admin/versions/:id/drivers',
      async ({ request }) => {
        sent = await request.json()
        return HttpResponse.json({ data: [] })
      },
    ),
  )
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  fireEvent.click(
    (await card()).getByRole('button', { name: 'Aggiungi un pilota' }),
  )
  const dialog = within(
    screen.getByRole('dialog', { name: 'Aggiungi un pilota' }),
  )
  await dialog.findByRole('option', { name: 'Charles Leclerc' })
  fireEvent.change(dialog.getByLabelText('Pilota'), { target: { value: '2' } })
  fireEvent.click(dialog.getByRole('button', { name: 'Aggiungi il pilota' }))

  await waitFor(() => expect(sent).toEqual({ drivers: [2] }))
  // Salvato, la finestra si chiude
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
  )
})

test('toglie un designer con la ✕', async () => {
  let sent: unknown = null
  server.use(
    http.put(
      'http://localhost:8000/api/admin/versions/:id/designers',
      async ({ request }) => {
        sent = await request.json()
        return HttpResponse.json({ data: [] })
      },
    ),
  )
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  fireEvent.click(
    (await card()).getByRole('button', {
      name: 'Togli Flavio Manzoni, Design',
    }),
  )

  await waitFor(() => expect(sent).toEqual({ designers: [] }))
})

test('non permette di aggiungere due volte lo stesso designer con lo stesso ruolo', async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  fireEvent.click(
    (await card()).getByRole('button', { name: 'Aggiungi un designer' }),
  )
  const dialog = within(
    screen.getByRole('dialog', { name: 'Aggiungi un designer' }),
  )
  await dialog.findByRole('option', { name: 'Flavio Manzoni' })
  fireEvent.change(dialog.getByRole('combobox', { name: 'Designer' }), {
    target: { value: '2' },
  })

  expect(
    dialog.getByText('Questo designer ha già questo ruolo.'),
  ).toBeInTheDocument()
  expect(
    dialog.getByRole('button', { name: 'Aggiungi il designer' }),
  ).toBeDisabled()
})

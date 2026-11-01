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

test('aggiunge un pilota, mandando l’elenco completo', async () => {
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

  const credits = await card()
  await credits.findByRole('option', { name: 'Charles Leclerc' })
  fireEvent.change(credits.getByLabelText('Pilota'), { target: { value: '2' } })
  fireEvent.click(
    within(credits.getByRole('region', { name: 'Piloti' })).getByRole(
      'button',
      { name: 'Aggiungi' },
    ),
  )

  await waitFor(() => expect(sent).toEqual({ drivers: [2] }))
})

test('toglie un designer, e non permette di aggiungere due volte lo stesso ruolo', async () => {
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

  const credits = await card()
  await credits.findByRole('option', { name: 'Flavio Manzoni' })
  fireEvent.change(credits.getByRole('combobox', { name: 'Designer' }), {
    target: { value: '2' },
  })
  expect(
    credits.getByText('Questo designer ha già questo ruolo.'),
  ).toBeInTheDocument()

  fireEvent.click(
    credits.getByRole('button', { name: 'Togli Flavio Manzoni, Design' }),
  )

  await waitFor(() => expect(sent).toEqual({ designers: [] }))
})

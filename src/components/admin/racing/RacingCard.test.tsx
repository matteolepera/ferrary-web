import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

const card = async () =>
  within(await screen.findByRole('region', { name: 'Risultati sportivi' }))

test('mostra i risultati per campionato, con i titoli insieme', async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  const results = await card()
  const row = within(await results.findByRole('row', { name: /Formula 1/ }))
  expect(row.getByText('2004')).toBeInTheDocument()
  expect(row.getByText('15')).toBeInTheDocument()
  expect(row.getByText('1 piloti, 1 costruttori')).toBeInTheDocument()
})

test('aggiunge un campionato, senza inviare il form della versione', async () => {
  let sent: unknown = null
  server.use(
    http.post(
      'http://localhost:8000/api/admin/versions/:id/racing',
      async ({ request }) => {
        sent = await request.json()
        return HttpResponse.json({ data: { id: 92 } }, { status: 201 })
      },
    ),
  )
  signIn()
  renderRoute('/admin/modelli/2/versioni/11')

  const results = await card()
  fireEvent.change(results.getByLabelText('Campionato'), {
    target: { value: 'Ferrari Challenge' },
  })
  fireEvent.change(results.getByLabelText('Stagione'), {
    target: { value: '2021' },
  })
  fireEvent.change(results.getByLabelText('Vittorie'), {
    target: { value: '3' },
  })
  fireEvent.click(
    results.getByRole('button', { name: 'Aggiungi il campionato' }),
  )

  await waitFor(() =>
    expect(sent).toMatchObject({
      championship: 'Ferrari Challenge',
      season_start: 2021,
      wins: 3,
      races: null,
    }),
  )
  // Il form della versione non è stato inviato
  expect(screen.queryByText('Modifiche salvate.')).not.toBeInTheDocument()
})

test('elimina un campionato, dopo la conferma', async () => {
  let deleted: string | null = null
  server.use(
    http.delete('http://localhost:8000/api/admin/racing/:id', ({ params }) => {
      deleted = String(params.id)
      return new HttpResponse(null, { status: 204 })
    }),
  )
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  const results = await card()
  fireEvent.click(
    await results.findByRole('button', { name: 'Elimina Formula 1' }),
  )
  fireEvent.click(
    within(results.getByRole('alertdialog')).getByRole('button', {
      name: 'Elimina',
    }),
  )

  await waitFor(() => expect(deleted).toBe('91'))
})

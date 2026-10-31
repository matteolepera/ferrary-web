import { fireEvent, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { staffUser } from '@/test/fixtures'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

const card = async () =>
  within(await screen.findByRole('region', { name: 'Pubblicazione' }))

test('pubblica subito un modello programmato, senza perdere la famiglia', async () => {
  signIn()
  renderRoute('/admin/modelli/9')

  fireEvent.click((await card()).getByRole('button', { name: 'Pubblica ora' }))

  expect(await (await card()).findByText(/^Online dal/)).toBeInTheDocument()
  // La famiglia è ancora nel menu: la risposta è stata unita al modello, non lo ha sostituito
  expect(screen.getByLabelText('Famiglia')).toHaveValue('3')
})

test('chiede conferma prima di ritirare un modello pubblicato', async () => {
  signIn()
  renderRoute('/admin/modelli/2')

  fireEvent.click(
    (await card()).getByRole('button', { name: 'Riporta in bozza' }),
  )
  expect((await card()).getByRole('alertdialog')).toHaveTextContent(
    'Il modello sparirà dal sito. Confermi?',
  )

  fireEvent.click(
    (await card()).getByRole('button', { name: 'Sì, riporta in bozza' }),
  )

  expect(
    await (await card()).findByText('Non è visibile sul sito.'),
  ).toBeInTheDocument()
})

test('programma una data, convertita per il server', async () => {
  let sent: { published_at?: string } | null = null
  server.use(
    http.post(
      'http://localhost:8000/api/admin/models/:id/publish',
      async ({ request }) => {
        sent = (await request.json()) as { published_at?: string }
        return HttpResponse.json({
          data: { status: 'scheduled', published_at: sent.published_at },
        })
      },
    ),
  )
  signIn()
  renderRoute('/admin/modelli/9')

  fireEvent.click((await card()).getByRole('button', { name: 'Cambia data' }))
  fireEvent.change(screen.getByLabelText('Data di pubblicazione'), {
    target: { value: '2030-01-15T09:30' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Conferma la data' }))

  await (await card()).findByRole('button', { name: 'Pubblica ora' })
  expect(sent).toEqual({
    published_at: new Date('2030-01-15T09:30').toISOString(),
  })
})

test('ai moderatori mostra lo stato, ma non le azioni', async () => {
  signIn({ ...staffUser, role: 'moderator' })
  renderRoute('/admin/modelli/9')

  const publication = await card()
  expect(
    publication.getByText('Pubblicare e programmare spetta ad Admin e Master.'),
  ).toBeInTheDocument()
  expect(
    publication.queryByRole('button', { name: 'Pubblica ora' }),
  ).not.toBeInTheDocument()
})

import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { staffUser } from '@/test/fixtures'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

const section = async (name: string) =>
  within(await screen.findByRole('list', { name }))

test('mostra modelli e versioni nel cestino, con il loro dettaglio', async () => {
  signIn()
  renderRoute('/admin/cestino')

  expect((await section('Modelli')).getByRole('listitem')).toHaveTextContent(
    'F80Hypercar · 1 versione',
  )
  expect((await section('Versioni')).getByRole('listitem')).toHaveTextContent(
    'SF90 SpiderVersione di SF90 Stradale',
  )
})

test('ripristina un modello', async () => {
  let restored: string | null = null
  server.use(
    http.post(
      'http://localhost:8000/api/admin/models/:id/restore',
      ({ params }) => {
        restored = String(params.id)
        return HttpResponse.json({ data: {} })
      },
    ),
  )
  signIn()
  renderRoute('/admin/cestino')

  fireEvent.click(
    (await section('Modelli')).getByRole('button', { name: 'Ripristina' }),
  )

  expect(
    await screen.findByText('F80 è di nuovo al suo posto.'),
  ).toBeInTheDocument()
  expect(restored).toBe('9')
})

test('spiega perché una versione non si può ripristinare', async () => {
  server.use(
    http.post('http://localhost:8000/api/admin/versions/:id/restore', () =>
      HttpResponse.json(
        {
          message:
            'Il modello di questa versione è nel cestino: ripristina prima il modello.',
        },
        { status: 409 },
      ),
    ),
  )
  signIn()
  renderRoute('/admin/cestino')

  fireEvent.click(
    (await section('Versioni')).getByRole('button', { name: 'Ripristina' }),
  )

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'ripristina prima il modello',
  )
})

test('solo il Master elimina per sempre, dopo una conferma che dice cosa si perde', async () => {
  let purged: string | null = null
  server.use(
    http.delete(
      'http://localhost:8000/api/admin/trash/models/:id',
      ({ params }) => {
        purged = String(params.id)
        return new HttpResponse(null, { status: 204 })
      },
    ),
  )
  signIn()
  renderRoute('/admin/cestino')

  const models = await section('Modelli')
  fireEvent.click(models.getByRole('button', { name: 'Elimina per sempre' }))
  expect(models.getByRole('alertdialog')).toHaveTextContent(
    'con tutte le sue versioni, i dati e le foto',
  )
  fireEvent.click(
    models.getByRole('button', { name: 'Sì, elimina per sempre' }),
  )

  await waitFor(() => expect(purged).toBe('9'))
})

test('un Admin ripristina, ma non elimina per sempre', async () => {
  signIn({ ...staffUser, role: 'admin' })
  renderRoute('/admin/cestino')

  const models = await section('Modelli')
  expect(models.getByRole('button', { name: 'Ripristina' })).toBeInTheDocument()
  expect(
    models.queryByRole('button', { name: 'Elimina per sempre' }),
  ).not.toBeInTheDocument()
})

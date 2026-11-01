import { fireEvent, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

const gallery = async () =>
  within(await screen.findByRole('region', { name: 'Foto' }))

test('mostra le foto della versione, con la copertina', async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  const photos = await gallery()
  expect(
    await photos.findByRole('img', { name: 'SF90 Stradale, vista frontale' }),
  ).toBeInTheDocument()
  expect(photos.getByText('Copertina')).toBeInTheDocument()
  // Solo la foto che non è copertina può diventarlo
  expect(
    photos.getAllByRole('button', { name: /^Usa come copertina/ }),
  ).toHaveLength(1)
})

test('sceglie una nuova copertina', async () => {
  let sent: unknown = null
  server.use(
    http.patch(
      'http://localhost:8000/api/admin/images/:id',
      async ({ request }) => {
        sent = await request.json()
        return HttpResponse.json({ data: {} })
      },
    ),
  )
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  fireEvent.click(
    await (
      await gallery()
    ).findByRole('button', {
      name: 'Usa come copertina: SF90 Stradale, vista posteriore',
    }),
  )

  await screen.findByRole('button', {
    name: 'Usa come copertina: SF90 Stradale, vista posteriore',
  })
  expect(sent).toEqual({ is_cover: true })
})

test('elimina una foto, dopo la conferma', async () => {
  let deleted: string | null = null
  server.use(
    http.delete('http://localhost:8000/api/admin/images/:id', ({ params }) => {
      deleted = String(params.id)
      return new HttpResponse(null, { status: 204 })
    }),
  )
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  const photos = await gallery()
  fireEvent.click(
    await photos.findByRole('button', {
      name: 'Elimina: SF90 Stradale, vista posteriore',
    }),
  )

  expect(photos.getByRole('alertdialog')).toHaveTextContent(
    'Eliminare questa foto?',
  )
  fireEvent.click(photos.getByRole('button', { name: 'Sì, elimina' }))

  await screen.findByRole('button', {
    name: 'Elimina: SF90 Stradale, vista posteriore',
  })
  expect(deleted).toBe('32')
})

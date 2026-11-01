import { fireEvent, screen, within, waitFor } from '@testing-library/react'
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

test('riordina con le frecce, e annuncia la nuova posizione', async () => {
  let sent: unknown = null
  server.use(
    http.put(
      'http://localhost:8000/api/admin/versions/:id/images/order',
      async ({ request }) => {
        sent = await request.json()
        return HttpResponse.json({ data: [] })
      },
    ),
  )
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  const photos = await gallery()
  // Agli estremi, la freccia che porterebbe fuori è disattivata
  expect(
    await photos.findByRole('button', {
      name: 'Sposta prima: SF90 Stradale, vista frontale',
    }),
  ).toBeDisabled()
  expect(
    photos.getByRole('button', {
      name: 'Sposta dopo: SF90 Stradale, vista posteriore',
    }),
  ).toBeDisabled()

  fireEvent.click(
    photos.getByRole('button', {
      name: 'Sposta prima: SF90 Stradale, vista posteriore',
    }),
  )

  expect(
    screen.getByText('Foto spostata in posizione 1 di 2.'),
  ).toBeInTheDocument()
  await waitFor(() => expect(sent).toEqual({ images: [32, 31] }))
})

test('modifica il testo alternativo di una foto', async () => {
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

  const photos = await gallery()
  fireEvent.click(
    await photos.findByRole('button', {
      name: 'Modifica il testo: SF90 Stradale, vista posteriore',
    }),
  )
  fireEvent.change(photos.getByLabelText('In inglese'), {
    target: { value: 'SF90 Stradale, rear view' },
  })
  fireEvent.click(photos.getByRole('button', { name: 'Salva' }))

  await waitFor(() =>
    expect(sent).toEqual({
      alt_text: {
        it: 'SF90 Stradale, vista posteriore',
        en: 'SF90 Stradale, rear view',
      },
    }),
  )
})

test('aprire la modifica chiude la conferma dell’eliminazione', async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  const photos = await gallery()
  fireEvent.click(
    await photos.findByRole('button', {
      name: 'Elimina: SF90 Stradale, vista frontale',
    }),
  )
  expect(photos.getByRole('alertdialog')).toBeInTheDocument()

  fireEvent.click(
    photos.getByRole('button', {
      name: 'Modifica il testo: SF90 Stradale, vista posteriore',
    }),
  )

  expect(photos.queryByRole('alertdialog')).not.toBeInTheDocument()
  expect(photos.getByLabelText('Testo alternativo')).toHaveValue(
    'SF90 Stradale, vista posteriore',
  )
})

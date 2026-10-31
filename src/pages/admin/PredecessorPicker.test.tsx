import { fireEvent, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('cerca un modello, lo sceglie con la tastiera e lo salva come predecessore', async () => {
  let sent: unknown = null
  server.use(
    http.patch(
      'http://localhost:8000/api/admin/models/:id',
      async ({ request }) => {
        sent = await request.json()
        return HttpResponse.json({ data: {} })
      },
    ),
  )
  signIn()
  renderRoute('/admin/modelli/9')

  const search = await screen.findByRole('combobox', { name: 'Predecessore' })
  fireEvent.focus(search)
  fireEvent.change(search, { target: { value: 'sf9' } })

  expect(
    await screen.findByRole('option', { name: /SF90 Stradale/ }),
  ).toBeInTheDocument()
  fireEvent.keyDown(search, { key: 'ArrowDown' })
  expect(screen.getByRole('option', { name: /SF90 Stradale/ })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  fireEvent.keyDown(search, { key: 'Enter' })

  expect(
    screen.getByRole('button', {
      name: 'Togli SF90 Stradale come predecessore',
    }),
  ).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Salva modifiche' }))
  await screen.findByText('Modifiche salvate.')
  expect(sent).toMatchObject({ predecessor_id: 2 })
})

test('un modello non può precedere se stesso', async () => {
  signIn()
  renderRoute('/admin/modelli/2')

  const search = await screen.findByRole('combobox', { name: 'Predecessore' })
  fireEvent.focus(search)
  fireEvent.change(search, { target: { value: 'sf90' } })

  expect(
    await screen.findByText('Nessun modello trovato.', {
      selector: 'p[aria-hidden]',
    }),
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('option', { name: /SF90 Stradale/ }),
  ).not.toBeInTheDocument()
})

test('togliendo il predecessore il focus torna nella ricerca', async () => {
  signIn()
  renderRoute('/admin/modelli/9')

  const search = await screen.findByRole('combobox', { name: 'Predecessore' })
  fireEvent.focus(search)
  fireEvent.change(search, { target: { value: 'sf9' } })
  fireEvent.mouseDown(
    await screen.findByRole('option', { name: /SF90 Stradale/ }),
  )

  fireEvent.click(
    screen.getByRole('button', {
      name: 'Togli SF90 Stradale come predecessore',
    }),
  )

  expect(screen.getByRole('combobox', { name: 'Predecessore' })).toHaveFocus()
})

import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { staffUser } from '@/test/fixtures'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

const card = async () =>
  within(await screen.findByRole('region', { name: 'Cestino' }))

test('sposta un modello nel cestino e torna all’elenco', async () => {
  let deleted: string | null = null
  server.use(
    http.delete('http://localhost:8000/api/admin/models/:id', ({ params }) => {
      deleted = String(params.id)
      return new HttpResponse(null, { status: 204 })
    }),
  )
  signIn()
  renderRoute('/admin/modelli/2')

  const trash = await card()
  fireEvent.click(trash.getByRole('button', { name: 'Sposta nel cestino' }))
  expect(trash.getByRole('alertdialog')).toHaveTextContent(
    'Spostare SF90 Stradale nel cestino?',
  )
  fireEvent.click(trash.getByRole('button', { name: 'Sì, sposta nel cestino' }))

  expect(
    await screen.findByRole('heading', { name: 'Modelli', level: 1 }),
  ).toBeInTheDocument()
  expect(deleted).toBe('2')
})

test('sposta una versione nel cestino e torna al suo modello', async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/11')

  const trash = await card()
  fireEvent.click(trash.getByRole('button', { name: 'Sposta nel cestino' }))
  fireEvent.click(trash.getByRole('button', { name: 'Sì, sposta nel cestino' }))

  await waitFor(() =>
    expect(
      screen.getByRole('heading', { name: 'SF90 Stradale', level: 1 }),
    ).toBeInTheDocument(),
  )
})

test('i moderatori non possono spostare nel cestino', async () => {
  signIn({ ...staffUser, role: 'moderator' })
  renderRoute('/admin/modelli/2')

  await screen.findByRole('heading', { name: 'SF90 Stradale', level: 1 })
  expect(
    screen.queryByRole('region', { name: 'Cestino' }),
  ).not.toBeInTheDocument()
})

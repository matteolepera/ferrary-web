import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { staffUser } from '@/test/fixtures'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  // Giovedì 29 ottobre 2026, la sera: la prima voce è di oggi, la seconda di ieri
  vi.setSystemTime(new Date(2026, 9, 29, 20))
})

afterEach(() => {
  vi.useRealTimers()
})

test('raggruppa le voci per giorno, con le frasi del pannello', async () => {
  signIn()
  renderRoute('/admin/registro')

  const today = within(await screen.findByRole('region', { name: 'Oggi' }))
  expect(today.getByRole('listitem')).toHaveTextContent(
    'Matteo ha programmato 812 GTS',
  )

  const yesterday = within(screen.getByRole('region', { name: 'Ieri' }))
  expect(yesterday.getByRole('listitem')).toHaveTextContent(
    'Matteo ha cambiato il ruolo di Giulia',
  )
  expect(yesterday.getByRole('listitem')).toHaveTextContent('Staff')
})

test('filtra per registro, e il filtro resta nell’indirizzo', async () => {
  signIn()
  renderRoute('/admin/registro')

  await screen.findByRole('region', { name: 'Oggi' })
  fireEvent.click(screen.getByRole('button', { name: 'Staff' }))

  expect(screen.getByRole('button', { name: 'Staff' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await waitFor(() =>
    expect(
      screen.queryByRole('region', { name: 'Oggi' }),
    ).not.toBeInTheDocument(),
  )
  expect(screen.getByRole('region', { name: 'Ieri' })).toBeInTheDocument()
})

test('un indirizzo con un filtro lo applica subito', async () => {
  signIn()
  renderRoute('/admin/registro?log=staff')

  expect(
    await screen.findByRole('region', { name: 'Ieri' }),
  ).toBeInTheDocument()
  expect(screen.queryByRole('region', { name: 'Oggi' })).not.toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: 'Azzera filtri' }),
  ).toBeInTheDocument()
})

test('a un moderatore che arriva qui dice che il registro è riservato', async () => {
  server.use(
    http.get(
      'http://localhost:8000/api/admin/activity',
      () => new HttpResponse(null, { status: 403 }),
    ),
  )
  signIn({ ...staffUser, role: 'moderator' })
  renderRoute('/admin/registro')

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Il registro è riservato ad Admin e Master.',
  )
})

test('mostra le modifiche di una voce, campo per campo', async () => {
  signIn()
  renderRoute('/admin/registro')

  const yesterday = within(await screen.findByRole('region', { name: 'Ieri' }))
  const toggle = yesterday.getByRole('button', { name: 'Dettagli' })
  expect(toggle).toHaveAttribute('aria-expanded', 'false')

  fireEvent.click(toggle)

  expect(yesterday.getByRole('button', { name: 'Nascondi' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  const row = within(yesterday.getByRole('row', { name: /Ruolo/ }))
  expect(row.getByText('Moderatore')).toBeInTheDocument()
  expect(row.getByText('Admin')).toBeInTheDocument()
})

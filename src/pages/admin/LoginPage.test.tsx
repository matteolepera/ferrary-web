import { fireEvent, screen } from '@testing-library/react'
import { STAFF_PASSWORD, staffUser } from '@/test/fixtures'
import { renderRoute } from '@/test/utils'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'

async function fillAndSubmit(password: string) {
  fireEvent.change(await screen.findByLabelText('Email'), {
    target: { value: staffUser.email },
  })
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: password },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Accedi' }))
}

test('con le credenziali giuste porta al pannello', async () => {
  renderRoute('/admin/login')

  await fillAndSubmit(STAFF_PASSWORD)

  expect(
    await screen.findByRole('heading', { name: 'Pannello' }),
  ).toBeInTheDocument()
})

test("con le credenziali sbagliate mostra l'errore sotto l'email", async () => {
  renderRoute('/admin/login')

  await fillAndSubmit('password-sbagliata')

  expect(
    await screen.findByText('Email o password non corrette.'),
  ).toBeInTheDocument()
  expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
})

test('dopo troppi tentativi lo dice chiaramente', async () => {
  server.use(
    http.post(
      'http://localhost:8000/api/login',
      () => new HttpResponse(null, { status: 429 }),
    ),
  )
  renderRoute('/admin/login')

  await fillAndSubmit(STAFF_PASSWORD)

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Troppi tentativi di accesso. Riprova tra un minuto.',
  )
})

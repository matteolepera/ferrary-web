import { fireEvent, screen } from '@testing-library/react'
import { STAFF_PASSWORD, staffUser } from '@/test/fixtures'
import { signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

async function loginAsStaff() {
  fireEvent.change(await screen.findByLabelText('Email'), {
    target: { value: staffUser.email },
  })
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: STAFF_PASSWORD },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Accedi' }))
}

test("senza sessione l'area admin rimanda al login, e dopo il login riporta al pannello", async () => {
  renderRoute('/admin')

  expect(
    await screen.findByRole('heading', { name: 'Accedi' }),
  ).toBeInTheDocument()

  await loginAsStaff()

  expect(
    await screen.findByRole('heading', { name: 'Pannello' }),
  ).toBeInTheDocument()
})

test('dopo il login non porta mai fuori dal sito', async () => {
  renderRoute('/admin/login?da=https://sito-falso.com')

  await loginAsStaff()

  // L'indirizzo esterno viene ignorato: si va al pannello
  expect(
    await screen.findByRole('heading', { name: 'Pannello' }),
  ).toBeInTheDocument()
})

test('uscendo si torna al login', async () => {
  signIn()
  renderRoute('/admin')

  fireEvent.click(await screen.findByRole('button', { name: 'Esci' }))

  expect(
    await screen.findByRole('heading', { name: 'Accedi' }),
  ).toBeInTheDocument()
})

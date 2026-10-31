import { screen, within } from '@testing-library/react'
import { staffUser } from '@/test/fixtures'
import { signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

const rail = async () =>
  within(await screen.findByRole('navigation', { name: 'Area staff' }))

test('mostra le sezioni e segna quella attuale', async () => {
  signIn()
  renderRoute('/admin')

  const nav = await rail()
  expect(nav.getByRole('link', { name: 'Pannello' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  expect(nav.getByRole('link', { name: 'Modelli' })).toHaveAttribute(
    'href',
    '/admin/modelli',
  )
  expect(nav.getByRole('link', { name: 'Modelli' })).not.toHaveAttribute(
    'aria-current',
  )
  expect(nav.getByRole('link', { name: 'Staff' })).toBeInTheDocument()
  expect(nav.getByRole('img', { name: 'Matteo, Master' })).toHaveTextContent(
    'M',
  )
})

test('le sezioni sulle persone non compaiono ai moderatori', async () => {
  signIn({ ...staffUser, role: 'moderator' })
  renderRoute('/admin')

  const nav = await rail()
  expect(nav.getByRole('link', { name: 'Modelli' })).toBeInTheDocument()
  expect(nav.queryByRole('link', { name: 'Staff' })).not.toBeInTheDocument()
  expect(
    nav.queryByRole('link', { name: 'Registro attività' }),
  ).not.toBeInTheDocument()
})

import { fireEvent, screen, within } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

/** La navigazione principale, quando la pagina è arrivata */
const mainNav = async () =>
  within(await screen.findByRole('navigation', { name: 'Principale' }))

test('segna la pagina attiva nella barra', async () => {
  renderRoute('/modelli')

  const nav = await mainNav()
  expect(nav.getByRole('link', { name: 'Archivio' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  expect(nav.getByRole('link', { name: 'La storia' })).not.toHaveAttribute(
    'aria-current',
  )
})

test('apre il menu dei cataloghi, e lo chiude con Esc', async () => {
  renderRoute('/modelli')

  const nav = await mainNav()
  const toggle = nav.getByRole('button', { name: 'Cataloghi' })
  fireEvent.click(toggle)

  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(nav.getByRole('link', { name: 'Motori' })).toHaveAttribute(
    'href',
    '/motori',
  )
  expect(nav.getByRole('link', { name: 'Piloti' })).toHaveAttribute(
    'href',
    '/piloti',
  )

  fireEvent.keyDown(document, { key: 'Escape' })

  expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

test('ha la ricerca nella barra, e un solo logo che porta alla home', async () => {
  renderRoute('/storia')

  const nav = await mainNav()
  expect(nav.getByRole('link', { name: 'Cerca' })).toHaveAttribute(
    'href',
    '/modelli',
  )

  const header = within(screen.getByRole('banner'))
  expect(
    header.getAllByRole('link', { name: 'Ferrary, torna alla home' }),
  ).toHaveLength(1)
})

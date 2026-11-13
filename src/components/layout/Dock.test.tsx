import { fireEvent, screen, within } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

/** Il dock, quando la pagina è arrivata */
const dock = async () =>
  within(await screen.findByRole('navigation', { name: 'Navigazione rapida' }))

test('ha le voci della barra del desktop, con la ricerca', async () => {
  renderRoute('/modelli')

  const nav = await dock()
  expect(nav.getByRole('link', { name: 'Archivio' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  expect(nav.getByRole('link', { name: 'Storia' })).toHaveAttribute(
    'href',
    '/storia',
  )
  expect(nav.getByRole('button', { name: 'Cerca' })).toHaveAttribute(
    'aria-expanded',
    'false',
  )
  expect(nav.queryByRole('link', { name: 'Famiglie' })).not.toBeInTheDocument()
})

test('il menu contiene i cataloghi', async () => {
  renderRoute('/modelli')

  fireEvent.click((await dock()).getByRole('button', { name: 'Menu' }))

  const menu = within(screen.getByRole('dialog', { name: 'Menu' }))
  expect(menu.getByRole('link', { name: 'Motori' })).toHaveAttribute(
    'href',
    '/motori',
  )
  expect(menu.getByRole('link', { name: 'Piloti' })).toHaveAttribute(
    'href',
    '/piloti',
  )
})

test('"Cerca" apre la ricerca a tutto schermo, e Invio apre l\'archivio', async () => {
  renderRoute('/storia')

  fireEvent.click((await dock()).getByRole('button', { name: 'Cerca' }))

  const search = within(
    screen.getByRole('dialog', { name: "Cerca nell'archivio" }),
  )
  const field = search.getByRole('combobox', { name: "Cerca nell'archivio" })
  expect(field).toHaveFocus()

  fireEvent.change(field, { target: { value: 'F40' } })
  expect(await search.findByRole('option', { name: /F40/ })).toBeInTheDocument()

  fireEvent.keyDown(field, { key: 'Enter' })

  expect(await screen.findByLabelText('Cerca per nome')).toHaveValue('F40')
  expect(
    screen.queryByRole('dialog', { name: "Cerca nell'archivio" }),
  ).not.toBeInTheDocument()
})

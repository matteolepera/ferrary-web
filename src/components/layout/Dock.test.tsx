import { fireEvent, screen, waitFor, within } from '@testing-library/react'
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
  expect(nav.getByRole('link', { name: 'La storia' })).toHaveAttribute(
    'href',
    '/storia',
  )
  expect(nav.getByRole('link', { name: 'Cerca' })).toHaveAttribute(
    'href',
    '/modelli',
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

test('"Cerca" apre l\'archivio con il campo di ricerca già attivo', async () => {
  renderRoute('/storia')

  fireEvent.click((await dock()).getByRole('link', { name: 'Cerca' }))

  await waitFor(() =>
    expect(screen.getByLabelText('Cerca per nome')).toHaveFocus(),
  )
})

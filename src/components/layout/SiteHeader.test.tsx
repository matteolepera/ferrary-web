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

test('ha un solo logo che porta alla home', async () => {
  renderRoute('/storia')
  await mainNav()

  const header = within(screen.getByRole('banner'))
  expect(
    header.getAllByRole('link', { name: 'Ferrary, torna alla home' }),
  ).toHaveLength(1)
})

test("cerca nella barra, e Invio apre l'archivio con tutti i risultati", async () => {
  renderRoute('/storia')

  fireEvent.click((await mainNav()).getByRole('button', { name: 'Cerca' }))
  const field = screen.getByRole('combobox', { name: "Cerca nell'archivio" })
  expect(field).toHaveFocus()

  fireEvent.change(field, { target: { value: 'F40' } })
  expect(await screen.findByRole('option', { name: /F40/ })).toBeInTheDocument()

  fireEvent.keyDown(field, { key: 'Enter' })

  // L'archivio, con la ricerca già scritta nel suo campo
  expect(await screen.findByLabelText('Cerca per nome')).toHaveValue('F40')
})

test('Esc chiude la ricerca e riporta le voci', async () => {
  renderRoute('/storia')

  fireEvent.click((await mainNav()).getByRole('button', { name: 'Cerca' }))
  fireEvent.keyDown(
    screen.getByRole('combobox', { name: "Cerca nell'archivio" }),
    { key: 'Escape' },
  )

  // Le voci tornano: la navigazione principale ha di nuovo il suo "Cerca"
  expect(
    (await mainNav()).getByRole('button', { name: 'Cerca' }),
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('combobox', { name: "Cerca nell'archivio" }),
  ).not.toBeInTheDocument()
})

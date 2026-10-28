import { fireEvent, screen, within } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

const dock = () =>
  within(screen.getByRole('navigation', { name: 'Navigazione rapida' }))

test('il monogramma riporta alla home', () => {
  renderRoute('/modelli')

  expect(
    dock().getByRole('link', { name: 'Ferrary, torna alla home' }),
  ).toHaveAttribute('href', '/')
})

test('apre e chiude il menu, anche con il tasto Esc', () => {
  renderRoute('/')

  fireEvent.click(dock().getByRole('button', { name: 'Menu' }))

  expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument()
  expect(dock().getByRole('button', { name: 'Chiudi' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )

  fireEvent.keyDown(document, { key: 'Escape' })

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('chiude il menu quando si sceglie una voce', () => {
  renderRoute('/')

  fireEvent.click(dock().getByRole('button', { name: 'Menu' }))
  const menu = within(screen.getByRole('dialog', { name: 'Menu' }))

  // Il focus entra subito nel menu, sulla prima voce
  expect(menu.getByRole('link', { name: 'Archivio' })).toHaveFocus()

  fireEvent.click(menu.getByRole('link', { name: 'Archivio' }))

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

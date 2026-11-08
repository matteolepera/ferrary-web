import { fireEvent, screen, within } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

const dock = () => within(screen.getByRole('navigation', { name: 'Navigazione rapida' }))

test('ha le stesse voci della pillola del desktop, senza la ricerca', () => {
  renderRoute('/modelli')

  expect(dock().getByRole('link', { name: 'Archivio' })).toHaveAttribute('aria-current', 'page')
  expect(dock().getByRole('link', { name: 'Famiglie' })).toHaveAttribute('href', '/#famiglie')
  expect(dock().getByRole('link', { name: 'La storia' })).toHaveAttribute('href', '/storia')
  expect(dock().queryByRole('link', { name: 'Cerca' })).not.toBeInTheDocument()
})

test('il menu contiene i cataloghi', () => {
  renderRoute('/modelli')

  fireEvent.click(dock().getByRole('button', { name: 'Menu' }))

  const menu = within(screen.getByRole('dialog', { name: 'Menu' }))
  expect(menu.getByRole('link', { name: 'Motori' })).toHaveAttribute('href', '/motori')
  expect(menu.getByRole('link', { name: 'Piloti' })).toHaveAttribute('href', '/piloti')
})
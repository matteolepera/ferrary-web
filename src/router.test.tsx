import { fireEvent, screen } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

test('mostra la home dentro il layout pubblico', () => {
  renderRoute('/')

  expect(
    screen.getByRole('heading', { name: "L'archivio di tutte le Ferrari" }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Archivio' })).toBeInTheDocument()
})

test('mostra il pannello dentro il layout admin', () => {
  renderRoute('/admin')

  expect(screen.getByRole('heading', { name: 'Pannello' })).toBeInTheDocument()
  expect(screen.getByText('Ferrary Admin')).toBeInTheDocument()
})

test('mostra il "non trovato" del sito con la navigazione pubblica', () => {
  renderRoute('/indirizzo-inventato')

  expect(
    screen.getByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Archivio' })).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: "Torna all'inizio" }),
  ).toHaveAttribute('href', '/')
})

test('mostra il "non trovato" del pannello con la sua barra laterale', () => {
  renderRoute('/admin/indirizzo-inventato')

  expect(
    screen.getByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
  expect(screen.getByText('Ferrary Admin')).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: "Torna all'inizio" }),
  ).toHaveAttribute('href', '/admin')
})

test('naviga tra le pagine con i link', () => {
  renderRoute('/')

  fireEvent.click(screen.getByRole('link', { name: 'Archivio' }))

  expect(screen.getByRole('heading', { name: 'Archivio' })).toBeInTheDocument()
})

test('il logo riporta alla home', () => {
  renderRoute('/modelli')

  expect(
    screen.getByRole('link', { name: 'Ferrary, torna alla home' }),
  ).toHaveAttribute('href', '/')
})

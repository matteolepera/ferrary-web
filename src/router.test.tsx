import { fireEvent, screen, within } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

/** Il dock: lì le voci compaiono una volta sola */
const dock = () =>
  within(screen.getByRole('navigation', { name: 'Navigazione rapida' }))

test('mostra la home dentro il layout pubblico', () => {
  renderRoute('/')

  expect(
    screen.getByRole('heading', {
      name: "Ogni Ferrari, dalla prima all'ultima.",
    }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: 'Tutte le Ferrari' }),
  ).toBeInTheDocument()
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
  expect(
    screen.getByRole('heading', { name: 'Tutte le Ferrari' }),
  ).toBeInTheDocument()
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

  fireEvent.click(dock().getByRole('link', { name: 'Archivio' }))

  expect(screen.getByRole('heading', { name: 'Archivio' })).toBeInTheDocument()
})

test('il logo riporta alla home', () => {
  renderRoute('/modelli')

  const header = within(screen.getByRole('banner'))
  expect(
    header.getByRole('link', { name: 'Ferrary, torna alla home' }),
  ).toHaveAttribute('href', '/')
})

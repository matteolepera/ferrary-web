import { fireEvent, screen, within, waitFor } from '@testing-library/react'
import { renderRoute } from '@/test/utils'
import { signIn } from './test/server'

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
  expect(dock().getByRole('link', { name: 'Archivio' })).toBeInTheDocument()
})

test('mostra il pannello dentro il layout admin', async () => {
  signIn()
  renderRoute('/admin')

  expect(
    await screen.findByRole('heading', { name: 'Pannello' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('navigation', { name: 'Area staff' }),
  ).toBeInTheDocument()
})

test('mostra il "non trovato" del sito con la navigazione pubblica', () => {
  renderRoute('/indirizzo-inventato')

  expect(
    screen.getByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
  expect(dock().getByRole('link', { name: 'Archivio' })).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: "Torna all'inizio" }),
  ).toHaveAttribute('href', '/')
})

test('mostra il "non trovato" del pannello con la sua barra laterale', async () => {
  signIn()
  renderRoute('/admin/indirizzo-inventato')

  // Prima il controllo della sessione, poi la pagina
  expect(
    await screen.findByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('navigation', { name: 'Area staff' }),
  ).toBeInTheDocument()
})

test('naviga tra le pagine con i link', async () => {
  renderRoute('/')

  fireEvent.click(dock().getByRole('link', { name: 'Archivio' }))

  expect(
    await screen.findByRole('heading', { name: 'Tutte le Ferrari' }),
  ).toBeInTheDocument()
})

test('il logo riporta alla home', async () => {
  renderRoute('/modelli')

  const header = within(await screen.findByRole('banner'))
  expect(
    header.getByRole('link', { name: 'Ferrary, torna alla home' }),
  ).toHaveAttribute('href', '/')
})

test('il primo elemento della pagina porta direttamente al contenuto', async () => {
  renderRoute('/modelli')

  expect(
    await screen.findByRole('link', { name: 'Vai al contenuto' }),
  ).toHaveAttribute('href', '#contenuto')
  expect(screen.getByRole('main')).toHaveAttribute('id', 'contenuto')
})

test('cambiando pagina il focus passa al contenuto', async () => {
  renderRoute('/')

  fireEvent.click(dock().getByRole('link', { name: 'Archivio' }))

  // Il focus si sposta quando la pagina nuova è arrivata
  await waitFor(() => expect(screen.getByRole('main')).toHaveFocus())
})

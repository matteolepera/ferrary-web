import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/router'

/**
 * Mostra il sito a un indirizzo simulato, senza un browser vero.
 */
function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
}

test('mostra la home dentro il layout pubblico', () => {
  renderAt('/')

  expect(
    screen.getByRole('heading', { name: "L'archivio di tutte le Ferrari" }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Archivio' })).toBeInTheDocument()
})

test('mostra il pannello dentro il layout admin', () => {
  renderAt('/admin')

  expect(screen.getByRole('heading', { name: 'Pannello' })).toBeInTheDocument()
  expect(screen.getByText('Ferrary Admin')).toBeInTheDocument()
})

test('mostra il "non trovato" del sito con la navigazione pubblica', () => {
  renderAt('/indirizzo-inventato')

  expect(
    screen.getByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Archivio' })).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: "Torna all'inizio" }),
  ).toHaveAttribute('href', '/')
})

test('mostra il "non trovato" del pannello con la sua barra laterale', () => {
  renderAt('/admin/indirizzo-inventato')

  expect(
    screen.getByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
  expect(screen.getByText('Ferrary Admin')).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: "Torna all'inizio" }),
  ).toHaveAttribute('href', '/admin')
})

test('naviga tra le pagine con i link', () => {
  renderAt('/')

  fireEvent.click(screen.getByRole('link', { name: 'Archivio' }))

  expect(screen.getByRole('heading', { name: 'Archivio' })).toBeInTheDocument()
})

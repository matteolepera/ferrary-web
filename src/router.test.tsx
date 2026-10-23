import { render, screen } from '@testing-library/react'
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

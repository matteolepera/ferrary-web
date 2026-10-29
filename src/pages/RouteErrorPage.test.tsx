import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { RouteErrorPage } from '@/pages/RouteErrorPage'

test('una pagina che si rompe mostra la pagina di errore, non lo schermo bianco', () => {
  // React segnala l'errore nella console: lo silenziamo, il test lo provoca apposta
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

  function Broken(): never {
    throw new Error('Un componente rotto')
  }

  const router = createMemoryRouter([
    { path: '/', element: <Broken />, errorElement: <RouteErrorPage /> },
  ])
  render(<RouterProvider router={router} />)

  expect(
    screen.getByRole('heading', { name: 'Qualcosa si è inceppato.' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: 'Ricarica la pagina' }),
  ).toBeInTheDocument()

  consoleError.mockRestore()
})

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/router'

/**
 * Mostra il sito a un indirizzo simulato, con router e cache come nell'app vera.
 */
export function renderRoute(path: string) {
  // Una cache nuova per ogni test, senza nuovi tentativi: gli errori arrivano subito
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createMemoryRouter(routes, { initialEntries: [path] })

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

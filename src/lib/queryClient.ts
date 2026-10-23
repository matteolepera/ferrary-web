import { QueryClient } from '@tanstack/react-query'

/**
 * Gestore della cache dei dati dell'API.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // I dati dell'archivio cambiano raramente: restano "freschi" per un minuto
      staleTime: 60_000,
      // Un solo nuovo tentativo in caso di errore di rete
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

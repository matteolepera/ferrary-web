import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchCurrentUser, login, logout } from '@/api/auth'

/** La voce della cache con l'utente collegato */
export const currentUserKey = ['current-user'] as const

/**
 * L'utente collegato, oppure null.
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserKey,
    queryFn: fetchCurrentUser,
    // La sessione non cambia da sola: basta ricontrollarla ogni cinque minuti
    staleTime: 5 * 60_000,
    retry: false,
  })
}

/**
 * Il login: se va a buon fine, l'utente finisce subito nella cache.
 */
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => queryClient.setQueryData(currentUserKey, user),
  })
}

/**
 * Il logout: l'utente sparisce dalla cache, insieme a tutti i dati dell'area admin.
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    // Anche se la richiesta fallisce, sul dispositivo l'utente va considerato uscito
    onSettled: () => {
      queryClient.setQueryData(currentUserKey, null)
      queryClient.removeQueries({ queryKey: ['admin'] })
    },
  })
}

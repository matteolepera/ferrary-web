import { api, initCsrf } from '@/api/client'
import { isUnauthenticated } from '@/api/errors'
import type { ApiResource } from '@/types/api'
import type { Credentials, User } from '@/types/auth'

/**
 * Login dello staff: prima il cookie CSRF, poi le credenziali.
 */
export async function login(credentials: Credentials): Promise<User> {
  await initCsrf()
  const response = await api.post<ApiResource<User>>('/login', credentials)

  return response.data.data
}

export async function logout(): Promise<void> {
  await api.post('/logout')
}

/**
 * L'utente collegato, oppure null se nessuno lo è: il 401 qui non è un errore, è una risposta.
 */
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<ApiResource<User>>('/me')

    return response.data.data
  } catch (error) {
    if (isUnauthenticated(error)) {
      return null
    }

    throw error
  }
}

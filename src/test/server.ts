import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { modelsPage, families } from '@/test/fixtures'

const API = 'http://localhost:8000/api'

/**
 * Risposte simulate dell'API per i test: ogni test può sovrascriverle con server.use().
 */
export const server = setupServer(
  http.get(`${API}/models`, () => HttpResponse.json(modelsPage)),
  http.get(`${API}/categories`, () => HttpResponse.json({ data: families })),
)

import '@testing-library/jest-dom/vitest'
import { server } from '@/test/server'

// Attiva le risposte simulate; una chiamata non prevista fa fallire il test
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
// Annulla le sovrascritture fatte da un test, così non influenzano il successivo
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

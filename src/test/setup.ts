import '@testing-library/jest-dom/vitest'
import { server } from '@/test/server'
import { i18n } from '@/i18n'

// Attiva le risposte simulate; una chiamata non prevista fa fallire il test
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
// Annulla le sovrascritture fatte da un test, così non influenzano il successivo
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
// Ogni test riparte dall'italiano, anche se il precedente ha cambiato lingua
afterEach(() => i18n.changeLanguage('it'))

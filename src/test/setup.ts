import '@testing-library/jest-dom/vitest'
import { server } from '@/test/server'
import { i18n } from '@/i18n'

// Attiva le risposte simulate; una chiamata non prevista fa fallire il test
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
// Annulla le sovrascritture fatte da un test, così non influenzano il successivo
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
// Ogni test parte dall'italiano, qualunque sia la lingua del browser simulato
beforeEach(() => i18n.changeLanguage('it'))
// Il browser simulato non sa scorrere la pagina: una finta funzione evita gli avvisi
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo

// Il browser simulato non sa aprire le finestre di dialogo native: imitiamo apertura e chiusura
HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
  this.open = true
}
HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
  this.open = false
  this.dispatchEvent(new Event('close'))
}
// Il browser simulato non sa osservare cosa entra nello schermo: un finto osservatore che non fa niente
window.IntersectionObserver = class {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
} as unknown as typeof IntersectionObserver

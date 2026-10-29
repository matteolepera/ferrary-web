import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('mostra il modello e lo scrive nel titolo della scheda', async () => {
  renderRoute('/modelli/sf90-stradale')

  expect(
    await screen.findByRole('heading', { level: 1, name: 'SF90 Stradale' }),
  ).toBeInTheDocument()
  expect(document.title).toBe('SF90 Stradale – Ferrary')
})

test('un modello che non esiste mostra il "non trovato"', async () => {
  renderRoute('/modelli/ferrari-inventata')

  expect(
    await screen.findByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
})

test('un errore del server permette di riprovare', async () => {
  server.use(
    http.get(
      'http://localhost:8000/api/models/:slug',
      () => new HttpResponse(null, { status: 500 }),
    ),
  )

  renderRoute('/modelli/sf90-stradale')

  // Prima del messaggio c'è un nuovo tentativo, dopo un secondo di attesa
  expect(
    await screen.findByRole('alert', {}, { timeout: 3000 }),
  ).toHaveTextContent('Impossibile caricare questo modello.')
  expect(screen.getByRole('button', { name: 'Riprova' })).toBeInTheDocument()
})

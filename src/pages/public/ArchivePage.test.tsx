import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { renderRoute } from '@/test/utils'

test("mostra i modelli ricevuti dall'API", async () => {
  renderRoute('/modelli')

  expect(await screen.findByText('F40')).toBeInTheDocument()
})

test("mostra un messaggio se l'API non risponde", async () => {
  server.use(
    http.get(
      'http://localhost:8000/api/models',
      () => new HttpResponse(null, { status: 500 }),
    ),
  )

  renderRoute('/modelli')

  expect(await screen.findByRole('alert')).toHaveTextContent(
    "Impossibile caricare l'archivio",
  )
})

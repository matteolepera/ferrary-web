import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { renderRoute } from '@/test/utils'
import { fireEvent } from '@testing-library/react'
import { i18n } from '@/i18n'
import { modelsPage } from '@/test/fixtures'

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
test('chiede i contenuti nella lingua del sito', async () => {
  let receivedLanguage: string | null = null

  server.use(
    http.get('http://localhost:8000/api/models', ({ request }) => {
      receivedLanguage = request.headers.get('Accept-Language')

      return HttpResponse.json(modelsPage)
    }),
  )

  await i18n.changeLanguage('en')
  renderRoute('/modelli')

  await screen.findByText('F40')
  expect(receivedLanguage).toBe('en')
})

test('ricarica i contenuti quando cambia la lingua', async () => {
  // Come il backend: lo stesso modello, con il nome nella lingua richiesta
  server.use(
    http.get('http://localhost:8000/api/models', ({ request }) => {
      const name =
        request.headers.get('Accept-Language') === 'en'
          ? 'English name'
          : 'Nome italiano'

      return HttpResponse.json({
        ...modelsPage,
        data: [{ ...modelsPage.data[0], name }],
      })
    }),
  )

  renderRoute('/modelli')
  expect(await screen.findByText('Nome italiano')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'English' }))

  expect(await screen.findByText('English name')).toBeInTheDocument()
})

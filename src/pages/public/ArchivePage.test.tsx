import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { renderRoute } from '@/test/utils'
import { screen, fireEvent, waitFor } from '@testing-library/react'
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

test("chiede all'API i filtri scritti nell'indirizzo", async () => {
  // Un oggetto, così TypeScript non si confonde con un valore assegnato dentro la funzione
  const received = { params: new URLSearchParams() }

  server.use(
    http.get('http://localhost:8000/api/models', ({ request }) => {
      received.params = new URL(request.url).searchParams

      return HttpResponse.json(modelsPage)
    }),
  )

  renderRoute('/modelli?category=hypercar&sort=-year')
  await screen.findByRole('heading', { name: 'F40' })

  expect(received.params.get('category')).toBe('hypercar')
  expect(received.params.get('sort')).toBe('-year')
})

test("scorre le pagine dell'archivio", async () => {
  server.use(
    http.get('http://localhost:8000/api/models', ({ request }) => {
      const page = Number(new URL(request.url).searchParams.get('page') ?? 1)

      return HttpResponse.json({
        ...modelsPage,
        meta: {
          ...modelsPage.meta,
          current_page: page,
          last_page: 3,
          total: 50,
        },
      })
    }),
  )

  renderRoute('/modelli')

  expect(await screen.findByText('Pagina 1 di 3')).toBeInTheDocument()
  expect(screen.getByText('50 modelli')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Precedente' })).toBeDisabled()

  fireEvent.click(screen.getByRole('button', { name: 'Successiva' }))

  expect(await screen.findByText('Pagina 2 di 3')).toBeInTheDocument()
})

test('senza risultati propone di azzerare i filtri', async () => {
  server.use(
    http.get('http://localhost:8000/api/models', () =>
      HttpResponse.json({
        ...modelsPage,
        data: [],
        meta: { ...modelsPage.meta, total: 0, from: null, to: null },
      }),
    ),
  )

  renderRoute('/modelli?category=concept')

  expect(
    await screen.findByText('Nessuna Ferrari corrisponde a questi filtri.'),
  ).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Azzera i filtri' }))

  // Senza filtri attivi, il pulsante non ha più ragione di esserci
  await waitFor(() =>
    expect(
      screen.queryByRole('button', { name: 'Azzera i filtri' }),
    ).not.toBeInTheDocument(),
  )
})

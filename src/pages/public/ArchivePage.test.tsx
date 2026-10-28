import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { renderRoute } from '@/test/utils'
import { screen, fireEvent, waitFor, within } from '@testing-library/react'
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

test('cerca per nome quando si smette di scrivere', async () => {
  const received = { params: new URLSearchParams() }

  server.use(
    http.get('http://localhost:8000/api/models', ({ request }) => {
      received.params = new URL(request.url).searchParams

      return HttpResponse.json(modelsPage)
    }),
  )

  renderRoute('/modelli')
  await screen.findByRole('heading', { name: 'F40' })

  fireEvent.change(screen.getByRole('searchbox', { name: 'Cerca per nome' }), {
    target: { value: ' F40 ' },
  })

  // La ricerca parte dopo l'attesa, senza gli spazi
  await waitFor(() => expect(received.params.get('search')).toBe('F40'))
})

test('filtra per famiglia con le pillole', async () => {
  const received = { params: new URLSearchParams() }

  server.use(
    http.get('http://localhost:8000/api/models', ({ request }) => {
      received.params = new URL(request.url).searchParams

      return HttpResponse.json(modelsPage)
    }),
  )

  renderRoute('/modelli')
  const families = within(
    await screen.findByRole('group', { name: 'Famiglia' }),
  )

  expect(families.getByRole('button', { name: 'Tutte' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  fireEvent.click(families.getByRole('button', { name: 'Hypercar' }))

  await waitFor(() => expect(received.params.get('category')).toBe('hypercar'))
  expect(families.getByRole('button', { name: 'Hypercar' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  expect(families.getByRole('button', { name: 'Tutte' })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
})
/** Risposta simulata che ricorda i parametri ricevuti */
function captureParams() {
  const received = { params: new URLSearchParams() }

  server.use(
    http.get('http://localhost:8000/api/models', ({ request }) => {
      received.params = new URL(request.url).searchParams

      return HttpResponse.json(modelsPage)
    }),
  )

  return received
}

test('filtra per motorizzazione e ordina', async () => {
  const received = captureParams()
  renderRoute('/modelli')
  await screen.findByRole('heading', { name: 'F40' })

  fireEvent.click(
    within(screen.getByRole('group', { name: 'Motorizzazione' })).getByRole(
      'button',
      { name: 'Ibrida' },
    ),
  )
  await waitFor(() => expect(received.params.get('powertrain')).toBe('ibrido'))

  fireEvent.change(screen.getByRole('combobox', { name: 'Ordina per' }), {
    target: { value: '-year' },
  })
  await waitFor(() => expect(received.params.get('sort')).toBe('-year'))
})

test('filtra per decennio e impedisce i periodi al contrario', async () => {
  const received = captureParams()
  renderRoute('/modelli')
  await screen.findByRole('heading', { name: 'F40' })

  fireEvent.change(screen.getByRole('combobox', { name: 'Dal' }), {
    target: { value: '1980' },
  })

  await waitFor(() => expect(received.params.get('year_from')).toBe('1980'))
  const to = within(screen.getByRole('combobox', { name: 'Al' }))
  expect(to.getByRole('option', { name: "Anni '70" })).toBeDisabled()
  expect(to.getByRole('option', { name: "Anni '80" })).toBeEnabled()
})

test('su mobile apre i filtri in un pannello e mostra quanti risultati darà', async () => {
  renderRoute('/modelli')
  await screen.findByRole('heading', { name: 'F40' })

  fireEvent.click(screen.getByRole('button', { name: 'Filtri' }))
  const sheet = within(screen.getByRole('dialog', { name: 'Filtri' }))

  fireEvent.click(sheet.getByRole('button', { name: 'Elettrica' }))

  expect(
    await screen.findByRole('button', { name: 'Filtri (1)' }),
  ).toBeInTheDocument()

  fireEvent.click(sheet.getByRole('button', { name: 'Mostra 2 risultati' }))

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

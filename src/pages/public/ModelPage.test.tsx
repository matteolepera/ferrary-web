import { screen, fireEvent, within, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { renderRoute } from '@/test/utils'
import { f40, modelsPage, sf90Detail } from '@/test/fixtures'

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

test("mostra la prima versione e permette di sceglierne un'altra", async () => {
  renderRoute('/modelli/sf90-stradale')

  expect(
    await screen.findByRole('heading', { level: 1, name: 'SF90 Stradale' }),
  ).toBeInTheDocument()

  const versions = within(screen.getByRole('group', { name: 'Versioni' }))
  expect(
    versions.getByRole('button', { name: 'SF90 Stradale' }),
  ).toHaveAttribute('aria-pressed', 'true')

  fireEvent.click(versions.getByRole('button', { name: 'SF90 Spider' }))

  expect(
    await screen.findByRole('heading', { level: 1, name: 'SF90 Spider' }),
  ).toBeInTheDocument()
  // La Spider è ancora in produzione
  expect(screen.getByText('Dal 2020')).toBeInTheDocument()
})

test("apre direttamente la versione scritta nell'indirizzo", async () => {
  renderRoute('/modelli/sf90-stradale?versione=sf90-spider')

  expect(
    await screen.findByRole('heading', { level: 1, name: 'SF90 Spider' }),
  ).toBeInTheDocument()
})

test('ignora una versione che non esiste e mostra la prima', async () => {
  renderRoute('/modelli/sf90-stradale?versione=inventata')

  expect(
    await screen.findByRole('heading', { level: 1, name: 'SF90 Stradale' }),
  ).toBeInTheDocument()
})

test('mostra i dati chiave della versione scelta', async () => {
  renderRoute('/modelli/sf90-stradale')

  const specs = within(
    await screen.findByRole('region', { name: 'Dati tecnici' }),
  )

  expect(specs.getByText('V8 turbo ibrido')).toBeInTheDocument()
  expect(specs.getByText('1000 cv')).toBeInTheDocument()
  expect(specs.getByText('2,5 s')).toBeInTheDocument()
  expect(specs.getByText('340 km/h')).toBeInTheDocument()
  expect(specs.getByText('3990 cm³')).toBeInTheDocument()
  expect(specs.getByText('1570 kg')).toBeInTheDocument()
  expect(specs.getByText('Serie')).toBeInTheDocument()
})

test('mostra il racconto solo se la versione ne ha uno', async () => {
  renderRoute('/modelli/sf90-stradale')

  const story = within(
    await screen.findByRole('region', { name: 'Il racconto' }),
  )
  expect(story.getByText(/novant'anni della Scuderia/)).toBeInTheDocument()

  // La Spider non ha una descrizione: niente racconto
  fireEvent.click(
    within(screen.getByRole('group', { name: 'Versioni' })).getByRole(
      'button',
      { name: 'SF90 Spider' },
    ),
  )

  await waitFor(() =>
    expect(
      screen.queryByRole('region', { name: 'Il racconto' }),
    ).not.toBeInTheDocument(),
  )
})

test('apre le foto della galleria a schermo intero e le scorre', async () => {
  renderRoute('/modelli/sf90-stradale')

  const gallery = within(
    await screen.findByRole('region', { name: 'Galleria' }),
  )
  fireEvent.click(
    gallery.getByRole('button', {
      name: 'Ingrandisci la foto: SF90 Stradale di tre quarti',
    }),
  )

  const viewer = within(screen.getByRole('dialog', { name: 'Galleria' }))
  expect(viewer.getByText('1 di 2')).toBeInTheDocument()

  fireEvent.click(viewer.getByRole('button', { name: 'Foto successiva' }))

  expect(
    viewer.getByRole('img', { name: 'SF90 Stradale vista da dietro' }),
  ).toBeInTheDocument()
  expect(viewer.getByText('2 di 2')).toBeInTheDocument()

  fireEvent.click(viewer.getByRole('button', { name: 'Chiudi la galleria' }))

  expect(document.querySelector('dialog')).not.toHaveAttribute('open')
})

test('nasconde la galleria se la versione non ha foto', async () => {
  renderRoute('/modelli/sf90-stradale?versione=sf90-spider')

  // Quando compaiono i dati tecnici, il dettaglio della Spider è arrivato
  await screen.findByRole('region', { name: 'Dati tecnici' })

  expect(
    screen.queryByRole('region', { name: 'Galleria' }),
  ).not.toBeInTheDocument()
})

test('mostra la discendenza con i link ai modelli vicini', async () => {
  server.use(
    http.get('http://localhost:8000/api/models/:slug', () =>
      HttpResponse.json({
        data: { ...sf90Detail, predecessor: f40, successors: [] },
      }),
    ),
  )

  renderRoute('/modelli/sf90-stradale')

  const lineage = within(
    await screen.findByRole('region', { name: 'Discendenza' }),
  )

  expect(lineage.getByRole('link', { name: /F40/ })).toHaveAttribute(
    'href',
    '/modelli/f40',
  )
  expect(lineage.getByText('Questo modello')).toBeInTheDocument()
})

test('senza predecessori né successori la discendenza non compare', async () => {
  renderRoute('/modelli/sf90-stradale')
  await screen.findByRole('heading', { level: 1, name: 'SF90 Stradale' })

  expect(
    screen.queryByRole('region', { name: 'Discendenza' }),
  ).not.toBeInTheDocument()
})

test('propone altri modelli della stessa famiglia', async () => {
  const received = { params: new URLSearchParams() }

  server.use(
    http.get('http://localhost:8000/api/models', ({ request }) => {
      received.params = new URL(request.url).searchParams

      return HttpResponse.json(modelsPage)
    }),
  )

  renderRoute('/modelli/sf90-stradale')

  const related = within(
    await screen.findByRole('region', { name: 'Nella stessa famiglia' }),
  )

  expect(related.getByRole('link', { name: /F40/ })).toHaveAttribute(
    'href',
    '/modelli/f40',
  )
  // Il modello che si sta guardando non si propone a sé stesso
  expect(
    related.queryByRole('link', { name: /SF90 Stradale/ }),
  ).not.toBeInTheDocument()
  expect(received.params.get('category')).toBe('stradali')
})

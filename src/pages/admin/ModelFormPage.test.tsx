import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { adminModels } from '@/test/fixtures'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

/** Apre la finestra «Nuovo modello» dall'elenco dei modelli */
async function openNewModel() {
  fireEvent.click(await screen.findByRole('button', { name: 'Nuovo modello' }))
  return within(screen.getByRole('dialog', { name: 'Nuovo modello' }))
}

test('crea un modello dalla sua finestra, e porta alla sua pagina in bozza', async () => {
  signIn()
  renderRoute('/admin/modelli')
  const dialog = await openNewModel()

  fireEvent.change(dialog.getByLabelText('Nome'), {
    target: { value: 'Testarossa' },
  })
  // L'anteprima dello slug segue il nome
  expect(
    dialog.getByText("Nell'indirizzo del sito: /modelli/testarossa"),
  ).toBeInTheDocument()

  await dialog.findByRole('option', { name: 'Sportive' })
  fireEvent.change(dialog.getByLabelText('Famiglia'), {
    target: { value: '1' },
  })
  fireEvent.change(dialog.getByLabelText('In italiano'), {
    target: { value: 'La berlinetta degli anni Ottanta.' },
  })
  fireEvent.click(dialog.getByRole('button', { name: 'Crea modello' }))

  expect(
    await screen.findByRole('heading', { name: 'Testarossa', level: 1 }),
  ).toBeInTheDocument()
  expect(screen.getByText('Modello creato: è una bozza.')).toHaveAttribute(
    'role',
    'status',
  )
})

test('il modello si legge, e i dati principali si modificano nella loro finestra', async () => {
  let sent: Record<string, unknown> | null = null
  server.use(
    http.patch(
      'http://localhost:8000/api/admin/models/:id',
      async ({ request }) => {
        sent = (await request.json()) as Record<string, unknown>
        return HttpResponse.json({ data: { ...adminModels[0], ...sent } })
      },
    ),
  )
  signIn()
  renderRoute('/admin/modelli/2')

  const card = within(
    await screen.findByRole('region', { name: 'Dati principali' }),
  )
  expect(await card.findByText('Sportive')).toBeInTheDocument()

  fireEvent.click(
    card.getByRole('button', { name: 'Modifica dati principali' }),
  )
  const dialog = within(screen.getByRole('dialog', { name: 'Dati principali' }))
  const name = dialog.getByLabelText('Nome')
  expect(name).toHaveValue('SF90 Stradale')

  fireEvent.change(name, { target: { value: 'SF90 Stradale Assetto Fiorano' } })
  fireEvent.click(
    dialog.getByRole('button', { name: 'Salva i dati principali' }),
  )

  // Salvato, la finestra si chiude; il resto del modello è partito com'era
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
  )
  expect(sent).toMatchObject({
    name: 'SF90 Stradale Assetto Fiorano',
    category_id: 1,
    description: { it: 'Ibrida plug-in.' },
  })
})

test('l’indice del modello dice cosa è completo', async () => {
  signIn()
  renderRoute('/admin/modelli/2')

  const index = within(
    await screen.findByRole('navigation', { name: 'Sezioni' }),
  )
  expect(
    index.getByRole('link', { name: 'Descrizione, completa' }),
  ).toHaveAttribute('href', '#modello-descrizione')
  expect(
    index.getByRole('link', { name: 'Versioni, completa' }),
  ).toBeInTheDocument()
})

test("mostra l'errore del backend sotto il campo giusto", async () => {
  signIn()
  renderRoute('/admin/modelli')
  const dialog = await openNewModel()

  fireEvent.change(dialog.getByLabelText('Nome'), {
    target: { value: 'SF90 Stradale' },
  })
  fireEvent.change(dialog.getByLabelText('Slug'), {
    target: { value: 'sf90-stradale' },
  })
  fireEvent.click(dialog.getByRole('button', { name: 'Crea modello' }))

  expect(
    await dialog.findByText('Questo slug è già in uso.'),
  ).toBeInTheDocument()
  expect(dialog.getByLabelText('Slug')).toHaveAttribute('aria-invalid', 'true')
})

test('un modello che non esiste è un "non trovato"', async () => {
  signIn()
  renderRoute('/admin/modelli/12345')

  expect(
    await screen.findByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
})

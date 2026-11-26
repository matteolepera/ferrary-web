import { fireEvent, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { adminVersions } from '@/test/fixtures'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('crea una versione nel modello, senza toccare motorizzazione e scheda tecnica', async () => {
  let sent: Record<string, unknown> | null = null
  server.use(
    http.post(
      'http://localhost:8000/api/admin/models/:id/versions',
      async ({ request }) => {
        sent = (await request.json()) as Record<string, unknown>
        return HttpResponse.json(
          { data: { ...adminVersions[1], ...sent, id: 77, car_model_id: 9 } },
          { status: 201 },
        )
      },
    ),
  )
  signIn()
  renderRoute('/admin/modelli/9/versioni/nuova')

  fireEvent.change(await screen.findByLabelText('Nome'), {
    target: { value: 'F80' },
  })
  fireEvent.change(screen.getByLabelText('Tipo di veicolo'), {
    target: { value: 'stradale' },
  })
  fireEvent.change(screen.getByLabelText('Anno di inizio'), {
    target: { value: '2025' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Crea versione' }))

  expect(
    await screen.findByRole('heading', { name: 'F80', level: 1 }),
  ).toBeInTheDocument()
  expect(screen.getByText('Versione creata: è una bozza.')).toHaveAttribute(
    'role',
    'status',
  )
  expect(sent).toMatchObject({
    name: 'F80',
    vehicle_type: 'stradale',
    year_start: 2025,
    seats: null,
  })
  expect(sent).toHaveProperty('specs', null)
  expect(sent).toHaveProperty('powertrain', null)
})

test("in produzione non c'è un anno di fine", async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  fireEvent.click(
    await screen.findByRole('button', { name: 'Modifica anni e produzione' }),
  )
  const dialog = within(
    screen.getByRole('dialog', { name: 'Anni e produzione' }),
  )
  const yearEnd = dialog.getByLabelText('Anno di fine')
  expect(yearEnd).toBeDisabled()

  fireEvent.click(dialog.getByLabelText(/In produzione/))

  expect(yearEnd).toBeEnabled()
})

test('una Formula 1 è sempre una monoposto', async () => {
  signIn()
  renderRoute('/admin/modelli/9/versioni/nuova')

  fireEvent.change(await screen.findByLabelText('Tipo di veicolo'), {
    target: { value: 'f1' },
  })

  const body = screen.getByLabelText('Carrozzeria')
  expect(body).toHaveValue('monoposto')
  expect(
    within(body)
      .getAllByRole('option')
      .map((option) => option.textContent),
  ).toEqual(['Non indicata', 'Monoposto'])
})

test('una versione di un altro modello è un "non trovato"', async () => {
  signIn()
  renderRoute('/admin/modelli/9/versioni/21')

  expect(
    await screen.findByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
})

test('togliendo il motore, i dati termici si disattivano e il tipo cambia', async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  // Nella pagina la motorizzazione si legge, con il nome del motore
  const card = within(
    await screen.findByRole('region', { name: 'Motorizzazione' }),
  )
  expect(await card.findByText('F154 · V8 biturbo')).toBeInTheDocument()

  fireEvent.click(card.getByRole('button', { name: 'Modifica motorizzazione' }))
  const dialog = within(screen.getByRole('dialog', { name: 'Motorizzazione' }))
  const engine = dialog.getByLabelText('Motore')
  expect(engine).toHaveValue('1')
  expect(dialog.getByText('Ibrido')).toBeInTheDocument()

  fireEvent.change(engine, { target: { value: '' } })

  expect(dialog.getByLabelText('Potenza (CV)')).toBeDisabled()
  expect(dialog.getByText('Elettrico')).toBeInTheDocument()
})

test('la scheda tecnica si legge nella pagina e si modifica nella sua finestra', async () => {
  let sent: { specs?: Record<string, unknown> } | null = null
  server.use(
    http.patch(
      'http://localhost:8000/api/admin/versions/:id',
      async ({ request }) => {
        sent = (await request.json()) as { specs?: Record<string, unknown> }
        return HttpResponse.json({ data: { ...adminVersions[0], ...sent } })
      },
    ),
  )
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  const card = within(
    await screen.findByRole('region', { name: 'Scheda tecnica' }),
  )
  expect(card.getByText('4710 mm')).toBeInTheDocument()
  expect(card.getByText('1:19')).toBeInTheDocument()

  fireEvent.click(card.getByRole('button', { name: 'Modifica scheda tecnica' }))
  const dialog = within(screen.getByRole('dialog', { name: 'Scheda tecnica' }))
  expect(dialog.getByLabelText('Lunghezza (mm)')).toHaveValue(4710)
  expect(dialog.getByText(/^Si legge 1:19/)).toBeInTheDocument()

  fireEvent.change(dialog.getByLabelText('Velocità massima (km/h)'), {
    target: { value: '345' },
  })
  fireEvent.click(
    dialog.getByRole('button', { name: 'Salva la scheda tecnica' }),
  )

  // La finestra si chiude e la pagina mostra il dato nuovo
  expect(await card.findByText('345 km/h')).toBeInTheDocument()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(sent).toMatchObject({
    specs: { top_speed_kmh: 345, length_mm: 4710, chassis_material: 'misto' },
  })
})

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
  expect(sent).not.toHaveProperty('specs')
  expect(sent).toHaveProperty('powertrain', null)
})

test("in produzione non c'è un anno di fine", async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  const yearEnd = await screen.findByLabelText('Anno di fine')
  expect(yearEnd).toBeDisabled()

  fireEvent.click(screen.getByLabelText(/In produzione/))

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

  const engine = await screen.findByLabelText('Motore')
  await screen.findByRole('option', { name: 'F154 · V8 biturbo' })
  expect(engine).toHaveValue('1')
  expect(screen.getByText('Ibrido')).toBeInTheDocument()

  fireEvent.change(engine, { target: { value: '' } })

  expect(screen.getByLabelText('Potenza (CV)')).toBeDisabled()
  expect(screen.getByText('Elettrico')).toBeInTheDocument()
})

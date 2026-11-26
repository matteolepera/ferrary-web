import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { VersionSectionModal } from './VersionSectionModal'
import type { VersionSection } from './versionSections'
import { adminVersions } from '@/test/fixtures'
import { server, signIn } from '@/test/server'
import { createQueryWrapper } from '@/test/utils'

/** La finestra di una sezione della SF90 Stradale */
function renderSection(section: VersionSection) {
  const onClose = vi.fn()
  const { wrapper } = createQueryWrapper()

  render(
    <VersionSectionModal
      modelId={2}
      version={adminVersions[0]}
      section={section}
      onClose={onClose}
    />,
    { wrapper },
  )

  return { onClose }
}

test('salva la scheda tecnica e manda il resto della versione com’era', async () => {
  let sent: Record<string, unknown> | null = null
  server.use(
    http.patch(
      'http://localhost:8000/api/admin/versions/:id',
      async ({ request }) => {
        sent = (await request.json()) as Record<string, unknown>
        return HttpResponse.json({ data: { ...adminVersions[0], ...sent } })
      },
    ),
  )
  signIn()
  const { onClose } = renderSection('scheda')

  expect(
    screen.getByRole('dialog', { name: 'Scheda tecnica' }),
  ).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Velocità massima (km/h)'), {
    target: { value: '345' },
  })
  fireEvent.click(
    screen.getByRole('button', { name: 'Salva la scheda tecnica' }),
  )

  await waitFor(() => expect(onClose).toHaveBeenCalled())
  expect(sent).toMatchObject({
    name: 'SF90 Stradale',
    year_start: 2019,
    in_production: true,
    specs: { top_speed_kmh: 345, length_mm: 4710 },
  })
})

test('un errore di un’altra sezione si vede in cima alla finestra', async () => {
  server.use(
    http.patch('http://localhost:8000/api/admin/versions/:id', () =>
      HttpResponse.json(
        {
          message: 'L’anno di inizio è obbligatorio.',
          errors: { year_start: ['L’anno di inizio è obbligatorio.'] },
        },
        { status: 422 },
      ),
    ),
  )
  signIn()
  const { onClose } = renderSection('identita')

  fireEvent.click(screen.getByRole('button', { name: 'Salva l’identità' }))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Da sistemare in un’altra sezione: L’anno di inizio è obbligatorio.',
  )
  expect(onClose).not.toHaveBeenCalled()
})

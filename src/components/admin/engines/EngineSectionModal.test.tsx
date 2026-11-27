import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { EngineSectionModal } from './EngineSectionModal'
import type { EngineSection } from './engineSections'
import { adminEngines } from '@/test/fixtures'
import { server, signIn } from '@/test/server'
import { createQueryWrapper } from '@/test/utils'

/** La finestra di una sezione del motore, il F154 se non si dice altro */
function renderSection(section: EngineSection, engine = adminEngines[0]) {
  const onClose = vi.fn()
  const { wrapper } = createQueryWrapper()

  render(
    <EngineSectionModal engine={engine} section={section} onClose={onClose} />,
    { wrapper },
  )

  return { onClose }
}

test('salva i dati tecnici e manda anche la descrizione com’era', async () => {
  let sent: Record<string, unknown> | null = null
  server.use(
    http.patch(
      'http://localhost:8000/api/admin/engines/:id',
      async ({ request }) => {
        sent = (await request.json()) as Record<string, unknown>
        return HttpResponse.json({ data: { ...adminEngines[0], ...sent } })
      },
    ),
  )
  signIn()
  const { onClose } = renderSection('dati')

  // Il motore in poche parole, già dai dati salvati
  expect(screen.getByText('V8 a 90°, 3990 cm³')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Valvole per cilindro'), {
    target: { value: '5' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Salva i dati tecnici' }))

  await waitFor(() => expect(onClose).toHaveBeenCalled())
  expect(sent).toMatchObject({
    code: 'F154',
    valves_per_cylinder: 5,
    description: { it: 'Il V8 biturbo.' },
  })
})

test("l'angolo della V si compila solo per i motori a V", () => {
  signIn()
  renderSection('dati', { ...adminEngines[0], architecture: 'in_linea' })

  const angle = screen.getByLabelText('Angolo della V (°)')
  expect(angle).toBeDisabled()

  fireEvent.change(screen.getByLabelText('Architettura'), {
    target: { value: 'V' },
  })

  expect(angle).toBeEnabled()
})

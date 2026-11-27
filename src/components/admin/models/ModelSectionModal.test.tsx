import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { ModelSectionModal } from './ModelSectionModal'
import type { ModelSection } from './modelSections'
import { adminModels } from '@/test/fixtures'
import { server, signIn } from '@/test/server'
import { createQueryWrapper } from '@/test/utils'

/** La finestra di una sezione della SF90 */
function renderSection(section: ModelSection) {
  const onClose = vi.fn()
  const { wrapper } = createQueryWrapper()

  render(
    <ModelSectionModal
      model={adminModels[0]}
      section={section}
      onClose={onClose}
    />,
    { wrapper },
  )

  return { onClose }
}

test('salva la descrizione e manda il resto del modello com’era', async () => {
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
  const { onClose } = renderSection('descrizione')

  fireEvent.change(screen.getByLabelText('In inglese'), {
    target: { value: 'The first plug-in hybrid Ferrari.' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Salva la descrizione' }))

  await waitFor(() => expect(onClose).toHaveBeenCalled())
  expect(sent).toMatchObject({
    name: adminModels[0].name,
    category_id: adminModels[0].category_id,
    description: { en: 'The first plug-in hybrid Ferrari.' },
  })
})

test('i dati principali segnano gli obbligatori', () => {
  signIn()
  renderSection('dati')

  expect(screen.getByLabelText('Nome')).toHaveAttribute('aria-required', 'true')
  expect(screen.getByLabelText('Famiglia')).toHaveAttribute(
    'aria-required',
    'true',
  )
  expect(screen.getByLabelText('Slug')).not.toHaveAttribute('aria-required')
})

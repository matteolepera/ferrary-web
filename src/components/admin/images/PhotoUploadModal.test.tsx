import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

const photo = (name: string, type = 'image/jpeg') =>
  new File(['pixel'], name, { type })

/** Apre la finestra delle foto della SF90 Spider */
async function openUpload() {
  signIn()
  renderRoute('/admin/modelli/2/versioni/11')

  fireEvent.click(await screen.findByRole('button', { name: 'Aggiungi foto' }))
  return within(screen.getByRole('dialog', { name: 'Aggiungi foto' }))
}

test('aggiunge una foto alla coda, con il testo alternativo precompilato, e la carica', async () => {
  const dialog = await openUpload()

  fireEvent.change(dialog.getByLabelText('Scegli le foto'), {
    target: { files: [photo('laterale.jpg')] },
  })

  expect(await dialog.findByText('laterale.jpg')).toBeInTheDocument()
  expect(dialog.getByLabelText('Testo alternativo')).toHaveValue('SF90 Spider')

  fireEvent.click(await dialog.findByRole('button', { name: 'Carica 1 foto' }))

  // Arrivate tutte, la finestra si chiude e la pagina lo annuncia
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
  )
  expect(screen.getByText('1 foto caricata.')).toBeInTheDocument()
})

test('scarta subito un formato non supportato', async () => {
  const dialog = await openUpload()

  fireEvent.change(dialog.getByLabelText('Scegli le foto'), {
    target: { files: [photo('scheda.pdf', 'application/pdf')] },
  })

  expect(
    await dialog.findByText('Formato non supportato: usa JPG, PNG o WebP.'),
  ).toBeInTheDocument()
  expect(dialog.getByRole('button', { name: 'Carica 0 foto' })).toBeDisabled()
})

test('senza testo alternativo non si carica', async () => {
  const dialog = await openUpload()

  fireEvent.change(dialog.getByLabelText('Scegli le foto'), {
    target: { files: [photo('laterale.jpg')] },
  })
  fireEvent.change(await dialog.findByLabelText('Testo alternativo'), {
    target: { value: '' },
  })

  expect(
    dialog.getByText('Il testo alternativo in italiano è obbligatorio.'),
  ).toBeInTheDocument()
  expect(
    await dialog.findByRole('button', { name: 'Carica 1 foto' }),
  ).toBeDisabled()
})

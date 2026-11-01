import { fireEvent, screen, waitFor } from '@testing-library/react'
import { signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

const photo = (name: string, type = 'image/jpeg') =>
  new File(['pixel'], name, { type })

test('aggiunge una foto alla coda, con il testo alternativo precompilato, e la carica', async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/11')

  fireEvent.change(await screen.findByLabelText('Scegli le foto'), {
    target: { files: [photo('laterale.jpg')] },
  })

  expect(await screen.findByText('laterale.jpg')).toBeInTheDocument()
  expect(screen.getByLabelText('Testo alternativo')).toHaveValue('SF90 Spider')

  fireEvent.click(await screen.findByRole('button', { name: 'Carica 1 foto' }))

  await waitFor(() =>
    expect(screen.queryByText('laterale.jpg')).not.toBeInTheDocument(),
  )
  expect(screen.getByText('1 foto caricata.')).toBeInTheDocument()
})

test('scarta subito un formato non supportato', async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/11')

  fireEvent.change(await screen.findByLabelText('Scegli le foto'), {
    target: { files: [photo('scheda.pdf', 'application/pdf')] },
  })

  expect(
    await screen.findByText('Formato non supportato: usa JPG, PNG o WebP.'),
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Carica 0 foto' })).toBeDisabled()
})

test('senza testo alternativo non si carica', async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/11')

  fireEvent.change(await screen.findByLabelText('Scegli le foto'), {
    target: { files: [photo('laterale.jpg')] },
  })
  fireEvent.change(await screen.findByLabelText('Testo alternativo'), {
    target: { value: '' },
  })

  expect(
    screen.getByText('Il testo alternativo in italiano è obbligatorio.'),
  ).toBeInTheDocument()
  expect(
    await screen.findByRole('button', { name: 'Carica 1 foto' }),
  ).toBeDisabled()
})

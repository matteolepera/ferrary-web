import type { FormEvent } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { AdminModal } from './AdminModal'
import { AdminField } from './AdminField'

function renderModal(props: { dirty?: boolean } = {}) {
  const onClose = vi.fn()
  // L'evento di React, come quello che riceve il modulo vero; preventDefault evita il ricaricamento
  const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) =>
    event.preventDefault(),
  )

  render(
    <AdminModal
      open
      onClose={onClose}
      title="Nuova famiglia"
      submitLabel="Crea famiglia"
      onSubmit={onSubmit}
      {...props}
    >
      <AdminField label="Nome" />
    </AdminModal>,
  )

  return { onClose, onSubmit }
}

test('si apre con il titolo e il cursore sul primo campo', () => {
  renderModal()

  expect(
    screen.getByRole('dialog', { name: 'Nuova famiglia' }),
  ).toBeInTheDocument()
  expect(screen.getByLabelText('Nome')).toHaveFocus()
})

test('il pulsante in fondo invia il modulo', () => {
  const { onSubmit } = renderModal()

  fireEvent.click(screen.getByRole('button', { name: 'Crea famiglia' }))

  expect(onSubmit).toHaveBeenCalled()
})

test('senza modifiche, Annulla chiude subito', () => {
  const { onClose } = renderModal()

  fireEvent.click(screen.getByRole('button', { name: 'Annulla' }))

  expect(onClose).toHaveBeenCalled()
})

test('con modifiche non salvate, Esc chiede prima conferma', () => {
  const { onClose } = renderModal({ dirty: true })

  // Esc sul <dialog> arriva come evento "cancel"
  fireEvent(
    screen.getByRole('dialog'),
    new Event('cancel', { cancelable: true }),
  )

  expect(onClose).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Chiudi senza salvare' }))
  expect(onClose).toHaveBeenCalled()
})

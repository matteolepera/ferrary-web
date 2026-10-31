import { fireEvent, render, screen } from '@testing-library/react'
import { AdminField } from './AdminField'
import { PasswordField } from './PasswordField'
import { AdminSelect } from './AdminSelect'
import { AdminTextarea } from './AdminTextarea'

test("collega l'etichetta e l'errore al campo", () => {
  render(<AdminField label="Email" error="Email o password non corrette." />)

  const field = screen.getByLabelText('Email')
  expect(field).toHaveAttribute('aria-invalid', 'true')
  expect(field).toHaveAccessibleDescription('Email o password non corrette.')
})

test('senza errore il campo è valido', () => {
  render(<AdminField label="Email" />)

  expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid')
})

test("l'occhio mostra e nasconde la password", () => {
  render(<PasswordField label="Password" />)

  const field = screen.getByLabelText('Password')
  const toggle = screen.getByRole('button', { name: 'Mostra la password' })
  expect(field).toHaveAttribute('type', 'password')

  fireEvent.click(toggle)
  expect(field).toHaveAttribute('type', 'text')
  expect(toggle).toHaveAttribute('aria-pressed', 'true')

  fireEvent.click(toggle)
  expect(field).toHaveAttribute('type', 'password')
})

test("il menu e l'area di testo collegano etichetta ed errore, come il campo", () => {
  render(
    <>
      <AdminSelect label="Famiglia" error="Scegli una famiglia.">
        <option value="">Scegli</option>
      </AdminSelect>
      <AdminTextarea
        label="Descrizione in italiano"
        error="La descrizione in italiano è obbligatoria."
      />
    </>,
  )

  expect(screen.getByLabelText('Famiglia')).toHaveAccessibleDescription(
    'Scegli una famiglia.',
  )
  expect(screen.getByLabelText('Descrizione in italiano')).toHaveAttribute(
    'aria-invalid',
    'true',
  )
})

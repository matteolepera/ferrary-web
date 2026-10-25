import { render, screen } from '@testing-library/react'
import { TextField } from '@/components/ui/TextField'

test("collega l'etichetta e il suggerimento al campo", () => {
  render(<TextField label="Email" hint="L'indirizzo usato per lo staff" />)

  const input = screen.getByLabelText('Email')

  expect(input).toHaveAccessibleDescription("L'indirizzo usato per lo staff")
  expect(input).not.toHaveAttribute('aria-invalid')
})

test("mostra l'errore e segna il campo come non valido", () => {
  render(
    <TextField
      label="Email"
      hint="Suggerimento"
      error="Email o password non corrette."
    />,
  )

  const input = screen.getByLabelText('Email')

  expect(input).toHaveAttribute('aria-invalid', 'true')
  // L'errore sostituisce il suggerimento
  expect(input).toHaveAccessibleDescription('Email o password non corrette.')
})

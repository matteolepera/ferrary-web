import { fireEvent, render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

test("esegue l'azione e non invia form per sbaglio", () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Esplora</Button>)

  const button = screen.getByRole('button', { name: 'Esplora' })
  fireEvent.click(button)

  expect(onClick).toHaveBeenCalledOnce()
  expect(button).toHaveAttribute('type', 'button')
})

test('non risponde quando è disattivato', () => {
  const onClick = vi.fn()
  render(
    <Button onClick={onClick} disabled>
      Esplora
    </Button>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Esplora' }))

  expect(onClick).not.toHaveBeenCalled()
})

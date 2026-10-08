import { render, screen } from '@testing-library/react'
import App from './App'

test('mostra il nome del progetto', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Ferrary' })).toBeInTheDocument()
})

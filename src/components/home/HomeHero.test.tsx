import { screen } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

test("presenta la Ferrari in copertina e porta all'archivio", () => {
  renderRoute('/')

  expect(
    screen.getByRole('img', { name: 'Ferrari SF90 Stradale rossa' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: "Esplora l'archivio" }),
  ).toHaveAttribute('href', '/modelli')
})

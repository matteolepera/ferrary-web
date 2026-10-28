import { screen } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

test("chiude la home con l'invito all'archivio", () => {
  renderRoute('/')

  expect(screen.getByRole('link', { name: "Apri l'archivio" })).toHaveAttribute(
    'href',
    '/modelli',
  )
})

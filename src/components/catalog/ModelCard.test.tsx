import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { ModelCard } from '@/components/catalog/ModelCard'
import { f40 } from '@/test/fixtures'
import type { CarModel } from '@/types/catalog'

function renderCard(model: CarModel) {
  render(
    <MemoryRouter>
      <ModelCard model={model} />
    </MemoryRouter>,
  )
}

test('porta alla pagina del modello e ne mostra i dati chiave', () => {
  renderCard(f40)

  expect(screen.getByRole('link', { name: /F40/ })).toHaveAttribute(
    'href',
    '/modelli/f40',
  )
  expect(screen.getByRole('heading', { name: 'F40' })).toBeInTheDocument()
  expect(screen.getByText('478 cv')).toBeInTheDocument()
  expect(screen.getByText('4,1 s')).toBeInTheDocument()
  expect(screen.getByText('324 km/h')).toBeInTheDocument()
})

test('senza foto né dati chiave mostra i segnaposto', () => {
  renderCard({ ...f40, cover: null, highlights: null })

  expect(screen.getByText('Foto in arrivo')).toBeInTheDocument()
  expect(screen.getAllByText('n.d.')).toHaveLength(3)
})

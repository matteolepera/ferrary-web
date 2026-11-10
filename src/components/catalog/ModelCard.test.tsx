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
  // Il numero e la sua unità stanno in due elementi: si legge il valore accanto all'etichetta
  expect(screen.getByText('Potenza').nextSibling).toHaveTextContent('478 cv')
  expect(screen.getByText('0–100 km/h').nextSibling).toHaveTextContent('4,1 s')
  expect(screen.getByText('Velocità max').nextSibling).toHaveTextContent(
    '324 km/h',
  )
})

test('senza foto mostra il segnaposto, e senza dati chiave non mostra la loro riga', () => {
  renderCard({ ...f40, cover: null, highlights: null })

  // Senza foto, il nome in filigrana al posto della scritta
  expect(screen.queryByText('Foto in arrivo')).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'F40' })).toBeInTheDocument()
  expect(screen.queryByText('Potenza')).not.toBeInTheDocument()
})

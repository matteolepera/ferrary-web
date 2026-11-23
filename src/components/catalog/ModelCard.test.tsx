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

test('per le auto che hanno corso mostra i risultati invece della velocità', () => {
  renderCard({
    ...f40,
    highlights: {
      power_cv: null,
      zero_to_100_sec: null,
      top_speed_kmh: null,
      racing: { races: 20, wins: 15, titles: 2 },
    },
  })

  expect(screen.getByText('Vittorie').nextSibling).toHaveTextContent('15')
  expect(screen.getByText('Gare').nextSibling).toHaveTextContent('20')
  expect(screen.queryByText('Potenza')).not.toBeInTheDocument()
})

test('con i risultati tutti a zero torna ai dati della scheda tecnica', () => {
  renderCard({
    ...f40,
    highlights: {
      ...f40.highlights!,
      racing: { races: 0, wins: 0, titles: 0 },
    },
  })

  expect(screen.getByText('Potenza').nextSibling).toHaveTextContent('478 cv')
  expect(screen.queryByText('Vittorie')).not.toBeInTheDocument()
})

import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { ToCompleteCard } from '@/components/admin/dashboard/ToCompleteCard'
import { dashboard } from '@/test/fixtures'

function renderCard(
  items = dashboard.to_complete,
  counts = dashboard.to_complete_counts,
) {
  render(
    <MemoryRouter>
      <ToCompleteCard items={items} counts={counts} />
    </MemoryRouter>,
  )
}

test('mostra cosa manca a ogni versione, con il link per modificarla', () => {
  renderCard()

  const issues = within(screen.getAllByRole('list', { name: 'Cosa manca' })[0])
  expect(issues.getByText('Bozza')).toBeInTheDocument()
  expect(issues.getByText('Senza foto')).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: 'Modifica SF90 Spider' }),
  ).toHaveAttribute('href', '/admin/modelli/2/versioni/11')
})

test('filtra per mancanza, e lo dice quando non resta niente', () => {
  renderCard()

  const noSpecs = screen.getByRole('button', { name: /^Dati incompleti/ })
  fireEvent.click(noSpecs)

  expect(noSpecs).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByText('296 GTB')).toBeInTheDocument()
  expect(screen.queryByText('SF90 Spider')).not.toBeInTheDocument()
})

test('i numeri sono quelli del database, e dice quante card mostra', () => {
  renderCard()

  expect(
    screen.getByRole('button', { name: /^Dati incompleti/ }),
  ).toHaveTextContent('8')
  expect(
    screen.getByText('Le 2 modificate più di recente, su 9.'),
  ).toBeInTheDocument()
})

test('festeggia quando non manca niente', () => {
  renderCard([], { all: 0, draft: 0, no_photos: 0, no_specs: 0 })

  expect(
    screen.getByText('Tutto completo: ogni versione ha foto e scheda tecnica.'),
  ).toBeInTheDocument()
})

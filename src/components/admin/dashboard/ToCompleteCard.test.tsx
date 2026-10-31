import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { ToCompleteCard } from '@/components/admin/dashboard/ToCompleteCard'
import { dashboard } from '@/test/fixtures'

function renderCard(items = dashboard.to_complete) {
  render(
    <MemoryRouter>
      <ToCompleteCard items={items} />
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

test('festeggia quando non manca niente', () => {
  renderCard([])

  expect(
    screen.getByText('Tutto completo: ogni versione ha foto e scheda tecnica.'),
  ).toBeInTheDocument()
})

import { fireEvent, render, screen } from '@testing-library/react'
import { ScheduleCard } from '@/components/admin/dashboard/ScheduleCard'
import { dashboard } from '@/test/fixtures'

beforeEach(() => {
  // Solo l'orologio è finto: i timer veri servono a waitFor e a TanStack Query
  vi.useFakeTimers({ toFake: ['Date'] })
  // Giovedì 29 ottobre 2026, a mezzogiorno
  vi.setSystemTime(new Date(2026, 9, 29, 12))
})

afterEach(() => {
  vi.useRealTimers()
})

test('mostra la settimana di oggi, con le pubblicazioni segnate', () => {
  render(<ScheduleCard items={dashboard.scheduled} />)

  expect(
    screen.getByRole('heading', { name: 'Ottobre – Novembre 2026' }),
  ).toBeInTheDocument()
  expect(screen.getByText('Giovedì 29 ottobre, oggi')).toBeInTheDocument()
  expect(
    screen.getByText('Venerdì 30 ottobre, 1 pubblicazione'),
  ).toBeInTheDocument()
  expect(screen.getByText('812 GTS')).toBeInTheDocument()
  expect(screen.getByText('Nuova versione')).toBeInTheDocument()
  expect(screen.getByText('Nuovo modello')).toBeInTheDocument()
})

test('si sposta di settimana con le frecce', () => {
  render(<ScheduleCard items={[]} />)

  fireEvent.click(screen.getByRole('button', { name: 'Settimana successiva' }))

  expect(
    screen.getByRole('heading', { name: 'Novembre 2026' }),
  ).toBeInTheDocument()
  expect(
    screen.getByText('Nessuna pubblicazione in programma.'),
  ).toBeInTheDocument()
})

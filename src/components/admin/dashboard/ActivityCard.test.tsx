import { fireEvent, render, screen } from '@testing-library/react'
import { ActivityCard } from '@/components/admin/dashboard/ActivityCard'
import { dashboard } from '@/test/fixtures'

test('racconta ogni azione in una frase', () => {
  render(<ActivityCard items={dashboard.activity} showTabs />)

  const items = screen.getAllByRole('listitem')
  expect(items[0]).toHaveTextContent('Matteo ha programmato 812 GTS')
  expect(items[1]).toHaveTextContent('Matteo ha cambiato il ruolo di Giulia')
})

test('le schede separano il catalogo dallo staff', () => {
  render(<ActivityCard items={dashboard.activity} showTabs />)

  fireEvent.click(screen.getByRole('button', { name: 'Staff' }))

  expect(screen.getByRole('button', { name: 'Staff' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  expect(screen.queryByText('812 GTS')).not.toBeInTheDocument()
  expect(screen.getByText('Giulia')).toBeInTheDocument()
})

test("senza il log dello staff non mostra le schede, e dà un nome anche a ciò che non ce l'ha", () => {
  render(
    <ActivityCard
      items={[
        {
          ...dashboard.activity[0],
          action: 'updated',
          subject_type: 'image',
          subject_name: null,
        },
      ]}
      showTabs={false}
    />,
  )

  expect(
    screen.queryByRole('button', { name: 'Staff' }),
  ).not.toBeInTheDocument()
  expect(screen.getByRole('listitem')).toHaveTextContent(
    'Matteo ha modificato una foto',
  )
})

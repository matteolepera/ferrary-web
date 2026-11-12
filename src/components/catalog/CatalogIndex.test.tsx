import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { CatalogIndex } from '@/components/catalog/CatalogIndex'

const items = [
  { id: 1, to: '/piloti/niki-lauda', name: 'Niki Lauda', meta: 'Austria' },
  {
    id: 2,
    to: '/piloti/gilles-villeneuve',
    name: 'Gilles Villeneuve',
    meta: 'Canada',
  },
]

test('cerca nel nome e nei dettagli, e senza risultati propone di cancellare la ricerca', () => {
  render(
    <MemoryRouter>
      <CatalogIndex
        title="Piloti"
        text=""
        items={items}
        isPending={false}
        isError={false}
      />
    </MemoryRouter>,
  )

  const search = screen.getByRole('searchbox', { name: 'Cerca nel catalogo' })

  fireEvent.change(search, { target: { value: 'canada' } })
  expect(
    screen.getByRole('link', { name: /Gilles Villeneuve/ }),
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('link', { name: /Niki Lauda/ }),
  ).not.toBeInTheDocument()

  fireEvent.change(search, { target: { value: 'zzz' } })
  fireEvent.click(screen.getByRole('button', { name: 'Cancella la ricerca' }))
  expect(screen.getAllByRole('link')).toHaveLength(2)
})

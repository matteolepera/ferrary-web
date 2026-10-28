import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { useArchiveFilters } from '@/hooks/useArchiveFilters'

/** Usa l'hook come se la pagina fosse aperta a un certo indirizzo */
function renderAt(url: string) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
  )

  return renderHook(() => useArchiveFilters(), { wrapper })
}

test("legge i filtri dall'indirizzo e ignora i valori non validi", () => {
  const { result } = renderAt(
    '/modelli?category=hypercar&year_from=1980&sort=prezzo&powertrain=diesel&page=abc',
  )

  expect(result.current.filters).toEqual({
    search: undefined,
    category: 'hypercar',
    powertrain: undefined,
    year_from: 1980,
    year_to: undefined,
    sort: undefined,
    page: undefined,
  })
})

test('cambiando un filtro torna alla prima pagina e toglie i valori vuoti', () => {
  const { result } = renderAt('/modelli?category=hypercar&page=3')

  act(() => result.current.setFilters({ search: 'f40' }))

  expect(result.current.filters.search).toBe('f40')
  expect(result.current.filters.category).toBe('hypercar')
  expect(result.current.filters.page).toBeUndefined()

  act(() => result.current.setFilters({ category: undefined }))

  expect(result.current.filters.category).toBeUndefined()
})

test('cambia pagina senza toccare gli altri filtri', () => {
  const { result } = renderAt('/modelli?category=hypercar')

  act(() => result.current.setFilters({ page: 2 }))

  expect(result.current.filters).toMatchObject({
    category: 'hypercar',
    page: 2,
  })
})

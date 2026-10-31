import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, useLocation } from 'react-router'
import { useAdminModelFilters } from '@/hooks/useAdminModelFilters'

function renderFilters(url: string) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
  )

  return renderHook(
    () => ({ ...useAdminModelFilters(), location: useLocation() }),
    { wrapper },
  )
}

test("legge i filtri dall'indirizzo, ignorando quelli non validi", () => {
  const { result } = renderFilters(
    '/admin/modelli?status=draft&category_id=3&page=2&search=sf90',
  )
  expect(result.current.filters).toEqual({
    search: 'sf90',
    status: 'draft',
    category_id: 3,
    page: 2,
  })

  const { result: invalid } = renderFilters(
    '/admin/modelli?status=pippo&page=-1&category_id=abc',
  )
  expect(invalid.current.filters).toEqual({
    search: undefined,
    status: undefined,
    category_id: undefined,
    page: undefined,
  })
})

test('cambiando un filtro riparte dalla prima pagina', () => {
  const { result } = renderFilters('/admin/modelli?status=draft&page=3')

  act(() => result.current.setFilters({ status: 'published' }))

  expect(result.current.location.search).toBe('?status=published')
})

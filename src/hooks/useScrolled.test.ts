import { act, renderHook } from '@testing-library/react'
import { useScrolled } from '@/hooks/useScrolled'

test('diventa vero quando la pagina scende oltre la soglia', () => {
  const { result } = renderHook(() => useScrolled(24))
  expect(result.current).toBe(false)

  act(() => {
    window.scrollY = 200
    window.dispatchEvent(new Event('scroll'))
  })
  expect(result.current).toBe(true)

  act(() => {
    window.scrollY = 0
    window.dispatchEvent(new Event('scroll'))
  })
  expect(result.current).toBe(false)
})

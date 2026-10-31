import { act, renderHook, waitFor } from '@testing-library/react'
import { validationErrors } from '@/api/errors'
import { useAdminModel, useSaveModel } from '@/hooks/useAdminModel'
import { adminModels } from '@/test/fixtures'
import { createQueryWrapper } from '@/test/utils'

const payload = {
  name: 'F80',
  category_id: 3,
  predecessor_id: null,
  description: { it: 'La nuova hypercar.' },
}

test('carica un modello, e non carica niente per un modello nuovo', async () => {
  const { wrapper } = createQueryWrapper()
  const { result } = renderHook(
    () => ({ existing: useAdminModel(2), fresh: useAdminModel(undefined) }),
    { wrapper },
  )

  await waitFor(() =>
    expect(result.current.existing.data).toEqual(adminModels[0]),
  )
  expect(result.current.fresh.fetchStatus).toBe('idle')
})

test('crea un modello nuovo, che nasce in bozza', async () => {
  const { queryClient, wrapper } = createQueryWrapper()
  const { result } = renderHook(() => useSaveModel(undefined), { wrapper })

  const model = await act(() =>
    result.current.mutateAsync({ ...payload, name: 'Testarossa' }),
  )

  expect(model.status).toBe('draft')
  expect(model.slug).toBe('testarossa')
  expect(queryClient.getQueryData(['admin', 'models', model.id])).toEqual(model)
})

test('rifiuta uno slug già usato, con il messaggio del campo', async () => {
  const { wrapper } = createQueryWrapper()
  const { result } = renderHook(() => useSaveModel(undefined), { wrapper })

  await act(() =>
    result.current
      .mutateAsync({ ...payload, name: 'SF90 Stradale', slug: 'sf90-stradale' })
      .catch(() => {}),
  )

  await waitFor(() => expect(result.current.isError).toBe(true))
  expect(validationErrors(result.current.error)?.slug).toEqual([
    'Questo slug è già in uso.',
  ])
})

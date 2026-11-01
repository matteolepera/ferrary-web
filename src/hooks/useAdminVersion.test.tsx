import { act, renderHook, waitFor } from '@testing-library/react'
import { useModelVersions, useSaveVersion } from '@/hooks/useAdminVersion'
import { createQueryWrapper } from '@/test/utils'

test('carica le versioni di un modello', async () => {
  const { wrapper } = createQueryWrapper()
  const { result } = renderHook(() => useModelVersions(2), { wrapper })

  await waitFor(() =>
    expect(result.current.data?.map((version) => version.name)).toEqual([
      'SF90 Stradale',
      'SF90 Spider',
    ]),
  )
})

test('crea una versione nel modello, in bozza', async () => {
  const { queryClient, wrapper } = createQueryWrapper()
  const { result } = renderHook(() => useSaveVersion(9, undefined), { wrapper })

  const version = await act(() =>
    result.current.mutateAsync({
      name: 'F80',
      vehicle_type: 'stradale',
      body_type: 'coupe',
      project_code: null,
      seats: 2,
      year_start: 2025,
      year_end: null,
      in_production: true,
      production_type: 'serie_limitata',
      units_produced: 799,
      description: {},
      sort_order: 1,
      specs: null,
      powertrain: null,
    }),
  )

  expect(version).toMatchObject({
    id: 77,
    car_model_id: 9,
    slug: 'f80',
    status: 'draft',
  })
  expect(queryClient.getQueryData(['admin', 'versions', 77])).toEqual(version)
})

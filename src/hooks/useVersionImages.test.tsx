import { act, renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { useImageActions, useVersionImages } from '@/hooks/useVersionImages'
import { server } from '@/test/server'
import { createQueryWrapper } from '@/test/utils'
import { imageForm } from '@/api/admin'

test('carica le foto di una versione, nell’ordine della galleria', async () => {
  const { wrapper } = createQueryWrapper()
  const { result } = renderHook(() => useVersionImages(21), { wrapper })

  await waitFor(() =>
    expect(result.current.data?.map((image) => image.id)).toEqual([31, 32]),
  )
})

test('il modulo contiene il file e il testo alternativo per lingua', () => {
  const file = new File(['pixel'], 'laterale.jpg', { type: 'image/jpeg' })

  const form = imageForm({
    file,
    altText: { it: 'SF90 Stradale, vista laterale' },
  })

  expect((form.get('image') as File).name).toBe('laterale.jpg')
  expect(form.get('alt_text[it]')).toBe('SF90 Stradale, vista laterale')
  // L'inglese vuoto non viene inviato
  expect(form.has('alt_text[en]')).toBe(false)
})

test('carica la foto come modulo multipart', async () => {
  let contentType: string | null = null
  server.use(
    http.post(
      'http://localhost:8000/api/admin/versions/:id/images',
      ({ request }) => {
        contentType = request.headers.get('Content-Type')
        return HttpResponse.json({ data: { id: 99 } }, { status: 201 })
      },
    ),
  )

  const { wrapper } = createQueryWrapper()
  const { result } = renderHook(() => useImageActions(21), { wrapper })
  const file = new File(['pixel'], 'laterale.jpg', { type: 'image/jpeg' })

  const image = await act(() =>
    result.current.upload.mutateAsync({
      file,
      altText: { it: 'Vista laterale' },
    }),
  )

  expect(image.id).toBe(99)
  expect(contentType).toMatch(/^multipart\/form-data/)
})

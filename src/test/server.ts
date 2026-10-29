import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  modelsPage,
  families,
  sf90Detail,
  sf90StradaleDetail,
  sf90Spider,
  designers,
  manzoniDetail,
  drivers,
  schumacherDetail,
  engines,
  f154faDetail,
} from '@/test/fixtures'

const API = 'http://localhost:8000/api'

/**
 * Risposte simulate dell'API per i test: ogni test può sovrascriverle con server.use().
 */
export const server = setupServer(
  http.get(`${API}/models`, () => HttpResponse.json(modelsPage)),
  http.get(`${API}/categories`, () => HttpResponse.json({ data: families })),
  http.get(`${API}/models/:slug`, ({ params }) =>
    params.slug === sf90Detail.slug
      ? HttpResponse.json({ data: sf90Detail })
      : new HttpResponse(null, { status: 404 }),
  ),
  http.get(`${API}/versions/:slug`, ({ params }) => {
    const version = [sf90StradaleDetail, sf90Spider].find(
      (item) => item.slug === params.slug,
    )

    return version
      ? HttpResponse.json({ data: version })
      : new HttpResponse(null, { status: 404 })
  }),
  http.get(`${API}/designers`, () => HttpResponse.json({ data: designers })),
  http.get(`${API}/designers/:slug`, ({ params }) =>
    params.slug === manzoniDetail.slug
      ? HttpResponse.json({ data: manzoniDetail })
      : new HttpResponse(null, { status: 404 }),
  ),
  http.get(`${API}/drivers`, () => HttpResponse.json({ data: drivers })),
  http.get(`${API}/drivers/:slug`, ({ params }) =>
    params.slug === schumacherDetail.slug
      ? HttpResponse.json({ data: schumacherDetail })
      : new HttpResponse(null, { status: 404 }),
  ),
  http.get(`${API}/engines`, () => HttpResponse.json({ data: engines })),
  http.get(`${API}/engines/:id`, ({ params }) =>
    params.id === String(f154faDetail.id)
      ? HttpResponse.json({ data: f154faDetail })
      : new HttpResponse(null, { status: 404 }),
  ),
)

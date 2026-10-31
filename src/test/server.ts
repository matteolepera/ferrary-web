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
  dashboard,
  staffMembers,
  adminModels,
  adminCategories,
} from '@/test/fixtures'
import { staffUser, STAFF_PASSWORD } from '@/test/fixtures'
import type { ModelPayload } from '@/types/admin'

const BACKEND = 'http://localhost:8000'
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
  http.get(
    `${BACKEND}/sanctum/csrf-cookie`,
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.post(`${API}/login`, async ({ request }) => {
    const credentials = (await request.json()) as {
      email: string
      password: string
    }

    return credentials.password === STAFF_PASSWORD
      ? HttpResponse.json({ data: staffUser })
      : HttpResponse.json(
          {
            message: 'Email o password non corrette.',
            errors: { email: ['Email o password non corrette.'] },
          },
          { status: 422 },
        )
  }),
  // Di base nessuno è collegato: i test che vogliono un utente sovrascrivono questa risposta
  http.get(`${API}/me`, () => new HttpResponse(null, { status: 401 })),
  http.post(`${API}/logout`, () => new HttpResponse(null, { status: 204 })),
  http.get(`${API}/admin/dashboard`, () =>
    HttpResponse.json({ data: dashboard }),
  ),
  http.get(`${API}/admin/staff`, () =>
    HttpResponse.json({ data: staffMembers }),
  ),
  http.get(`${API}/admin/categories`, () =>
    HttpResponse.json({ data: adminCategories }),
  ),
  http.get(`${API}/admin/models`, ({ request }) => {
    const params = new URL(request.url).searchParams
    const status = params.get('status')
    const categoryId = params.get('category_id')
    const search = params.get('search')?.toLowerCase()

    const data = adminModels.filter(
      (model) =>
        (!status || model.status === status) &&
        (!categoryId || model.category_id === Number(categoryId)) &&
        (!search || model.name.toLowerCase().includes(search)),
    )

    return HttpResponse.json({
      data,
      meta: { current_page: 1, last_page: 1, per_page: 20, total: data.length },
      links: {},
    })
  }),
  http.get(`${API}/admin/models/:id`, ({ params }) => {
    const model = adminModels.find((item) => item.id === Number(params.id))

    return model
      ? HttpResponse.json({ data: model })
      : new HttpResponse(null, { status: 404 })
  }),
  http.post(`${API}/admin/models`, async ({ request }) => {
    const payload = (await request.json()) as ModelPayload
    const slug = payload.slug || payload.name.toLowerCase().replaceAll(' ', '-')

    if (adminModels.some((model) => model.slug === slug)) {
      return HttpResponse.json(
        {
          message: 'Questo slug è già in uso.',
          errors: { slug: ['Questo slug è già in uso.'] },
        },
        { status: 422 },
      )
    }

    return HttpResponse.json(
      {
        data: {
          ...adminModels[0],
          ...payload,
          id: 99,
          slug,
          status: 'draft',
          published_at: null,
        },
      },
      { status: 201 },
    )
  }),
  http.patch(`${API}/admin/models/:id`, async ({ params, request }) => {
    const model = adminModels.find((item) => item.id === Number(params.id))
    const payload = (await request.json()) as ModelPayload

    return model
      ? HttpResponse.json({ data: { ...model, ...payload } })
      : new HttpResponse(null, { status: 404 })
  }),
  http.post(`${API}/admin/models/:id/publish`, async ({ params, request }) => {
    const model = adminModels.find((item) => item.id === Number(params.id))
    const body = (await request.json()) as { published_at?: string }
    const publishedAt = body.published_at ?? new Date().toISOString()
    const status =
      new Date(publishedAt) > new Date() ? 'scheduled' : 'published'

    // Come il backend vero: la risposta non ha la famiglia né le versioni
    return model
      ? HttpResponse.json({
          data: {
            ...model,
            category: undefined,
            versions_count: undefined,
            published_at: publishedAt,
            status,
          },
        })
      : new HttpResponse(null, { status: 404 })
  }),
  http.post(`${API}/admin/models/:id/unpublish`, ({ params }) => {
    const model = adminModels.find((item) => item.id === Number(params.id))

    return model
      ? HttpResponse.json({
          data: {
            ...model,
            category: undefined,
            versions_count: undefined,
            published_at: null,
            status: 'draft',
          },
        })
      : new HttpResponse(null, { status: 404 })
  }),
)

/**
 * Simula una sessione attiva: /me risponde con l'utente invece del 401.
 */
export function signIn(user = staffUser) {
  server.use(http.get(`${API}/me`, () => HttpResponse.json({ data: user })))
}

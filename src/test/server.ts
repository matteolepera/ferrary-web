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
  adminVersions,
  adminImages,
  adminEngines,
  adminDesigners,
  adminDrivers,
  adminRacing,
} from '@/test/fixtures'
import { staffUser, STAFF_PASSWORD } from '@/test/fixtures'
import type {
  ModelPayload,
  VersionPayload,
  AdminImage,
  AdminCategory,
  EnginePayload,
  AdminDesigner,
  AdminDriver,
  RacingPayload,
} from '@/types/admin'
import type { User } from '@/types/auth'

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
  http.get(`${API}/admin/engines`, () =>
    HttpResponse.json({ data: adminEngines }),
  ),
  http.get(`${API}/admin/engines/:id`, ({ params }) => {
    const engine = adminEngines.find((item) => item.id === Number(params.id))

    return engine
      ? HttpResponse.json({ data: engine })
      : new HttpResponse(null, { status: 404 })
  }),
  http.post(`${API}/admin/engines`, async ({ request }) => {
    const payload = (await request.json()) as EnginePayload

    return HttpResponse.json(
      { data: { ...adminEngines[1], ...payload, id: 60, versions_count: 0 } },
      { status: 201 },
    )
  }),
  http.patch(`${API}/admin/engines/:id`, async ({ params, request }) => {
    const engine = adminEngines.find((item) => item.id === Number(params.id))
    const payload = (await request.json()) as EnginePayload

    return engine
      ? HttpResponse.json({ data: { ...engine, ...payload } })
      : new HttpResponse(null, { status: 404 })
  }),
  http.delete(
    `${API}/admin/engines/:id`,
    () => new HttpResponse(null, { status: 204 }),
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
  http.get(`${API}/admin/models/:id/versions`, ({ params }) =>
    HttpResponse.json({
      data: adminVersions.filter(
        (version) => version.car_model_id === Number(params.id),
      ),
    }),
  ),
  http.get(`${API}/admin/versions/:id`, ({ params }) => {
    const version = adminVersions.find((item) => item.id === Number(params.id))

    return version
      ? HttpResponse.json({ data: version })
      : new HttpResponse(null, { status: 404 })
  }),
  http.post(`${API}/admin/models/:id/versions`, async ({ params, request }) => {
    const payload = (await request.json()) as VersionPayload

    return HttpResponse.json(
      {
        data: {
          ...adminVersions[1],
          ...payload,
          id: 77,
          car_model_id: Number(params.id),
          slug: payload.slug || payload.name.toLowerCase().replaceAll(' ', '-'),
          status: 'draft',
          published_at: null,
        },
      },
      { status: 201 },
    )
  }),
  http.patch(`${API}/admin/versions/:id`, async ({ params, request }) => {
    const version = adminVersions.find((item) => item.id === Number(params.id))
    const payload = (await request.json()) as VersionPayload

    return version
      ? HttpResponse.json({ data: { ...version, ...payload } })
      : new HttpResponse(null, { status: 404 })
  }),
  http.get(`${API}/admin/engines`, () =>
    HttpResponse.json({
      data: [
        { id: 1, code: 'F154', name: 'V8 biturbo' },
        { id: 2, code: 'F140', name: 'V12' },
      ],
    }),
  ),
  http.post(
    `${API}/admin/versions/:id/publish`,
    async ({ params, request }) => {
      const version = adminVersions.find(
        (item) => item.id === Number(params.id),
      )
      const body = (await request.json()) as { published_at?: string }
      const publishedAt = body.published_at ?? new Date().toISOString()
      const status =
        new Date(publishedAt) > new Date() ? 'scheduled' : 'published'

      // Come il backend vero: la risposta non ha scheda tecnica e motorizzazione
      return version
        ? HttpResponse.json({
            data: {
              ...version,
              specs: undefined,
              powertrain: undefined,
              published_at: publishedAt,
              status,
            },
          })
        : new HttpResponse(null, { status: 404 })
    },
  ),
  http.post(`${API}/admin/versions/:id/unpublish`, ({ params }) => {
    const version = adminVersions.find((item) => item.id === Number(params.id))

    return version
      ? HttpResponse.json({
          data: {
            ...version,
            specs: undefined,
            powertrain: undefined,
            published_at: null,
            status: 'draft',
          },
        })
      : new HttpResponse(null, { status: 404 })
  }),

  http.get(`${API}/admin/versions/:id/images`, ({ params }) =>
    HttpResponse.json({ data: Number(params.id) === 21 ? adminImages : [] }),
  ),
  http.post(`${API}/admin/versions/:id/images`, () =>
    HttpResponse.json(
      {
        data: {
          id: 99,
          url: 'http://localhost:8000/storage/versions/nuova/foto.jpg',
          alt_text: { it: 'Foto caricata' },
          is_cover: false,
          sort_order: 3,
        },
      },
      { status: 201 },
    ),
  ),
  http.patch(`${API}/admin/images/:id`, async ({ params, request }) => {
    const image = adminImages.find((item) => item.id === Number(params.id))
    const changes = (await request.json()) as Partial<AdminImage>

    return image
      ? HttpResponse.json({ data: { ...image, ...changes } })
      : new HttpResponse(null, { status: 404 })
  }),
  http.delete(
    `${API}/admin/images/:id`,
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.put(`${API}/admin/versions/:id/images/order`, async ({ request }) => {
    const { images } = (await request.json()) as { images: number[] }

    return HttpResponse.json({
      data: images.map((id) => adminImages.find((image) => image.id === id)),
    })
  }),
  http.post(`${API}/admin/categories`, async ({ request }) => {
    const payload = (await request.json()) as {
      name: { it: string; en?: string }
      sort_order: number
    }

    return HttpResponse.json(
      {
        data: {
          id: 50,
          name: payload.name,
          slug: payload.name.it.toLowerCase(),
          sort_order: payload.sort_order,
          car_models_count: 0,
        },
      },
      { status: 201 },
    )
  }),
  http.patch(`${API}/admin/categories/:id`, async ({ params, request }) => {
    const category = adminCategories.find(
      (item) => item.id === Number(params.id),
    )
    const payload = (await request.json()) as Partial<AdminCategory>

    return category
      ? HttpResponse.json({ data: { ...category, ...payload } })
      : new HttpResponse(null, { status: 404 })
  }),
  http.delete(
    `${API}/admin/categories/:id`,
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.get(`${API}/admin/designers`, () =>
    HttpResponse.json({ data: adminDesigners }),
  ),
  http.post(`${API}/admin/designers`, () =>
    HttpResponse.json(
      { data: { ...adminDesigners[0], id: 70 } },
      { status: 201 },
    ),
  ),
  http.patch(`${API}/admin/designers/:id`, async ({ params, request }) => {
    const designer = adminDesigners.find(
      (item) => item.id === Number(params.id),
    )
    const payload = (await request.json()) as Partial<AdminDesigner>

    return designer
      ? HttpResponse.json({ data: { ...designer, ...payload } })
      : new HttpResponse(null, { status: 404 })
  }),
  http.delete(
    `${API}/admin/designers/:id`,
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.get(`${API}/admin/drivers`, () =>
    HttpResponse.json({ data: adminDrivers }),
  ),
  http.post(`${API}/admin/drivers`, () =>
    HttpResponse.json(
      { data: { ...adminDrivers[0], id: 80 } },
      { status: 201 },
    ),
  ),
  http.patch(`${API}/admin/drivers/:id`, async ({ params, request }) => {
    const driver = adminDrivers.find((item) => item.id === Number(params.id))
    const payload = (await request.json()) as Partial<AdminDriver>

    return driver
      ? HttpResponse.json({ data: { ...driver, ...payload } })
      : new HttpResponse(null, { status: 404 })
  }),
  http.delete(
    `${API}/admin/drivers/:id`,
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.put(`${API}/admin/versions/:id/designers`, () =>
    HttpResponse.json({ data: [] }),
  ),
  http.put(`${API}/admin/versions/:id/drivers`, () =>
    HttpResponse.json({ data: [] }),
  ),
  http.get(`${API}/admin/versions/:id/racing`, ({ params }) =>
    HttpResponse.json({ data: Number(params.id) === 21 ? adminRacing : [] }),
  ),
  http.post(`${API}/admin/versions/:id/racing`, async ({ request }) => {
    const payload = (await request.json()) as RacingPayload

    return HttpResponse.json(
      { data: { ...adminRacing[0], ...payload, id: 92 } },
      { status: 201 },
    )
  }),
  http.patch(`${API}/admin/racing/:id`, async ({ request }) => {
    const payload = (await request.json()) as RacingPayload

    return HttpResponse.json({ data: { ...adminRacing[0], ...payload } })
  }),
  http.delete(
    `${API}/admin/racing/:id`,
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.post(`${API}/admin/staff`, async ({ request }) => {
    const payload = (await request.json()) as {
      name: string
      email: string
      role: string
    }

    return HttpResponse.json(
      {
        data: {
          id: 40,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        },
      },
      { status: 201 },
    )
  }),
  http.patch(`${API}/admin/staff/:id/role`, async ({ params, request }) => {
    const person = staffMembers.find((item) => item.id === Number(params.id))
    const { role } = (await request.json()) as { role: string }

    return person
      ? HttpResponse.json({ data: { ...person, role } })
      : new HttpResponse(null, { status: 404 })
  }),
  http.patch(`${API}/admin/staff/:id`, async ({ params, request }) => {
    const person = staffMembers.find((item) => item.id === Number(params.id))
    const changes = (await request.json()) as Partial<User>

    return person
      ? HttpResponse.json({ data: { ...person, ...changes } })
      : new HttpResponse(null, { status: 404 })
  }),
  http.delete(
    `${API}/admin/staff/:id`,
    () => new HttpResponse(null, { status: 204 }),
  ),
)

/**
 * Simula una sessione attiva: /me risponde con l'utente invece del 401.
 */
export function signIn(user = staffUser) {
  server.use(http.get(`${API}/me`, () => HttpResponse.json({ data: user })))
}

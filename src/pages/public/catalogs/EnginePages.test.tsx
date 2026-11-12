import { fireEvent, screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { renderRoute } from '@/test/utils'

test('elenca i motori con architettura, cilindrata e numero di Ferrari', async () => {
  renderRoute('/motori')

  const link = await screen.findByRole('link', { name: /F154FA/ })

  expect(link).toHaveAttribute('href', '/motori/1')
  expect(link).toHaveTextContent('F154FA')
  expect(link).toHaveTextContent('V8 a 90° · 3990 cm³ · turbo')
  expect(link).toHaveTextContent('1 Ferrari')
})

test('mostra un motore con le sue caratteristiche e le Ferrari che lo montano', async () => {
  renderRoute('/motori/1')

  expect(
    await screen.findByRole('heading', { level: 1, name: 'F154FA' }),
  ).toBeInTheDocument()
  expect(screen.getByText('V8 a 90°')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /SF90 Stradale/ })).toHaveAttribute(
    'href',
    '/modelli/sf90-stradale?versione=sf90-stradale',
  )
})

test('dalla scheda tecnica si arriva alla pagina del motore', async () => {
  renderRoute('/modelli/sf90-stradale')

  const sheet = within(
    await screen.findByRole('region', { name: 'Scheda tecnica' }),
  )

  expect(sheet.getByRole('link', { name: 'F154FA' })).toHaveAttribute(
    'href',
    '/motori/1',
  )
})

test('un motore che non esiste mostra il "non trovato"', async () => {
  renderRoute('/motori/999')

  expect(
    await screen.findByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
})

test('filtra i motori per architettura', async () => {
  server.use(
    http.get('http://localhost:8000/api/engines', () =>
      HttpResponse.json({
        data: [
          {
            id: 1,
            code: 'F140B',
            name: null,
            architecture: 'V',
            cylinders: 12,
            v_angle_deg: 65,
            displacement_cc: 5998,
            aspiration: 'aspirato',
            versions_count: 1,
          },
          {
            id: 2,
            code: 'F120A',
            name: null,
            architecture: 'V',
            cylinders: 8,
            v_angle_deg: 90,
            displacement_cc: 2936,
            aspiration: 'turbo',
            versions_count: 1,
          },
        ],
      }),
    ),
  )

  renderRoute('/motori')
  expect(await screen.findByRole('link', { name: /F140B/ })).toBeInTheDocument()

  fireEvent.change(screen.getByRole('combobox', { name: 'Architettura' }), {
    target: { value: 'V-8' },
  })

  expect(screen.getByRole('link', { name: /F120A/ })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /F140B/ })).not.toBeInTheDocument()
})

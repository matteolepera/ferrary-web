import { screen, within } from '@testing-library/react'
import { renderRoute } from '@/test/utils'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'

test('elenca i piloti con la nazionalità e il numero di Ferrari', async () => {
  renderRoute('/piloti')

  const link = await screen.findByRole('link', { name: /Michael Schumacher/ })

  expect(link).toHaveAttribute('href', '/piloti/michael-schumacher')
  expect(link).toHaveTextContent('Germania')
  expect(link).toHaveTextContent('1 Ferrari')
})

test('mostra un pilota con la data di nascita e le Ferrari guidate', async () => {
  renderRoute('/piloti/michael-schumacher')

  expect(
    await screen.findByRole('heading', {
      level: 1,
      name: 'Michael Schumacher',
    }),
  ).toBeInTheDocument()
  expect(screen.getByText('3 gennaio 1969')).toBeInTheDocument()
  expect(screen.getByText('Con la Ferrari').nextSibling).toHaveTextContent(
    '2004',
  )

  const card = screen.getByRole('link', { name: /F2004/ })
  expect(card).toHaveAttribute('href', '/modelli/f2004?versione=f2004')
  expect(card).toHaveTextContent('Formula 1')
})

test('un pilota che non esiste mostra il "non trovato"', async () => {
  renderRoute('/piloti/inventato')

  expect(
    await screen.findByRole('heading', { name: 'Pagina non trovata' }),
  ).toBeInTheDocument()
})

test("raggruppa i piloti per cognome, con l'indice delle lettere", async () => {
  server.use(
    http.get('http://localhost:8000/api/drivers', () =>
      HttpResponse.json({
        data: [
          {
            id: 1,
            first_name: 'Niki',
            last_name: 'Lauda',
            slug: 'niki-lauda',
            nationality: 'AT',
            versions_count: 4,
          },
          {
            id: 2,
            first_name: 'Jean',
            last_name: 'Alesi',
            slug: 'jean-alesi',
            nationality: 'FR',
            versions_count: 6,
          },
        ],
      }),
    ),
  )

  renderRoute('/piloti')
  const index = within(
    await screen.findByRole('navigation', { name: 'Indice alfabetico' }),
  )

  // Le lettere con un pilota portano al loro gruppo; le altre non sono link
  expect(index.getByRole('link', { name: 'A' })).toHaveAttribute(
    'href',
    '#lettera-A',
  )
  expect(index.getByRole('link', { name: 'L' })).toHaveAttribute(
    'href',
    '#lettera-L',
  )
  expect(index.queryByRole('link', { name: 'B' })).not.toBeInTheDocument()

  // Il gruppo della L contiene Lauda
  const groupL = within(screen.getByRole('region', { name: /^L/ }))
  expect(groupL.getByRole('link', { name: /Niki Lauda/ })).toBeInTheDocument()
})

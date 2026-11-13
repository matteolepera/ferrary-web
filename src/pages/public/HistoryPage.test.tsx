import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { renderRoute } from '@/test/utils'

const formula1 = { slug: 'formula-1', name: 'Formula 1' }
const sportive = { slug: 'sportive', name: 'Sportive' }

beforeEach(() => {
  server.use(
    http.get('http://localhost:8000/api/models/timeline', () =>
      HttpResponse.json({
        data: [
          {
            id: 1,
            slug: '125-f1',
            name: '125 F1',
            first_year: 1950,
            category: formula1,
          },
          {
            id: 2,
            slug: '166-inter',
            name: '166 Inter',
            first_year: 1950,
            category: sportive,
          },
          {
            id: 3,
            slug: '553-f1',
            name: '553 F1',
            first_year: 1953,
            category: formula1,
          },
        ],
      }),
    ),
  )
})

test('divide le Ferrari per decennio, con il racconto e i numeri', async () => {
  renderRoute('/storia')

  const decade = within(await screen.findByRole('region', { name: "Anni '50" }))
  expect(decade.getByText(/Le Ferrari nascono per correre/)).toBeInTheDocument()
  // Tre Ferrari, una stradale e due da corsa
  expect(decade.getByText('Stradali').nextSibling).toHaveTextContent('1')
  expect(decade.getByText('Corsa').nextSibling).toHaveTextContent('2')
})

test('mette le Ferrari nella riga del loro anno, anche con gli anni vuoti in mezzo', async () => {
  renderRoute('/storia')

  const decade = within(await screen.findByRole('region', { name: "Anni '50" }))
  const rows = decade
    .getAllByRole('listitem')
    .filter((row) => /^\d{4}/.test(row.textContent ?? ''))

  // Dal 1950 al 1953: quattro righe, con il 1951 e il 1952 vuoti
  expect(rows.map((row) => row.textContent?.slice(0, 4))).toEqual([
    '1950',
    '1951',
    '1952',
    '1953',
  ])
  expect(decade.getByRole('link', { name: '125 F1' })).toHaveAttribute(
    'href',
    '/modelli/125-f1',
  )
})

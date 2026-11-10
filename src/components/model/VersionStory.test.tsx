import { render, screen } from '@testing-library/react'
import { VersionStory } from '@/components/model/VersionStory'
import type { Version } from '@/types/catalog'

/** Una versione con la descrizione scelta: il resto non conta per il racconto */
const withStory = (description: string | null) =>
  ({
    name: 'F40',
    slug: 'f40',
    years: { start: 1987, end: 1992, in_production: false },
    description,
  }) as Version

test('un racconto lungo ha la sua sezione', () => {
  const long = 'Presentata a Maranello nel 1987. '.repeat(10)

  render(<VersionStory version={withStory(long)} />)

  expect(
    screen.getByRole('region', { name: 'Il racconto' }),
  ).toBeInTheDocument()
})

test('un racconto breve, o nessun racconto, non ha una sezione', () => {
  const { rerender } = render(
    <VersionStory version={withStory('La berlinetta, con 478 cv.')} />,
  )
  expect(
    screen.queryByRole('region', { name: 'Il racconto' }),
  ).not.toBeInTheDocument()

  rerender(<VersionStory version={withStory(null)} />)
  expect(
    screen.queryByRole('region', { name: 'Il racconto' }),
  ).not.toBeInTheDocument()
})

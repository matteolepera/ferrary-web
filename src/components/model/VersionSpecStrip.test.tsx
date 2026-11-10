import { render, screen } from '@testing-library/react'
import { VersionSpecStrip } from '@/components/model/VersionSpecStrip'
import type { Version } from '@/types/catalog'

/** Una monoposto con il minimo dei dati: motore, anno e risultati, nient'altro */
const monoposto = {
  id: 1,
  name: '126 C2',
  slug: '126-c2',
  vehicle_type: 'f1',
  body_type: 'monoposto',
  project_code: null,
  seats: 1,
  years: { start: 1982, end: 1982, in_production: false },
  production: { type: null, units: null },
  description: null,
  specs: null,
  powertrain: {
    type: 'termico',
    engine: {
      id: 1,
      code: '021',
      name: null,
      architecture: 'V',
      v_angle_deg: 120,
      cylinders: 6,
      displacement_cc: 1496,
      bore_mm: null,
      stroke_mm: null,
      valves_per_cylinder: null,
      aspiration: 'turbo',
      description: null,
    },
    combustion: null,
    electric: null,
    system: { power_cv: null, torque_nm: null },
    transmission: {
      gearbox_type: 'manuale',
      gears: null,
      drivetrain: 'posteriore',
    },
  },
  racing: [
    {
      championship: 'Formula 1',
      season_start: 1982,
      season_end: 1982,
      races: 16,
      wins: 3,
      poles: null,
      podiums: null,
      fastest_laps: null,
      drivers_titles: 0,
      constructors_titles: 1,
      notes: null,
    },
  ],
} as Version

test('per una monoposto mostra stagione e risultati, e mai "n.d."', () => {
  render(<VersionSpecStrip version={monoposto} />)

  expect(screen.getByText('Vittorie').nextSibling).toHaveTextContent('3')
  expect(screen.getByText('Gare').nextSibling).toHaveTextContent('16')
  expect(screen.getByText('Stagione').nextSibling).toHaveTextContent('1982')
  expect(screen.queryByText('Potenza')).not.toBeInTheDocument()
  expect(screen.queryByText('n.d.')).not.toBeInTheDocument()
})

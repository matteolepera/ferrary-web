import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { TechSheet } from '@/components/model/TechSheet'
import type { Version } from '@/types/catalog'

/** Una versione con il solo motore termico: niente parte elettrica */
const termica = {
  id: 1,
  name: 'F40',
  slug: 'f40',
  vehicle_type: 'stradale',
  body_type: 'coupe',
  project_code: null,
  seats: 2,
  years: { start: 1987, end: 1992, in_production: false },
  production: { type: 'serie_limitata', units: 1315 },
  description: null,
  specs: null,
  powertrain: {
    type: 'termico',
    engine: {
      id: 7,
      code: 'F120A',
      name: null,
      architecture: 'V',
      v_angle_deg: 90,
      cylinders: 8,
      displacement_cc: 2936,
      bore_mm: 82,
      stroke_mm: 69.5,
      valves_per_cylinder: 4,
      aspiration: 'turbo',
      description: null,
    },
    combustion: {
      power_cv: 478,
      torque_nm: 577,
      max_rpm: null,
      fuel_consumption_l100: null,
    },
    electric: null,
    system: { power_cv: null, torque_nm: null },
    transmission: {
      gearbox_type: 'manuale',
      gears: 5,
      drivetrain: 'posteriore',
    },
  },
} as Version

test("divide la meccanica in motore e trasmissione, senza la parte elettrica se non c'è", () => {
  render(
    <MemoryRouter>
      <TechSheet version={termica} />
    </MemoryRouter>,
  )

  expect(
    screen.getByRole('heading', { name: 'Motore termico' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: 'Trasmissione' }),
  ).toBeInTheDocument()
  expect(
    screen.queryByRole('heading', { name: 'Parte elettrica' }),
  ).not.toBeInTheDocument()
  // Il codice del motore porta alla sua pagina
  expect(screen.getByRole('link', { name: 'F120A' })).toHaveAttribute(
    'href',
    '/motori/7',
  )
})

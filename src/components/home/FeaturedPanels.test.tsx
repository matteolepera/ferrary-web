import { fireEvent, screen } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

test('mostra le ultime arrivate come link alle loro schede', async () => {
  renderRoute('/')

  expect(await screen.findByRole('link', { name: /F40/ })).toHaveAttribute(
    'href',
    '/modelli/f40',
  )
  expect(screen.getByRole('link', { name: /SF90 Stradale/ })).toHaveAttribute(
    'href',
    '/modelli/sf90-stradale',
  )
  expect(
    screen.getByRole('link', { name: "Tutto l'archivio" }),
  ).toHaveAttribute('href', '/modelli')
})

test('il pannello sotto il mouse si apre, e il primo si chiude', async () => {
  renderRoute('/')

  const f40 = await screen.findByRole('link', { name: /F40/ })
  const sf90 = screen.getByRole('link', { name: /SF90 Stradale/ })

  // All'inizio è aperto il primo
  expect(f40).toHaveAttribute('data-active')
  expect(sf90).not.toHaveAttribute('data-active')

  fireEvent.mouseEnter(sf90)

  expect(sf90).toHaveAttribute('data-active')
  expect(f40).not.toHaveAttribute('data-active')
})

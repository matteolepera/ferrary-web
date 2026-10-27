import { fireEvent, screen } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

test('cambia la lingua del sito', async () => {
  renderRoute('/')

  fireEvent.click(screen.getByRole('button', { name: 'English' }))

  expect(
    await screen.findByRole('heading', {
      name: 'Every Ferrari, from the first to the latest.',
    }),
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  expect(screen.getByRole('button', { name: 'Italiano' })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
})

test('ricorda la scelta e aggiorna la lingua della pagina', async () => {
  renderRoute('/')

  fireEvent.click(screen.getByRole('button', { name: 'English' }))
  await screen.findByRole('heading', {
    name: 'Every Ferrari, from the first to the latest.',
  })

  expect(localStorage.getItem('ferrary-language')).toBe('en')
  expect(document.documentElement.lang).toBe('en')
})

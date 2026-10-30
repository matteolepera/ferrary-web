import { screen } from '@testing-library/react'
import { signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

test("sul telefono, al posto dell'area admin, invita a usare uno schermo più grande", async () => {
  signIn()
  renderRoute('/admin')

  expect(
    await screen.findByRole('heading', {
      name: 'Serve uno schermo più grande',
    }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Torna al sito' })).toHaveAttribute(
    'href',
    '/',
  )
})

import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { adminVersions } from '@/test/fixtures'
import { server, signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

const card = async () =>
  within(await screen.findByRole('region', { name: 'Versioni' }))

test('elenca le versioni del modello, con anni, carrozzeria e stato', async () => {
  signIn()
  renderRoute('/admin/modelli/2')

  const versions = await card()
  expect(
    await versions.findByRole('link', { name: 'SF90 Stradale' }),
  ).toHaveAttribute('href', '/admin/modelli/2/versioni/21')
  expect(
    versions.getByText('2019 – oggi · Stradale · Coupé'),
  ).toBeInTheDocument()
  expect(versions.getByText('Bozza')).toBeInTheDocument()
  expect(
    versions.getByRole('link', { name: 'Nuova versione' }),
  ).toHaveAttribute('href', '/admin/modelli/2/versioni/nuova')
})

test('avvisa quando il modello è pubblicato ma nessuna versione lo è', async () => {
  server.use(
    http.get('http://localhost:8000/api/admin/models/:id/versions', () =>
      HttpResponse.json({ data: [adminVersions[1]] }),
    ),
  )
  signIn()
  renderRoute('/admin/modelli/2')

  expect(
    await (
      await card()
    ).findByText(
      'Il modello è pubblicato, ma non compare sul sito: serve almeno una versione pubblicata.',
    ),
  ).toBeInTheDocument()
})

test('spiega cosa succede a un modello senza versioni', async () => {
  signIn()
  renderRoute('/admin/modelli/9')

  expect(
    await (
      await card()
    ).findByText(
      'Nessuna versione: il modello comparirà sul sito quando ne avrà almeno una pubblicata.',
    ),
  ).toBeInTheDocument()
})

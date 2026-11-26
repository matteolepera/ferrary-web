import { fireEvent, screen, within } from '@testing-library/react'
import { signIn } from '@/test/server'
import { renderRoute } from '@/test/utils'

const card = async () =>
  within(await screen.findByRole('region', { name: 'Pubblicazione' }))

test('pubblica una versione in bozza, senza perdere la scheda tecnica', async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/11')

  fireEvent.click((await card()).getByRole('button', { name: 'Pubblica ora' }))

  expect(await (await card()).findByText(/^Online dal/)).toBeInTheDocument()
})

test('ritirare una versione pubblicata chiede conferma, parlando della versione', async () => {
  signIn()
  renderRoute('/admin/modelli/2/versioni/21')

  fireEvent.click(
    (await card()).getByRole('button', { name: 'Riporta in bozza' }),
  )

  expect((await card()).getByRole('alertdialog')).toHaveTextContent(
    'La versione sparirà dal sito. Confermi?',
  )
  // La scheda tecnica è ancora nella pagina: la risposta è stata unita alla versione
  expect(
    within(screen.getByRole('region', { name: 'Scheda tecnica' })).getByText(
      '4710 mm',
    ),
  ).toBeInTheDocument()
})

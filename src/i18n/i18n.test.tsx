import { screen, within } from '@testing-library/react'
import { i18n } from '@/i18n'
import en from '@/i18n/locales/en.json'
import it from '@/i18n/locales/it.json'
import { renderRoute } from '@/test/utils'

/**
 * Elenco piatto delle chiavi di un file di traduzione, es. "archive.title".
 */
function keysOf(translations: object, prefix = ''): string[] {
  return Object.entries(translations).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? keysOf(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )
}

test('mostra il sito in inglese', async () => {
  await i18n.changeLanguage('en')

  renderRoute('/')

  expect(
    screen.getByRole('heading', {
      name: 'Every Ferrari, from the first to the latest.',
    }),
  ).toBeInTheDocument()
  expect(
    within(
      screen.getByRole('navigation', { name: 'Quick navigation' }),
    ).getByRole('link', { name: 'Archive' }),
  ).toBeInTheDocument()
})

test('ha le stesse chiavi in tutte le lingue', () => {
  expect(keysOf(en).sort()).toEqual(keysOf(it).sort())
})

import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { Manettino, type ManettinoOption } from '@/components/ui/Manettino'

type Family = 'tutte' | 'stradali' | 'corsa'

const options: ManettinoOption<Family>[] = [
  { value: 'tutte', label: 'Tutte' },
  { value: 'stradali', label: 'Stradali' },
  { value: 'corsa', label: 'Corsa' },
]

/** Un genitore con il suo stato, come nella pagina vera */
function Panel() {
  const [family, setFamily] = useState<Family>('tutte')

  return (
    <Manettino
      label="Famiglia"
      options={options}
      value={family}
      onValueChange={setFamily}
    />
  )
}

test('è un gruppo di scelte con la posizione selezionata', () => {
  render(<Panel />)

  expect(
    screen.getByRole('radiogroup', { name: 'Famiglia' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('radio', { name: 'Tutte' })).toBeChecked()
  expect(screen.getByRole('radio', { name: 'Stradali' })).not.toBeChecked()
})

test('seleziona una posizione con un clic', () => {
  render(<Panel />)

  fireEvent.click(screen.getByRole('radio', { name: 'Corsa' }))

  expect(screen.getByRole('radio', { name: 'Corsa' })).toBeChecked()
  expect(screen.getByRole('radio', { name: 'Tutte' })).not.toBeChecked()
})

test('si muove con le frecce della tastiera', () => {
  render(<Panel />)

  fireEvent.keyDown(screen.getByRole('radio', { name: 'Tutte' }), {
    key: 'ArrowRight',
  })

  const stradali = screen.getByRole('radio', { name: 'Stradali' })
  expect(stradali).toBeChecked()
  expect(stradali).toHaveFocus()
})

test('con il tasto Tab si entra solo dalla posizione selezionata', () => {
  render(<Panel />)

  expect(screen.getByRole('radio', { name: 'Tutte' })).toHaveAttribute(
    'tabindex',
    '0',
  )
  expect(screen.getByRole('radio', { name: 'Stradali' })).toHaveAttribute(
    'tabindex',
    '-1',
  )
  expect(screen.getByRole('radio', { name: 'Corsa' })).toHaveAttribute(
    'tabindex',
    '-1',
  )
})

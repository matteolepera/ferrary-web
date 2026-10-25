import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Manettino } from '@/components/ui/Manettino'

export function HomePage() {
  const { t } = useTranslation()
  const [family, setFamily] = useState('tutte')

  return (
    <>
      <h1 className="text-3xl font-bold">{t('home.title')}</h1>
      {/* Prova temporanea del manettino: da togliere prima del commit */}
      <Manettino
        label="Famiglia"
        value={family}
        onValueChange={setFamily}
        options={[
          { value: 'tutte', label: 'Tutte' },
          { value: 'stradali', label: 'Stradali' },
          { value: 'hypercar', label: 'Hypercar' },
          { value: 'corsa', label: 'Corsa' },
          { value: 'f1', label: 'F1' },
        ]}
      />
    </>
  )
}

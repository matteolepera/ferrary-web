import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArchiveSelect } from '@/components/archive/ArchiveSelect'
import { CatalogIndex } from '@/components/catalog/CatalogIndex'
import { useDrivers } from '@/hooks/useDrivers'
import { countryName } from '@/lib/format'

/** L'iniziale di un cognome, senza accenti: "Ébrard" va sotto la E */
const initialOf = (lastName: string) =>
  lastName
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .charAt(0)
    .toUpperCase()

export function DriversPage() {
  const { t, i18n } = useTranslation()
  const { data, isPending, isError, refetch } = useDrivers()
  const [country, setCountry] = useState('')

  // Per cognome, e a parità di cognome per nome: come negli annuari
  const sorted = [...(data ?? [])].sort(
    (a, b) =>
      a.last_name.localeCompare(b.last_name, i18n.language) ||
      a.first_name.localeCompare(b.first_name, i18n.language),
  )

  // I Paesi presenti nel catalogo, una volta sola, in ordine alfabetico nella lingua del sito
  const countries = [
    ...new Set(
      sorted
        .map((driver) => driver.nationality)
        .filter((code): code is string => Boolean(code)),
    ),
  ]
    .map((code) => ({ code, name: countryName(code, i18n.language) }))
    .sort((a, b) => a.name.localeCompare(b.name, i18n.language))

  const items = data
    ? sorted
        .filter((driver) => !country || driver.nationality === country)
        .map((driver) => ({
          id: driver.id,
          to: `/piloti/${driver.slug}`,
          name: `${driver.first_name} ${driver.last_name}`,
          meta: driver.nationality
            ? countryName(driver.nationality, i18n.language)
            : undefined,
          count: driver.versions_count,
          initial: initialOf(driver.last_name),
        }))
    : undefined

  return (
    <CatalogIndex
      title={t('catalogs.drivers.title')}
      text={t('catalogs.drivers.text')}
      items={items}
      isPending={isPending}
      isError={isError}
      onRetry={() => refetch()}
      countLabel={(count) => t('catalogs.drivers.count', { count })}
      alphabetical
      controls={
        <ArchiveSelect
          label={t('catalogs.drivers.country')}
          prefix={t('catalogs.drivers.country')}
          value={country}
          onChange={setCountry}
          className="min-w-0 flex-1 pr-7 md:pr-8 lg:w-72 lg:flex-none"
        >
          <option value="">{t('catalogs.drivers.allCountries')}</option>
          {countries.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </ArchiveSelect>
      }
    />
  )
}

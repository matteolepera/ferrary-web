import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { Version } from '@/types/catalog'

type VersionPeopleProps = {
  version: Version | undefined
}

const groupTitleClass =
  'font-display text-xl font-extrabold tracking-[-0.02em] md:text-2xl'
const rowClass = [
  'group flex items-baseline justify-between gap-6 border-b border-linea py-4 transition-colors hover:bg-ombra md:px-2',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosso-acceso',
].join(' ')

/**
 * Chi ha disegnato, carrozzato e guidato la versione: ogni nome porta alla sua pagina.
 */
export function VersionPeople({ version }: VersionPeopleProps) {
  const { t } = useTranslation()
  const designers = version?.designers ?? []
  const drivers = version?.drivers ?? []

  if (designers.length === 0 && drivers.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="persone-titolo" className="border-linea border-t">
      <div className="mx-auto max-w-[1360px] px-5 py-18 md:px-10 md:py-24">
        <h2
          id="persone-titolo"
          className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs"
        >
          {t('model.people.title')}
        </h2>

        <div className="mt-8 grid gap-12 md:grid-cols-2">
          {designers.length > 0 && (
            <div>
              <h3 className={groupTitleClass}>{t('model.people.designers')}</h3>
              <ul className="border-linea mt-4 border-t">
                {designers.map((designer) => (
                  <li key={designer.id}>
                    <Link
                      to={`/designer/${designer.slug}`}
                      className={rowClass}
                    >
                      <span className="font-medium text-neutral-100 group-hover:text-white">
                        {designer.name}
                      </span>
                      {designer.role && (
                        <span className="text-sm text-neutral-400">
                          {t(`model.people.roles.${designer.role}`)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drivers.length > 0 && (
            <div>
              <h3 className={groupTitleClass}>{t('model.people.drivers')}</h3>
              <ul className="border-linea mt-4 border-t">
                {drivers.map((driver) => (
                  <li key={driver.id}>
                    <Link to={`/piloti/${driver.slug}`} className={rowClass}>
                      <span className="font-medium text-neutral-100 group-hover:text-white">
                        {driver.first_name} {driver.last_name}
                      </span>
                      {driver.nationality && (
                        <span className="text-sm text-neutral-400">
                          {driver.nationality}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

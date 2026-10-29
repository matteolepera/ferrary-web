import { useTranslation } from 'react-i18next'
import type { RacingRecord, Version } from '@/types/catalog'

type RacingResultsProps = {
  version: Version | undefined
}

/** Somma di un dato su tutti i campionati; null se il dato manca ovunque */
function total(
  records: RacingRecord[],
  pick: (record: RacingRecord) => number | null,
) {
  const values = records
    .map(pick)
    .filter((value): value is number => value !== null)

  return values.length > 0
    ? values.reduce((sum, value) => sum + value, 0)
    : null
}

const headerClass =
  'px-4 py-3 text-left text-[0.625rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase'
const cellClass = 'px-4 py-4 text-right text-sm tabular-nums'

/**
 * I risultati sportivi della versione: i totali in grande e una tabella per campionato.
 */
export function RacingResults({ version }: RacingResultsProps) {
  const { t } = useTranslation()
  const records = version?.racing ?? []

  if (records.length === 0) {
    return null
  }

  const titles = total(records, (record) =>
    record.drivers_titles === null && record.constructors_titles === null
      ? null
      : (record.drivers_titles ?? 0) + (record.constructors_titles ?? 0),
  )

  const summary = [
    {
      key: 'wins',
      label: t('model.racing.totalWins'),
      value: total(records, (record) => record.wins),
    },
    {
      key: 'podiums',
      label: t('model.racing.totalPodiums'),
      value: total(records, (record) => record.podiums),
    },
    { key: 'titles', label: t('model.racing.totalTitles'), value: titles },
  ].filter((item) => item.value !== null)

  const season = (record: RacingRecord) =>
    record.season_end !== null && record.season_end !== record.season_start
      ? `${record.season_start}–${record.season_end}`
      : String(record.season_start)

  // Un dato mancante in tabella: un trattino, per non lasciare celle vuote
  const cell = (value: number | null) => (value === null ? '–' : value)

  return (
    <section
      aria-labelledby="risultati-titolo"
      className="border-linea border-t"
    >
      <div className="mx-auto max-w-[1360px] px-5 py-18 md:px-10 md:py-24">
        <h2
          id="risultati-titolo"
          className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs"
        >
          {t('model.racing.title')}
        </h2>

        {summary.length > 0 && (
          <dl className="mt-8 grid grid-cols-3 gap-4 md:max-w-2xl">
            {summary.map((item) => (
              <div key={item.key}>
                <dt className="text-[0.625rem] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
                  {item.label}
                </dt>
                <dd className="font-display mt-2 text-4xl leading-none font-extrabold tracking-[-0.035em] md:text-6xl">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* Su mobile la tabella scorre dentro il suo riquadro, senza allargare la pagina */}
        <div className="border-linea mt-10 overflow-x-auto border-y">
          <table className="w-full min-w-[56rem] border-collapse">
            <caption className="sr-only">{t('model.racing.caption')}</caption>
            <thead>
              <tr className="border-linea border-b">
                {/* La prima colonna resta ferma mentre si scorre */}
                <th
                  scope="col"
                  className={`${headerClass} bg-notte sticky left-0`}
                >
                  {t('model.racing.championship')}
                </th>
                <th scope="col" className={headerClass}>
                  {t('model.racing.season')}
                </th>
                {(
                  [
                    'races',
                    'wins',
                    'poles',
                    'podiums',
                    'fastestLaps',
                    'driversTitles',
                    'constructorsTitles',
                  ] as const
                ).map((key) => (
                  <th
                    key={key}
                    scope="col"
                    className={`${headerClass} text-right`}
                  >
                    {t(`model.racing.${key}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={`${record.championship}-${record.season_start}`}
                  className="border-linea border-b last:border-0"
                >
                  <th
                    scope="row"
                    className="bg-notte sticky left-0 px-4 py-4 text-left align-top"
                  >
                    <span className="block font-medium text-neutral-100">
                      {record.championship}
                    </span>
                    {record.notes && (
                      <span className="mt-1 block text-xs font-normal text-neutral-400">
                        {record.notes}
                      </span>
                    )}
                  </th>
                  <td className="px-4 py-4 text-left text-sm tabular-nums">
                    {season(record)}
                  </td>
                  <td className={cellClass}>{cell(record.races)}</td>
                  <td className={cellClass}>{cell(record.wins)}</td>
                  <td className={cellClass}>{cell(record.poles)}</td>
                  <td className={cellClass}>{cell(record.podiums)}</td>
                  <td className={cellClass}>{cell(record.fastest_laps)}</td>
                  <td className={cellClass}>{cell(record.drivers_titles)}</td>
                  <td className={cellClass}>
                    {cell(record.constructors_titles)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  groupOf,
  type CategoryGroupKey,
} from '@/components/archive/categoryGroups'
import { decadeLabel } from '@/components/archive/decades'
import { ErrorState } from '@/components/ui/ErrorState'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { useModelTimeline } from '@/hooks/useModelTimeline'
import type { TimelineModel } from '@/types/catalog'

type Year = { year: number; models: TimelineModel[] }
type Decade = { decade: number; models: TimelineModel[]; years: Year[] }

/** Il colore del segno davanti al nome: la famiglia a colpo d'occhio */
const MARK: Record<CategoryGroupKey, string> = {
  road: 'bg-rosso-acceso',
  racing: 'bg-neutral-100',
  concept: 'bg-neutral-500',
  other: 'bg-neutral-700',
}

const groupOfModel = (model: TimelineModel): CategoryGroupKey =>
  model.category ? groupOf(model.category.slug) : 'other'

/**
 * Le Ferrari divise per decennio, e dentro ogni decennio anno per anno:
 * dal primo all'ultimo anno con una Ferrari, compresi gli anni vuoti in mezzo.
 */
function byDecade(models: TimelineModel[]): Decade[] {
  const decades = new Map<number, TimelineModel[]>()

  for (const model of models) {
    if (model.first_year === null) continue
    const decade = Math.floor(model.first_year / 10) * 10
    decades.set(decade, [...(decades.get(decade) ?? []), model])
  }

  return [...decades].map(([decade, members]) => {
    const first = Math.min(
      ...members.map((model) => model.first_year ?? decade),
    )
    const last = Math.max(...members.map((model) => model.first_year ?? decade))
    const years = Array.from(
      { length: last - first + 1 },
      (_, index) => first + index,
    ).map((year) => ({
      year,
      models: members.filter((model) => model.first_year === year),
    }))

    return { decade, models: members, years }
  })
}

/** Una Ferrari nella riga del suo anno: una targhetta con l'angolo della Y */
function Chip({ model }: { model: TimelineModel }) {
  return (
    <li>
      <Link
        to={`/modelli/${model.slug}`}
        className={[
          'font-display inline-flex h-9 items-center gap-2.5 rounded-[2px] rounded-tl-[11px] bg-neutral-950 pr-4 pl-3 text-sm font-bold tracking-[-0.01em] text-neutral-100',
          '[clip-path:polygon(0_0,100%_0,100%_calc(100%-9px),calc(100%-9px)_100%,0_100%)]',
          'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] transition duration-300',
          'hover:bg-[radial-gradient(ellipse_70%_90%_at_50%_0%,rgba(255,255,255,0.08),transparent_80%)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]',
          'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:-outline-offset-2',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className={`h-[3px] w-2.5 shrink-0 -skew-x-[28deg] ${MARK[groupOfModel(model)]}`}
        />
        {model.name}
      </Link>
    </li>
  )
}

export function HistoryPage() {
  const { t } = useTranslation()
  const { data, isPending, isError, refetch } = useModelTimeline()

  const decades = byDecade(data ?? [])
  const undated = (data ?? []).filter((model) => model.first_year === null)

  // I numeri di un decennio: le Ferrari, e quante per gruppo, solo i gruppi presenti
  const statsOf = (models: TimelineModel[]) =>
    [
      {
        key: 'all',
        value: models.length,
        label: t('catalogs.ferrari', { count: models.length }),
      },
      ...(['road', 'racing', 'concept'] as const).map((group) => ({
        key: group,
        value: models.filter((model) => groupOfModel(model) === group).length,
        label: t(`archive.groups.${group}`),
      })),
    ].filter((stat) => stat.value > 0)

  return (
    <div className="mx-auto max-w-[1360px] px-5 pt-10 pb-18 md:px-10 md:pt-14 md:pb-24 lg:pt-40">
      <title>{`${t('history.eyebrow')} – Ferrary`}</title>

      <Eyebrow>{t('history.eyebrow')}</Eyebrow>
      <h1 className="font-display mt-3 max-w-[18ch] text-[2.625rem] leading-none font-extrabold tracking-[-0.035em] md:text-6xl lg:text-[clamp(3.5rem,6vw,5.5rem)]">
        {t('history.title')}
      </h1>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-300 md:max-w-[56ch] md:text-[1.0625rem]">
        {t('history.text')}
      </p>

      {/* La legenda dei segni: la famiglia di ogni Ferrari a colpo d'occhio */}
      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-400">
        {(['road', 'racing', 'concept'] as const).map((group) => (
          <li key={group} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`h-[3px] w-3 -skew-x-[28deg] ${MARK[group]}`}
            />
            {t(`archive.groups.${group}`)}
          </li>
        ))}
      </ul>

      {isError && (
        <ErrorState message={t('history.error')} onRetry={() => refetch()} />
      )}

      {isPending && (
        <div
          aria-busy="true"
          className="bg-ombra/60 mt-14 h-96 animate-pulse rounded-[3px] rounded-tl-[20px]"
        />
      )}

      {decades.map(({ decade, models, years }) => (
        <section
          key={decade}
          id={`decennio-${decade}`}
          aria-labelledby={`decennio-${decade}-titolo`}
          className="border-linea mt-14 grid scroll-mt-8 gap-8 border-t pt-10 md:mt-18 lg:scroll-mt-48 lg:grid-cols-[18rem_1fr] lg:gap-12"
        >
          {/* La sala: il decennio, il suo racconto e i suoi numeri */}
          <div>
            <h2
              id={`decennio-${decade}-titolo`}
              className="font-display text-5xl leading-[0.9] font-extrabold tracking-[-0.04em] md:text-6xl"
            >
              {decadeLabel(t, decade)}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400 md:text-[0.9375rem]">
              {t(`history.decades.${decade}`, { defaultValue: '' })}
            </p>
            <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {statsOf(models).map((stat) => (
                <div key={stat.key} className="flex flex-col-reverse">
                  <dt className="text-[0.625rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-2xl font-extrabold tracking-[-0.02em]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Anno per anno: anche gli anni vuoti, perché anche i vuoti raccontano qualcosa */}
          <ol>
            {years.map(({ year, models: ofYear }) => (
              <li
                key={year}
                className="grid grid-cols-[3.5rem_1fr] items-start gap-4 border-b border-white/[0.05] py-3 first:pt-0 md:grid-cols-[4.5rem_1fr]"
              >
                <span
                  className={`font-display pt-1.5 text-base font-extrabold tabular-nums md:text-lg ${ofYear.length > 0 ? 'text-neutral-500' : 'text-neutral-800'}`}
                >
                  {year}
                </span>
                {ofYear.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {ofYear.map((model) => (
                      <Chip key={model.id} model={model} />
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>
      ))}

      {/* Le Ferrari senza anno, se ce ne sono: in fondo, in una sala a parte */}
      {undated.length > 0 && (
        <section
          aria-labelledby="decennio-senza-data"
          className="border-linea mt-14 border-t pt-10"
        >
          <h2
            id="decennio-senza-data"
            className="font-display text-4xl font-extrabold tracking-[-0.035em]"
          >
            {t('history.undated')}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {undated.map((model) => (
              <Chip key={model.id} model={model} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

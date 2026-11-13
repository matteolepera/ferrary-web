import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  groupOf,
  type CategoryGroupKey,
} from '@/components/archive/categoryGroups'
import { decadeLabel, shortDecade } from '@/components/archive/decades'
import { ErrorState } from '@/components/ui/ErrorState'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { YPanel, YSeparator } from '@/components/ui/YPanel'
import { YSegments } from '@/components/ui/YSegments'
import { useModelTimeline } from '@/hooks/useModelTimeline'
import type { TimelineModel } from '@/types/catalog'

type Year = { year: number; models: TimelineModel[] }
type Decade = { decade: number; models: TimelineModel[]; years: Year[] }
type Filter = '' | Exclude<CategoryGroupKey, 'other'>

/** Il colore del segno davanti al nome: la famiglia a colpo d'occhio */
const MARK: Record<CategoryGroupKey, string> = {
  road: 'bg-rosso-acceso',
  racing: 'bg-neutral-100',
  concept: 'bg-neutral-500',
  other: 'bg-neutral-700',
}

const GROUPS = ['road', 'racing', 'concept'] as const

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
  const [filter, setFilter] = useState<Filter>('')
  // Il decennio che si sta guardando, per accendere la sua voce nell'indice
  const [current, setCurrent] = useState<number | null>(null)

  // Il filtro viene prima di tutto: le sale, i loro numeri e l'indice contano solo le Ferrari scelte
  const shown = (data ?? []).filter(
    (model) => !filter || groupOfModel(model) === filter,
  )
  const decades = byDecade(shown)
  const undated = shown.filter((model) => model.first_year === null)
  const decadeKeys = decades.map(({ decade }) => decade).join(',')

  // Mentre si scorre, la sala che attraversa il centro dello schermo accende la sua voce nell'indice
  useEffect(() => {
    if (!('IntersectionObserver' in window) || !decadeKeys) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setCurrent(Number(entry.target.id.replace('decennio-', '')))
        }
      },
      // Una striscia sottile poco sopra il centro dello schermo
      { rootMargin: '-40% 0px -55% 0px' },
    )

    for (const decade of decadeKeys.split(',')) {
      const section = document.getElementById(`decennio-${decade}`)
      if (section) observer.observe(section)
    }

    return () => observer.disconnect()
  }, [decadeKeys])

  // I numeri di un decennio: le Ferrari, e quante per gruppo, solo i gruppi presenti
  const statsOf = (models: TimelineModel[]) =>
    [
      {
        key: 'all',
        value: models.length,
        label: t('catalogs.ferrari', { count: models.length }),
      },
      ...GROUPS.map((group) => ({
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

      {/*
        L'indice dei decenni e il filtro, in una barra della Y che resta ferma mentre si scorre:
        su telefono in cima allo schermo, dal desktop sotto la barra di navigazione
      */}
      <div className="sticky top-3 z-20 mt-8 md:mt-10 lg:top-28">
        <YPanel className="flex flex-wrap lg:h-[3.75rem] lg:flex-nowrap">
          <nav
            aria-label={t('history.decadesLabel')}
            className="basis-full lg:min-w-0 lg:flex-1 lg:basis-auto"
          >
            <ul className="senza-barra flex h-14 overflow-x-auto pl-2 lg:h-full">
              {decades.map(({ decade, models }) => {
                const active = decade === current

                return (
                  <li key={decade} className="flex min-w-14 flex-1">
                    <a
                      href={`#decennio-${decade}`}
                      aria-label={decadeLabel(t, decade)}
                      aria-current={active ? 'location' : undefined}
                      className={[
                        'font-display relative flex flex-1 flex-col items-center justify-center text-[0.8125rem] font-bold transition-colors',
                        'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:-outline-offset-8',
                        active
                          ? [
                              'bg-[radial-gradient(ellipse_70%_90%_at_50%_0%,rgba(255,255,255,0.16),transparent_80%)] text-white',
                              "after:absolute after:bottom-1.5 after:left-1/2 after:h-[3px] after:w-3.5 after:-translate-x-1/2 after:-skew-x-[28deg] after:content-['']",
                              'after:bg-rosso-acceso after:shadow-[0_0_8px_rgba(255,59,48,0.7)]',
                            ].join(' ')
                          : 'text-neutral-500 hover:text-white',
                      ].join(' ')}
                    >
                      {shortDecade(decade)}
                      <span
                        aria-hidden="true"
                        className="mt-0.5 font-sans text-[0.5625rem] font-semibold tracking-[0.14em] text-neutral-600"
                      >
                        {models.length}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <YSeparator className="hidden lg:block" />

          <div className="flex h-12 basis-full border-t border-white/10 lg:h-auto lg:basis-auto lg:border-t-0">
            <YSegments
              label={t('history.filterLabel')}
              value={filter}
              onChange={(value) => setFilter(value as Filter)}
              options={[
                { value: '', label: t('archive.filters.any') },
                ...GROUPS.map((group) => ({
                  value: group,
                  label: t(`archive.groups.${group}`),
                })),
              ]}
              className="pr-6 md:pr-7"
            />
          </div>
        </YPanel>
      </div>

      {/* La legenda dei segni: la famiglia di ogni Ferrari a colpo d'occhio */}
      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-400">
        {GROUPS.map((group) => (
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
          // Il margine per i salti dall'indice: la sala si ferma sotto la barra ferma, non dietro
          className="border-linea mt-14 grid scroll-mt-36 gap-8 border-t pt-10 md:mt-18 lg:scroll-mt-48 lg:grid-cols-[18rem_1fr] lg:gap-12"
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

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'
import { useModelTimeline } from '@/hooks/useModelTimeline'
import { useWhenVisible } from '@/hooks/useWhenVisible'
import type { CarModel } from '@/types/catalog'
import { ErrorState } from '@/components/ui/ErrorState'

type Decade = { key: string; label: string; models: CarModel[] }

export function HistoryPage() {
  const { t } = useTranslation()
  const {
    data,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useModelTimeline()

  // Stabile tra un disegno e l'altro, così l'osservatore non viene ricreato a ogni modello aggiunto
  const loadMore = useCallback(() => {
    if (!isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [fetchNextPage, isFetchingNextPage])

  const sentinel = useWhenVisible(loadMore, hasNextPage)

  // Tutte le pagine caricate finora, in un unico elenco
  const models = data?.pages.flatMap((page) => page.data) ?? []
  const total = data?.pages[0]?.meta.total

  const decadeLabel = (decade: number) =>
    t('archive.filters.decade', {
      short: decade < 2000 ? `'${String(decade).slice(2)}` : String(decade),
      full: String(decade),
    })

  // Raggruppa per decennio, mantenendo l'ordine cronologico dell'API
  const decades: Decade[] = []
  for (const model of models) {
    const decade =
      model.first_year != null ? Math.floor(model.first_year / 10) * 10 : null
    const key = decade === null ? 'undated' : String(decade)
    const last = decades.at(-1)

    if (last?.key === key) {
      last.models.push(model)
    } else {
      decades.push({
        key,
        label: decade === null ? t('history.undated') : decadeLabel(decade),
        models: [model],
      })
    }
  }

  return (
    <div className="mx-auto max-w-[1360px] px-5 pt-28 pb-18 md:px-10 md:pt-36 md:pb-24 lg:pt-40">
      <title>{`${t('history.eyebrow')} – Ferrary`}</title>

      <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
        {t('history.eyebrow')}
      </p>
      <h1 className="font-display mt-3 max-w-[18ch] text-[2.625rem] leading-none font-extrabold tracking-[-0.035em] md:text-6xl lg:text-[clamp(3.5rem,6vw,5.5rem)]">
        {t('history.title')}
      </h1>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-300 md:max-w-[52ch] md:text-[1.0625rem]">
        {t('history.text')}
      </p>
      <p className="mt-6 text-sm text-neutral-400">
        {total !== undefined ? t('history.count', { count: total }) : '\u00a0'}
      </p>

      {isError && (
        <ErrorState message={t('history.error')} onRetry={() => refetch()} />
      )}

      {isPending && (
        <div
          aria-busy="true"
          className="bg-ombra/60 mt-10 h-96 animate-pulse"
        />
      )}

      {decades.map((decade) => (
        <section
          key={decade.key}
          aria-labelledby={`decennio-${decade.key}`}
          className="mt-12 md:mt-16"
        >
          {/* Il decennio resta in vista mentre si scorrono le sue Ferrari */}
          <h2
            id={`decennio-${decade.key}`}
            className="bg-notte/90 font-display sticky top-0 z-10 -mx-5 px-5 py-3 text-[2rem] leading-none font-extrabold tracking-[-0.035em] backdrop-blur-md md:-mx-10 md:px-10 md:text-5xl"
          >
            {decade.label}
          </h2>

          {/* La linea del tempo: il bordo sinistro dell'elenco */}
          <ol className="border-linea mt-4 ml-1 border-l md:ml-2">
            {decade.models.map((model) => (
              <li key={model.id}>
                <Link
                  to={`/modelli/${model.slug}`}
                  className="group hover:bg-ombra focus-visible:outline-rosso-acceso relative flex items-center justify-between gap-5 py-4 pr-2 pl-7 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:pl-10"
                >
                  {/* Il punto sulla linea: si accende al passaggio */}
                  <span
                    aria-hidden="true"
                    className="ring-notte group-hover:bg-rosso absolute top-1/2 -left-[5px] size-2.5 -translate-y-1/2 rounded-full bg-neutral-600 ring-4 transition-colors"
                  />
                  <span className="min-w-0">
                    <span className="text-rosso-acceso block text-sm font-semibold tabular-nums">
                      {model.first_year}
                    </span>
                    <span className="font-display mt-0.5 block text-2xl leading-tight font-extrabold tracking-[-0.035em] md:text-3xl">
                      {model.name}
                    </span>
                    {model.category && (
                      <span className="mt-0.5 block text-sm text-neutral-400">
                        {model.category.name}
                      </span>
                    )}
                  </span>
                  {model.cover && (
                    <img
                      src={model.cover.url}
                      alt=""
                      loading="lazy"
                      className="hidden aspect-[16/10] w-40 shrink-0 object-cover md:block lg:w-48"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}

      {/* La sentinella: quando si avvicina allo schermo, arriva la pagina successiva */}
      <div ref={sentinel} aria-hidden="true" />

      {hasNextPage && (
        <div className="mt-12 text-center">
          <Button
            variant="secondary"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full md:w-auto"
          >
            {isFetchingNextPage
              ? t('history.loadingMore')
              : t('history.loadMore')}
          </Button>
        </div>
      )}
    </div>
  )
}

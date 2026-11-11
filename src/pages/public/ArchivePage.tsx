import { SlidersHorizontal } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { ActiveFilters } from '@/components/archive/ActiveFilters'
import { ArchiveSearch } from '@/components/archive/ArchiveSearch'
import { FamilySelect } from '@/components/archive/FamilySelect'
import { FilterControls } from '@/components/archive/FilterControls'
import { FiltersSheet } from '@/components/archive/FiltersSheet'
import { SortSelect } from '@/components/archive/SortSelect'
import { ModelCard } from '@/components/catalog/ModelCard'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { yFocusMark } from '@/components/ui/yFocus'
import { YPanel, YSeparator } from '@/components/ui/YPanel'
import { useArchiveFilters } from '@/hooks/useArchiveFilters'
import { useModels } from '@/hooks/useModels'
import { ArchivePager } from '@/components/archive/ArchivePager'
import { StatePanel } from '@/components/ui/StatePanel'

const gridClass = 'mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3'

export function ArchivePage() {
  const { t } = useTranslation()
  const { filters, setFilters, clearFilters } = useArchiveFilters()
  const { data, isPending, isError, isPlaceholderData, refetch } =
    useModels(filters)

  // Arrivando dal pulsante "Cerca", il campo di ricerca prende subito il cursore
  const location = useLocation()
  const focusSearch =
    (location.state as { focusSearch?: boolean } | null)?.focusSearch === true

  const meta = data?.meta
  // La pagina non conta come filtro: "azzera" serve solo se l'utente ha scelto qualcosa
  const hasFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'page' && value !== undefined,
  )

  const [sheetOpen, setSheetOpen] = useState(false)
  // Stabile tra un disegno e l'altro: il pannello non deve rifare il focus a ogni filtro scelto
  const closeSheet = useCallback(() => setSheetOpen(false), [])

  // Stabile anche lei: la ricerca la usa in un effetto
  const onSearch = useCallback(
    (search: string | undefined) => setFilters({ search }, { replace: true }),
    [setFilters],
  )

  // I filtri del pannello attivi, per il pallino sul pulsante "Filtri"
  const panelFilters = [filters.powertrain, filters.year_from, filters.year_to]
  const activeCount = panelFilters.filter((value) => value !== undefined).length

  const goToPage = (page: number) =>
    setFilters({ page }, { preventScrollReset: false })

  return (
    <div className="mx-auto max-w-[1360px] px-5 pt-28 pb-18 md:px-10 md:pt-36 md:pb-24 lg:pt-40">
      <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
        {t('archive.eyebrow')}
      </p>
      <h1 className="font-display mt-3 text-[2.625rem] leading-none font-extrabold tracking-[-0.035em] md:text-6xl lg:text-[clamp(3.5rem,6vw,5.5rem)]">
        {t('archive.title')}
      </h1>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-300 md:max-w-[52ch] md:text-[1.0625rem]">
        {t('archive.text')}
      </p>

      {/*
        La barra, con la forma della Y. Dal desktop una riga sola;
        su telefono e tablet la ricerca sopra, e sotto famiglia, filtri e ordinamento
      */}
      <YPanel className="mt-8 flex flex-wrap md:mt-10 lg:h-[3.75rem] lg:flex-nowrap">
        <ArchiveSearch
          value={filters.search ?? ''}
          // Mentre si digita, l'indirizzo viene sostituito: Indietro non cancella una lettera alla volta
          onChange={onSearch}
          autoFocus={focusSearch}
          className="basis-full lg:flex-1 lg:basis-auto"
        />

        <YSeparator className="hidden lg:block" />

        <div className="flex h-12 basis-full border-t border-white/10 lg:h-auto lg:basis-auto lg:border-t-0">
          <FamilySelect
            value={filters.category}
            onChange={(category) => setFilters({ category })}
            className="min-w-0 flex-1 lg:w-64 lg:flex-none"
          />

          <YSeparator />

          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            onClick={() => setSheetOpen(true)}
            className={`${yFocusMark} flex shrink-0 items-center gap-2.5 px-4 text-sm text-neutral-100 transition-colors hover:text-white focus-visible:outline-none md:px-5 md:text-[0.9375rem]`}
          >
            <SlidersHorizontal
              aria-hidden="true"
              className="size-4 text-neutral-500"
            />
            {t('archive.filters.open')}
            {activeCount > 0 && (
              <>
                {/* Il numero si vede nel pallino, e si sente come "1 attivo" */}
                <span
                  aria-hidden="true"
                  className="bg-rosso flex size-5 items-center justify-center rounded-full text-[0.6875rem] font-semibold"
                >
                  {activeCount}
                </span>
                <span className="sr-only">
                  , {t('archive.filters.active', { count: activeCount })}
                </span>
              </>
            )}
          </button>

          <YSeparator />

          {/* L'ultimo controllo lascia spazio al taglio in basso a destra */}
          <SortSelect
            value={filters.sort}
            onChange={(sort) => setFilters({ sort })}
            className="shrink-0 pr-7 after:-ml-1.5 md:shrink md:pr-8 lg:w-72"
          />
        </div>
      </YPanel>

      {sheetOpen && (
        <FiltersSheet
          count={meta?.total}
          onClose={closeSheet}
          onReset={
            activeCount > 0
              ? () =>
                  setFilters({
                    powertrain: undefined,
                    year_from: undefined,
                    year_to: undefined,
                  })
              : undefined
          }
        >
          <FilterControls filters={filters} onChange={setFilters} />
        </FiltersSheet>
      )}

      <div className="border-linea mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-b pb-4 md:mt-10">
        {/* Il conteggio viene annunciato ai lettori di schermo quando cambia */}
        <p aria-live="polite" className="text-sm text-neutral-400">
          {meta ? (
            <>
              <span className="font-display text-lg font-extrabold tracking-[-0.02em] text-white">
                {meta.total}
              </span>{' '}
              {t('archive.countLabel', { count: meta.total })}
            </>
          ) : (
            '\u00a0'
          )}
        </p>

        <ActiveFilters filters={filters} onChange={setFilters} />

        {/* Senza risultati, "Azzera i filtri" resta solo nel messaggio al centro della pagina */}
        {hasFilters && data && data.data.length > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto text-[0.6875rem] font-semibold tracking-[0.16em] text-neutral-300 uppercase hover:text-white"
          >
            {t('archive.clear')}
          </button>
        )}
      </div>

      {isError && (
        <ErrorState message={t('archive.error')} onRetry={() => refetch()} />
      )}

      {isPending && (
        <ul aria-busy="true" className={gridClass}>
          <li className="sr-only">{t('archive.loading')}</li>
          {[1, 2, 3, 4, 5, 6].map((placeholder) => (
            <li
              key={placeholder}
              aria-hidden="true"
              className="bg-ombra min-h-[22rem] animate-pulse md:min-h-[24rem]"
            />
          ))}
        </ul>
      )}

      {data && data.data.length === 0 && (
        <StatePanel
          tone="neutral"
          role="status"
          eyebrow={t('archive.emptyEyebrow')}
          title={t('archive.empty')}
          text={t('archive.emptyHint')}
          action={
            hasFilters ? (
              <Button variant="ctaGhost" onClick={clearFilters}>
                {t('archive.clear')}
              </Button>
            ) : undefined
          }
        />
      )}

      {data && data.data.length > 0 && (
        <ul
          className={`${gridClass} transition-opacity ${isPlaceholderData ? 'opacity-50' : ''}`}
        >
          {data.data.map((model) => (
            <li key={model.id}>
              <ModelCard model={model} />
            </li>
          ))}
        </ul>
      )}

      {meta && (
        <ArchivePager
          page={meta.current_page}
          lastPage={meta.last_page}
          onChange={goToPage}
        />
      )}
    </div>
  )
}

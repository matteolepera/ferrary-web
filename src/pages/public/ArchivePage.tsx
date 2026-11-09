import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { ArchiveSearch } from '@/components/archive/ArchiveSearch'
import { FamilySelect } from '@/components/archive/FamilySelect'
import { FilterControls } from '@/components/archive/FilterControls'
import { FiltersSheet } from '@/components/archive/FiltersSheet'
import { ModelCard } from '@/components/catalog/ModelCard'
import { Button } from '@/components/ui/Button'
import { useArchiveFilters } from '@/hooks/useArchiveFilters'
import { useModels } from '@/hooks/useModels'
import { ErrorState } from '@/components/ui/ErrorState'
import { SlidersHorizontal } from 'lucide-react'
import { SortSelect } from '@/components/archive/SortSelect'
import { ActiveFilters } from '@/components/archive/ActiveFilters'

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

      {/* La barra: ricerca, famiglia, filtri e ordinamento */}
      <div className="mt-8 flex flex-col gap-3 md:mt-10 lg:flex-row">
        <ArchiveSearch
          value={filters.search ?? ''}
          // Mentre si digita, l'indirizzo viene sostituito: Indietro non cancella una lettera alla volta
          onChange={(search) => setFilters({ search }, { replace: true })}
          autoFocus={focusSearch}
        />

        {/* Telefono: famiglia su una riga, filtri e ordinamento sotto; tablet: tutti e tre in fila */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_auto_1fr] lg:flex lg:shrink-0">
          <FamilySelect
            value={filters.category}
            onChange={(category) => setFilters({ category })}
            className="col-span-2 md:col-span-1 lg:w-60"
          />

          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            onClick={() => setSheetOpen(true)}
            className={[
              'border-linea bg-ombra flex items-center justify-center gap-2.5 border px-5 py-3.5 text-[0.9375rem] text-neutral-100',
              'transition-colors hover:border-neutral-500',
              'focus-visible:outline-rosso-acceso focus-visible:outline-2 focus-visible:outline-offset-2',
            ].join(' ')}
          >
            <SlidersHorizontal
              aria-hidden="true"
              className="size-4 text-neutral-400"
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

          <SortSelect
            value={filters.sort}
            onChange={(sort) => setFilters({ sort })}
            className="lg:w-56"
          />
        </div>
      </div>

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
          {meta ? t('archive.count', { count: meta.total }) : '\u00a0'}
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
        <div className="py-16 text-center">
          <p className="text-neutral-300">{t('archive.empty')}</p>
          {hasFilters && (
            <Button variant="secondary" onClick={clearFilters} className="mt-6">
              {t('archive.clear')}
            </Button>
          )}
        </div>
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

      {meta && meta.last_page > 1 && (
        <nav
          aria-label={t('archive.pagination')}
          className="mt-10 flex items-center justify-between gap-4"
        >
          <Button
            variant="secondary"
            disabled={meta.current_page <= 1}
            onClick={() => goToPage(meta.current_page - 1)}
          >
            {t('archive.previous')}
          </Button>
          <p className="text-sm text-neutral-400">
            {t('archive.page', {
              current: meta.current_page,
              last: meta.last_page,
            })}
          </p>
          <Button
            variant="secondary"
            disabled={meta.current_page >= meta.last_page}
            onClick={() => goToPage(meta.current_page + 1)}
          >
            {t('archive.next')}
          </Button>
        </nav>
      )}
    </div>
  )
}

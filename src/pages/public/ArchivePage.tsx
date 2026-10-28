import { useTranslation } from 'react-i18next'
import { ModelCard } from '@/components/catalog/ModelCard'
import { Button } from '@/components/ui/Button'
import { useArchiveFilters } from '@/hooks/useArchiveFilters'
import { useModels } from '@/hooks/useModels'

const gridClass = 'mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3'

export function ArchivePage() {
  const { t } = useTranslation()
  const { filters, setFilters, clearFilters } = useArchiveFilters()
  const { data, isPending, isError, isPlaceholderData, refetch } =
    useModels(filters)

  const meta = data?.meta
  // La pagina non conta come filtro: "azzera" serve solo se l'utente ha scelto qualcosa
  const hasFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'page' && value !== undefined,
  )

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

      {/* Il conteggio viene annunciato ai lettori di schermo quando cambia */}
      <p
        aria-live="polite"
        className="border-linea mt-10 border-b pb-4 text-sm text-neutral-400"
      >
        {meta ? t('archive.count', { count: meta.total }) : '\u00a0'}
      </p>

      {isError && (
        <div role="alert" className="py-16 text-center">
          <p className="text-errore">{t('archive.error')}</p>
          <Button
            variant="secondary"
            onClick={() => refetch()}
            className="mt-6"
          >
            {t('archive.retry')}
          </Button>
        </div>
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

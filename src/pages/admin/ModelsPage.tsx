import { Link } from 'react-router'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { Icon } from '@/components/admin/ui/Icon'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { useAdminModelFilters } from '@/hooks/useAdminModelFilters'
import { useAdminModels } from '@/hooks/useAdminModels'
import { formatNumber } from '@/lib/format'
import { timeAgo } from '@/lib/timeAgo'
import { AdminPagination } from '@/components/admin/ui/AdminPagination'
import { AdminSearch } from '@/components/admin/ui/AdminSearch'
import { useAdminCategories } from '@/hooks/useAdminModels'
import type { PublicationStatus } from '@/types/admin'

/** Le colonne, nell'ordine della tabella */
const columns = ['Modello', 'Famiglia', 'Versioni', 'Stato', 'Ultima modifica']

/** Le pillole degli stati: undefined vuol dire "tutti" */
const statusFilters: { value: PublicationStatus | undefined; label: string }[] =
  [
    { value: undefined, label: 'Tutti' },
    { value: 'published', label: 'Pubblicati' },
    { value: 'scheduled', label: 'Programmati' },
    { value: 'draft', label: 'Bozze' },
  ]

/**
 * L'elenco dei modelli dell'admin: tutti, bozze e programmati compresi.
 */
export function ModelsPage() {
  const { filters, setFilters } = useAdminModelFilters()
  const { data: categories } = useAdminCategories()
  const { data, isPending, isError, isPlaceholderData, refetch } =
    useAdminModels(filters)

  const hasFilters = Boolean(
    filters.search || filters.status || filters.category_id,
  )
  const total = data?.meta.total ?? 0

  return (
    <>
      <title>Modelli – Ferrary</title>

      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
            Catalogo
          </p>
          <h1 className="font-display mt-2.5 text-[2.75rem] leading-none font-extrabold tracking-[-0.035em]">
            Modelli
          </h1>
          {data && (
            <p className="mt-3 text-sm text-neutral-400">
              {total === 1
                ? '1 modello'
                : `${formatNumber(total, 'it', 0)} modelli`}
              {hasFilters && ' con questi filtri'}
            </p>
          )}
        </div>
        <Link to="/admin/modelli/nuovo" className={adminButtonClass('primary')}>
          <Icon path="M12 5v14M5 12h14" size={16} />
          Nuovo modello
        </Link>
      </header>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <AdminSearch
          label="Cerca un modello"
          placeholder="Cerca un modello"
          value={filters.search ?? ''}
          // replace: ogni lettera non deve diventare un passo della cronologia
          onSearch={(search) => setFilters({ search }, { replace: true })}
        />

        <div
          role="group"
          aria-label="Filtra per stato"
          className="flex flex-wrap gap-1.5"
        >
          {statusFilters.map(({ value, label }) => {
            const active = filters.status === value

            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => setFilters({ status: value })}
                className={[
                  'rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors',
                  active
                    ? 'text-notte border-white bg-white'
                    : 'border-linea text-neutral-300 hover:border-neutral-600 hover:text-white',
                ].join(' ')}
              >
                {label}
              </button>
            )
          })}
        </div>

        <label className="sr-only" htmlFor="filtro-famiglia">
          Famiglia
        </label>
        <select
          id="filtro-famiglia"
          value={filters.category_id ?? ''}
          onChange={(event) =>
            setFilters({
              category_id: event.target.value
                ? Number(event.target.value)
                : undefined,
            })
          }
          className="bg-ombra h-11 rounded-full border border-white/10 px-4 text-sm text-neutral-100 transition-colors focus:border-neutral-300"
        >
          <option value="">Tutte le famiglie</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name.it}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={() =>
              setFilters({
                search: undefined,
                status: undefined,
                category_id: undefined,
              })
            }
            className="text-xs font-semibold text-neutral-400 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Azzera filtri
          </button>
        )}
      </div>

      <AdminCard className="mt-7 overflow-hidden">
        {isError ? (
          <div role="alert" className="flex flex-col items-start gap-4 p-6">
            <p className="text-[0.9375rem] text-neutral-300">
              Impossibile caricare i modelli: il server non risponde.
            </p>
            <AdminButton variant="outline" onClick={() => refetch()}>
              Riprova
            </AdminButton>
          </div>
        ) : (
          // La tabella scorre in orizzontale dentro la card, sul tablet
          <div className="overflow-x-auto">
            <table
              aria-busy={isPending || isPlaceholderData}
              className={[
                'w-full min-w-[46rem] text-left text-sm transition-opacity',
                isPlaceholderData ? 'opacity-50' : '',
              ].join(' ')}
            >
              <caption className="sr-only">Modelli del catalogo</caption>
              <thead>
                <tr className="border-linea border-b">
                  {columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="px-5 py-4 text-[0.6875rem] font-semibold tracking-[0.18em] whitespace-nowrap text-neutral-400 uppercase first:pl-6"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isPending &&
                  // Cinque righe sagoma, mentre arriva la prima risposta
                  Array.from({ length: 5 }, (_, index) => (
                    <tr
                      key={index}
                      className="border-linea border-b last:border-b-0"
                    >
                      <td colSpan={columns.length} className="px-6 py-4">
                        <span className="block h-9 animate-pulse rounded-xl bg-white/5" />
                      </td>
                    </tr>
                  ))}

                {data?.data.map((model) => (
                  <tr
                    key={model.id}
                    className="border-linea border-b transition-colors last:border-b-0 hover:bg-white/[0.02]"
                  >
                    <td className="py-4 pr-5 pl-6">
                      <Link
                        to={`/admin/modelli/${model.id}`}
                        className="font-display hover:text-rosso-acceso text-[0.9375rem] font-bold tracking-[-0.01em]"
                      >
                        {model.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {model.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-neutral-300">
                      {model.category?.name.it ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-neutral-300 tabular-nums">
                      {model.versions_count ?? 0}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={model.status}
                        publishedAt={model.published_at}
                      />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-neutral-400">
                      <time dateTime={model.updated_at}>
                        {timeAgo(model.updated_at)}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data && data.data.length === 0 && (
              <p className="px-6 py-12 text-center text-sm text-neutral-400">
                {hasFilters
                  ? 'Nessun modello con questi filtri.'
                  : 'Nessun modello nel catalogo: crea il primo.'}
              </p>
            )}
          </div>
        )}

        {data && (
          <AdminPagination
            page={data.meta.current_page}
            lastPage={data.meta.last_page}
            onChange={(page) => setFilters({ page })}
          />
        )}
      </AdminCard>
    </>
  )
}

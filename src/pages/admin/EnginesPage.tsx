import { Link } from 'react-router'
import { NewEngineButton } from '@/components/admin/engines/NewEngineButton'
import {
  architectures,
  aspirations,
  displacement,
  engineSummary,
} from '@/components/admin/engines/options'
import { AdminSearch } from '@/components/admin/ui/AdminSearch'
import {
  FilterPills,
  type FilterOption,
} from '@/components/admin/ui/FilterPills'
import { FilterSelect } from '@/components/admin/ui/FilterSelect'
import { ListHeader } from '@/components/admin/ui/ListHeader'
import { ListTable, listRowClass } from '@/components/admin/ui/ListTable'
import { labelOf } from '@/components/admin/versions/options'
import { useAdminEngines } from '@/hooks/useAdminEngines'
import { useListParams } from '@/hooks/useListParams'
import { paginate } from '@/lib/paginate'
import type { EngineArchitecture } from '@/types/admin'

const columns = [
  'Motore',
  'Configurazione',
  'Cilindrata',
  'Aspirazione',
  'Versioni',
]

/** Le pillole delle architetture: undefined vuol dire "tutte" */
const architectureFilters: FilterOption<EngineArchitecture>[] = [
  { value: undefined, label: 'Tutte' },
  ...architectures,
]

/**
 * I motori del catalogo: sono qualche decina, quindi arrivano tutti
 * e ricerca, filtri e pagine lavorano nel browser.
 */
export function EnginesPage() {
  const { data: engines, isPending, isError } = useAdminEngines()
  const list = useListParams(['architecture', 'aspiration'] as const)

  // Solo i valori previsti: "?architecture=pippo" viene ignorato
  const architecture = architectures.find(
    (option) => option.value === list.filters.architecture,
  )?.value
  const aspiration = aspirations.find(
    (option) => option.value === list.filters.aspiration,
  )?.value

  const query = list.search.trim().toLowerCase()
  const visible = (engines ?? [])
    .filter(
      (engine) =>
        (!query ||
          engine.code.toLowerCase().includes(query) ||
          engine.name?.toLowerCase().includes(query)) &&
        (!architecture || engine.architecture === architecture) &&
        (!aspiration || engine.aspiration === aspiration),
    )
    .sort((a, b) => a.code.localeCompare(b.code, 'it'))
  const page = paginate(visible, list.page)

  const count = engines
    ? `${visible.length === 1 ? '1 motore' : `${visible.length} motori`}${list.hasFilters ? ' con questi filtri' : ''}`
    : undefined

  return (
    <>
      <title>Motori – Ferrary</title>

      <ListHeader
        eyebrow="Catalogo"
        title="Motori"
        count={count}
        action={<NewEngineButton />}
      />

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <AdminSearch
          label="Cerca un motore"
          placeholder="Codice o nome"
          value={list.search}
          // replace: ogni lettera non deve diventare un passo della cronologia
          onSearch={(search) => list.set({ search }, { replace: true })}
        />
        <FilterPills
          label="Filtra per architettura"
          options={architectureFilters}
          value={architecture}
          onChange={(value) => list.set({ architecture: value })}
        />
        <FilterSelect
          label="Aspirazione"
          value={aspiration ?? ''}
          onChange={(event) =>
            list.set({ aspiration: event.target.value || undefined })
          }
        >
          <option value="">Tutte le aspirazioni</option>
          {aspirations.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FilterSelect>

        {list.hasFilters && (
          <button
            type="button"
            onClick={list.clear}
            className="text-xs font-semibold text-neutral-400 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Azzera filtri
          </button>
        )}
      </div>

      <ListTable
        caption="Motori del catalogo"
        columns={columns}
        isPending={isPending}
        error={isError ? 'Impossibile caricare i motori.' : null}
        empty={
          visible.length === 0
            ? list.hasFilters
              ? 'Nessun motore con questi filtri.'
              : 'Nessun motore nel catalogo: crea il primo.'
            : null
        }
        page={page.page}
        lastPage={page.lastPage}
        onPageChange={(value) => list.set({ page: value })}
      >
        {page.items.map((engine) => (
          <tr key={engine.id} className={listRowClass}>
            <td className="py-4 pr-5 pl-6">
              <Link
                to={`/admin/motori/${engine.id}`}
                className="font-display hover:text-rosso-acceso text-[0.9375rem] font-bold tracking-[-0.01em]"
              >
                {engine.code}
              </Link>
              {engine.name && (
                <p className="mt-0.5 text-xs text-neutral-500">{engine.name}</p>
              )}
            </td>
            <td className="px-5 py-4 text-neutral-300">
              {engineSummary(engine)}
            </td>
            <td className="px-5 py-4 whitespace-nowrap text-neutral-300 tabular-nums">
              {displacement(engine.displacement_cc)}
            </td>
            <td className="px-5 py-4 text-neutral-300">
              {labelOf(aspirations, engine.aspiration)}
            </td>
            <td className="px-5 py-4 text-neutral-300 tabular-nums">
              {engine.versions_count ?? 0}
            </td>
          </tr>
        ))}
      </ListTable>
    </>
  )
}

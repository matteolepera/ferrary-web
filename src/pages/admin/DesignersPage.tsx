import { useState } from 'react'
import { PlusIcon } from '@phosphor-icons/react'
import { backendMessage } from '@/api/errors'
import { DesignerModal } from '@/components/admin/designers/DesignerModal'
import { designerTypes } from '@/components/admin/designers/options'
import { AdminSearch } from '@/components/admin/ui/AdminSearch'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { ClearFilters } from '@/components/admin/ui/ClearFilters'
import {
  FilterPills,
  type FilterOption,
} from '@/components/admin/ui/FilterPills'
import { FilterSelect } from '@/components/admin/ui/FilterSelect'
import { ListHeader } from '@/components/admin/ui/ListHeader'
import { ListTable, listRowClass } from '@/components/admin/ui/ListTable'
import { RowActions } from '@/components/admin/ui/RowActions'
import { labelOf } from '@/components/admin/versions/options'
import {
  useAdminDesigners,
  useDesignerActions,
} from '@/hooks/useAdminDesigners'
import { useListParams } from '@/hooks/useListParams'
import { countryOptions } from '@/lib/countries'
import { countryName } from '@/lib/format'
import { paginate } from '@/lib/paginate'
import type { DesignerType } from '@/types/admin'

const columns = ['Designer', 'Tipo', 'Paese', 'Versioni', '']

/** Le pillole dei tipi: undefined vuol dire "tutti" */
const typeFilters: FilterOption<DesignerType>[] = [
  { value: undefined, label: 'Tutti' },
  ...designerTypes,
]

/**
 * I designer: studi e persone che hanno disegnato le Ferrari.
 * Arrivano tutti: ricerca, filtri e pagine lavorano nel browser.
 */
export function DesignersPage() {
  const { data: designers, isPending, isError } = useAdminDesigners()
  const { remove } = useDesignerActions()
  const list = useListParams(['type', 'country'] as const)
  // La finestra aperta: "new" per un designer nuovo, l'id per modificarne uno, null se chiusa
  const [modal, setModal] = useState<number | 'new' | null>(null)

  // Solo i valori previsti: "?type=pippo" viene ignorato
  const type = designerTypes.find(
    (option) => option.value === list.filters.type,
  )?.value
  const countries = countryOptions(
    (designers ?? []).map((designer) => designer.country),
  )

  const query = list.search.trim().toLowerCase()
  const visible = (designers ?? [])
    .filter(
      (designer) =>
        (!query || designer.name.toLowerCase().includes(query)) &&
        (!type || designer.type === type) &&
        (!list.filters.country || designer.country === list.filters.country),
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'it'))
  const page = paginate(visible, list.page)

  const current =
    typeof modal === 'number'
      ? designers?.find((designer) => designer.id === modal)
      : undefined
  const count = designers
    ? `${visible.length} designer${list.hasFilters ? ' con questi filtri' : ''}`
    : undefined

  return (
    <>
      <title>Designer – Ferrary</title>

      <ListHeader
        eyebrow="Catalogo"
        title="Designer"
        count={count}
        action={
          <button
            type="button"
            onClick={() => setModal('new')}
            className={adminButtonClass('primary')}
          >
            <PlusIcon aria-hidden="true" size={16} />
            Nuovo designer
          </button>
        }
      />

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <AdminSearch
          label="Cerca un designer"
          placeholder="Cerca un designer"
          value={list.search}
          // replace: ogni lettera non deve diventare un passo della cronologia
          onSearch={(search) => list.set({ search }, { replace: true })}
        />
        <FilterPills
          label="Filtra per tipo"
          options={typeFilters}
          value={type}
          onChange={(value) => list.set({ type: value })}
        />
        <FilterSelect
          label="Filtra per paese"
          value={list.filters.country ?? ''}
          onChange={(event) =>
            list.set({ country: event.target.value || undefined })
          }
        >
          <option value="">Tutti i paesi</option>
          {countries.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FilterSelect>
        <ClearFilters visible={list.hasFilters} onClear={list.clear} />
      </div>

      <ListTable
        caption="Designer del catalogo"
        columns={columns}
        minWidth="min-w-[36rem]"
        isPending={isPending}
        error={isError ? 'Impossibile caricare i designer.' : null}
        empty={
          visible.length === 0
            ? list.hasFilters
              ? 'Nessun designer con questi filtri.'
              : 'Nessun designer nel catalogo: crea il primo.'
            : null
        }
        page={page.page}
        lastPage={page.lastPage}
        onPageChange={(value) => list.set({ page: value })}
        footer={
          remove.isError && (
            <p
              role="alert"
              className="border-linea text-errore border-t px-6 py-4 text-[0.8125rem]"
            >
              {backendMessage(remove.error) ??
                'Impossibile eliminare il designer. Riprova.'}
            </p>
          )
        }
      >
        {page.items.map((designer) => (
          <tr key={designer.id} className={listRowClass}>
            <td className="py-4 pr-5 pl-6">
              <p className="font-display text-[0.9375rem] font-bold">
                {designer.name}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">{designer.slug}</p>
            </td>
            <td className="px-5 py-4 text-neutral-300">
              {labelOf(designerTypes, designer.type)}
            </td>
            <td className="px-5 py-4 text-neutral-300">
              {countryName(designer.country) ?? '—'}
            </td>
            <td className="px-5 py-4 text-neutral-300 tabular-nums">
              {designer.versions_count ?? 0}
            </td>
            <td className="px-5 py-4">
              <RowActions
                name={designer.name}
                onEdit={() => setModal(designer.id)}
                onStartDelete={() => remove.reset()}
                onDelete={(done) =>
                  remove.mutate(designer.id, { onSuccess: done })
                }
                isPending={remove.isPending}
              />
            </td>
          </tr>
        ))}
      </ListTable>

      {/* La finestra si monta solo quando serve, e si smonta alla chiusura: riparte sempre pulita */}
      {modal !== null && (
        <DesignerModal
          key={modal}
          designer={current}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}

import { useState } from 'react'
import { PlusIcon } from '@phosphor-icons/react'
import { backendMessage } from '@/api/errors'
import { DriverModal } from '@/components/admin/drivers/DriverModal'
import { AdminSearch } from '@/components/admin/ui/AdminSearch'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'
import { ClearFilters } from '@/components/admin/ui/ClearFilters'
import { FilterSelect } from '@/components/admin/ui/FilterSelect'
import { ListHeader } from '@/components/admin/ui/ListHeader'
import { ListTable, listRowClass } from '@/components/admin/ui/ListTable'
import { RowActions } from '@/components/admin/ui/RowActions'
import { useAdminDrivers, useDriverActions } from '@/hooks/useAdminDrivers'
import { useListParams } from '@/hooks/useListParams'
import { birthDate } from '@/lib/birthDate'
import { countryOptions } from '@/lib/countries'
import { countryName } from '@/lib/format'
import { paginate } from '@/lib/paginate'

const columns = ['Pilota', 'Nazionalità', 'Nato il', 'Versioni', '']

/**
 * I piloti che hanno guidato le Ferrari da corsa, in ordine di cognome.
 * Arrivano tutti: ricerca, filtri e pagine lavorano nel browser.
 */
export function DriversPage() {
  const { data: drivers, isPending, isError } = useAdminDrivers()
  const { remove } = useDriverActions()
  const list = useListParams(['nationality'] as const)
  // La finestra aperta: "new" per un pilota nuovo, l'id per modificarne uno, null se chiusa
  const [modal, setModal] = useState<number | 'new' | null>(null)

  const nationalities = countryOptions(
    (drivers ?? []).map((driver) => driver.nationality),
  )

  const query = list.search.trim().toLowerCase()
  const visible = (drivers ?? [])
    .filter(
      (driver) =>
        (!query ||
          `${driver.first_name} ${driver.last_name}`
            .toLowerCase()
            .includes(query)) &&
        (!list.filters.nationality ||
          driver.nationality === list.filters.nationality),
    )
    // Per cognome, e a parità di cognome per nome: come negli annuari
    .sort(
      (a, b) =>
        a.last_name.localeCompare(b.last_name, 'it') ||
        a.first_name.localeCompare(b.first_name, 'it'),
    )
  const page = paginate(visible, list.page)

  const current =
    typeof modal === 'number'
      ? drivers?.find((driver) => driver.id === modal)
      : undefined
  const count = drivers
    ? `${visible.length === 1 ? '1 pilota' : `${visible.length} piloti`}${list.hasFilters ? ' con questi filtri' : ''}`
    : undefined

  return (
    <>
      <title>Piloti – Ferrary</title>

      <ListHeader
        eyebrow="Catalogo"
        title="Piloti"
        count={count}
        action={
          <button
            type="button"
            onClick={() => setModal('new')}
            className={adminButtonClass('primary')}
          >
            <PlusIcon aria-hidden="true" size={16} />
            Nuovo pilota
          </button>
        }
      />

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <AdminSearch
          label="Cerca un pilota"
          placeholder="Nome o cognome"
          value={list.search}
          // replace: ogni lettera non deve diventare un passo della cronologia
          onSearch={(search) => list.set({ search }, { replace: true })}
        />
        <FilterSelect
          label="Filtra per nazionalità"
          value={list.filters.nationality ?? ''}
          onChange={(event) =>
            list.set({ nationality: event.target.value || undefined })
          }
        >
          <option value="">Tutte le nazionalità</option>
          {nationalities.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FilterSelect>
        <ClearFilters visible={list.hasFilters} onClear={list.clear} />
      </div>

      <ListTable
        caption="Piloti del catalogo"
        columns={columns}
        minWidth="min-w-[38rem]"
        isPending={isPending}
        error={isError ? 'Impossibile caricare i piloti.' : null}
        empty={
          visible.length === 0
            ? list.hasFilters
              ? 'Nessun pilota con questi filtri.'
              : 'Nessun pilota nel catalogo: crea il primo.'
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
                'Impossibile eliminare il pilota. Riprova.'}
            </p>
          )
        }
      >
        {page.items.map((driver) => {
          const name = `${driver.first_name} ${driver.last_name}`

          return (
            <tr key={driver.id} className={listRowClass}>
              <td className="py-4 pr-5 pl-6">
                <p className="font-display text-[0.9375rem] font-bold">
                  {name}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">{driver.slug}</p>
              </td>
              <td className="px-5 py-4 text-neutral-300">
                {countryName(driver.nationality) ?? '—'}
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-neutral-300">
                {birthDate(driver.birth_date) ?? '—'}
              </td>
              <td className="px-5 py-4 text-neutral-300 tabular-nums">
                {driver.versions_count ?? 0}
              </td>
              <td className="px-5 py-4">
                <RowActions
                  name={name}
                  onEdit={() => setModal(driver.id)}
                  onStartDelete={() => remove.reset()}
                  onDelete={(done) =>
                    remove.mutate(driver.id, { onSuccess: done })
                  }
                  isPending={remove.isPending}
                />
              </td>
            </tr>
          )
        })}
      </ListTable>

      {/* La finestra si monta solo quando serve, e si smonta alla chiusura: riparte sempre pulita */}
      {modal !== null && (
        <DriverModal
          key={modal}
          driver={current}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
